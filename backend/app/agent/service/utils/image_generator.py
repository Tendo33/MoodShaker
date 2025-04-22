
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
    image: Optional[str] = Field(default=None, description="用于图像到图像生成的输入图像(base64格式)")


class ImageGenerationResponse(BaseModel):
    """图片生成响应"""

    images: List[dict[str, str]]
    timings: dict[str, float]
    seed: int


async def generate_cocktail_image(
    cocktail: CocktailRecommendation,
    image_size: str = "1024x1024",
    negative_prompt: Optional[str] = None,
    num_inference_steps: int = 20,
    guidance_scale: float = 7.5,
    input_image: Optional[str] = None,
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
        一杯{cocktail.name}鸡尾酒, 
        基酒是{cocktail.base_spirit},
        酒精浓度{cocktail.alcohol_level},
        口味特征包括{", ".join(cocktail.flavor_profiles)},
        使用{cocktail.serving_glass}盛装,
        装饰精美, 光线明亮, 专业摄影风格
        """

        # 构建请求
        request = ImageGenerationRequest(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image_size=image_size,
            seed=hash(cocktail.name) % 10000000000,  # 使用鸡尾酒名称生成固定seed
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
            image=input_image,
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
        logger.error(f"Error generating cocktail image: {str(e)}")
        return None


async def store_cocktail_image_url(user_id: int, session_id: str, image_url: str) -> None:
    """
    存储鸡尾酒图片URL

    Args:
        user_id: 用户ID
        session_id: 会话ID
        image_url: 图片URL
    """
    image_key = f"{COCKTAIL_IMAGE_KEY_PREFIX}:{user_id}:{session_id}"
    # 设置过期时间 永不过期
    expire_time = timedelta(days=3650)
    await redis_client.setex(image_key, expire_time, image_url)
    logger.info(f"Stored cocktail image URL for user {user_id}: {session_id}")


async def get_cocktail_image_url(user_id: int, session_id: str) -> Optional[str]:
    """
    获取鸡尾酒图片URL

    Args:
        user_id: 用户ID
        session_id: 会话ID

    Returns:
        图片URL,如果不存在则返回None
    """
    image_key = f"{COCKTAIL_IMAGE_KEY_PREFIX}:{user_id}:{session_id}"
    image_url = await redis_client.get(image_key)
    if image_url:
        return image_url.decode()
    return None
