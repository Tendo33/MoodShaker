import base64
import traceback

from datetime import timedelta
from typing import List, Optional

import httpx

from backend.app.agent.schema.cocktail_schema import CocktailRecommendation
from backend.common.log import logger
from backend.core.conf import settings
from backend.database.redis import redis_client
from pydantic import BaseModel, Field

# Redis key 前缀
COCKTAIL_IMAGE_KEY_PREFIX = "cocktail_image"


class ImageGenerationRequest(BaseModel):
    """图片生成请求"""

    # black-forest-labs/FLUX.1-schnell

    model: str = Field(default="black-forest-labs/FLUX.1-schnell", description="使用的模型名称")
    prompt: str = Field(..., description="生成图片的提示词")
    negative_prompt: Optional[str] = Field(default=None, description="负面提示词")
    image_size: str = Field(default="1024x1024", description="生成图片的尺寸")
    batch_size: int = Field(default=1, description="生成图片的数量")
    seed: Optional[int] = Field(default=None, description="随机种子")
    num_inference_steps: int = Field(default=20, description="推理步数")
    guidance_scale: float = Field(default=7.5, description="引导尺度")
    prompt_enhancement: bool = Field(default=True, description="是否使用prompt增强")


class ImageGenerationResponse(BaseModel):
    """图片生成响应"""

    images: List[dict[str, str]]
    timings: dict[str, float]
    seed: int


async def generate_cocktail_image(
    cocktail: CocktailRecommendation,
) -> Optional[str]:
    """
    根据鸡尾酒信息生成图片

    Args:
        cocktail: 鸡尾酒推荐信息
        image_size: 生成图片的尺寸，默认为1024x1024
        negative_prompt: 负面提示词
        num_inference_steps: 推理步数，默认为20
        guidance_scale: 引导尺度，默认为7.5
        input_image: 用于图像到图像生成的输入图像(base64格式)

    Returns:
        生成的图片URL，如果生成失败则返回None
    """
    try:
        # 构建prompt
        prompt = f"""
        Create a high-resolution image featuring a cocktail named {cocktail.english_name} prominently in the center, elegantly garnished. The background should be intentionally blurred to draw attention to the {cocktail.english_name} cocktail. Maintain a consistent top-down perspective for various name variations, ensuring the cocktail’s allure is always showcased. Capture the image using a Canon EOS 5D Mark IV camera with a 50mm prime lens, set at ISO 100, shutter speed 1/200 sec, and aperture f/1.8 to create a shallow depth of field. The photo should have a vivid and clear style, highlighting the intricate details and vibrant colors of the {cocktail.english_name} cocktail.
        """  # noqa: E501

        negative_prompt = "low quality, blurry, out of focus, low resolution"

        image_size = "512x512"
        guidance_scale = 4.5
        num_inference_steps = 20
        # 构建请求
        request = ImageGenerationRequest(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image_size=image_size,
            seed=hash(cocktail.name) % 10000000000,  # 使用鸡尾酒名称生成固定seed
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
        )

        # 调用API
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.siliconflow.cn/v1/images/generations",
                headers={"Authorization": f"Bearer {settings.SILICONFLOW_API_KEY}", "Content-Type": "application/json"},
                json=request.model_dump(exclude_none=True),
            )

            if response.status_code == 200:
                result = ImageGenerationResponse.model_validate(response.json())
                return result.images[0]["url"]
            else:
                logger.error(f"Image generation failed with status code {response.status_code}: {response.text}")
                return None

    except Exception as e:
        logger.error(f"Error generating cocktail image: {str(e)}{traceback.format_exc()}")
        return None


async def download_and_convert_to_base64(image_url: str) -> Optional[str]:
    """
    下载图片并转换为base64格式

    Args:
        image_url: 图片URL

    Returns:
        base64编码的图片字符串，如果失败则返回None
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(image_url)
            if response.status_code == 200:
                # 将图片内容转换为base64
                image_bytes = response.content
                base64_image = base64.b64encode(image_bytes).decode("utf-8")
                return base64_image
            else:
                logger.error(f"Failed to download image: {response.status_code}")
                return None
    except Exception as e:
        logger.error(f"Error downloading and converting image: {str(e)}{traceback.format_exc()}")
        return None


async def store_cocktail_image_url(user_id: int, session_id: str, image_url: str) -> None:
    """
    存储鸡尾酒图片URL和base64数据

    Args:
        user_id: 用户ID
        session_id: 会话ID
        image_url: 图片URL
    """
    try:
        # 下载图片并转换为base64
        base64_image = await download_and_convert_to_base64(image_url)
        if not base64_image:
            logger.error(f"Failed to convert image to base64 for user {user_id}: {session_id}")
            return

        # 存储base64数据到Redis
        image_key = f"{COCKTAIL_IMAGE_KEY_PREFIX}:{user_id}:{session_id}"
        expire_time = timedelta(days=3650)
        await redis_client.setex(image_key, expire_time, base64_image)
        logger.info(f"Stored cocktail image base64 for user {user_id}: {session_id}")
    except Exception as e:
        logger.error(f"Error storing cocktail image: {str(e)}{traceback.format_exc()}")


async def get_cocktail_image_url(user_id: int, session_id: str) -> Optional[str]:
    """
    获取鸡尾酒图片base64数据

    Args:
        user_id: 用户ID
        session_id: 会话ID

    Returns:
        图片base64数据,如果不存在则返回None
    """
    image_key = f"{COCKTAIL_IMAGE_KEY_PREFIX}:{user_id}:{session_id}"
    base64_image = await redis_client.get(image_key)
    if base64_image:
        return base64_image
    return None
