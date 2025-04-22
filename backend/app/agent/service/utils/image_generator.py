from typing import Optional

import httpx

from backend.app.agent.schema.cocktail_schema import CocktailRecommendation
from backend.core.conf import settings
from pydantic import BaseModel


class ImageGenerationRequest(BaseModel):
    """图片生成请求"""

    model: str = "black-forest-labs/FLUX.1-schnell"
    prompt: str
    image_size: str = "512x512"
    seed: Optional[int] = None
    prompt_enhancement: bool = False


class ImageGenerationResponse(BaseModel):
    """图片生成响应"""

    images: list[dict[str, str]]
    timings: dict[str, int]
    seed: int


async def generate_cocktail_image(cocktail: CocktailRecommendation) -> Optional[str]:
    """
    根据鸡尾酒信息生成图片

    Args:
        cocktail: 鸡尾酒推荐信息

    Returns:
        生成的图片URL
    """
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
        seed=hash(cocktail.name) % 10000000000,  # 使用鸡尾酒名称生成固定seed
    )

    # 调用API
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.ap.siliconflow.com/v1/images/generations",
            headers={"Authorization": f"Bearer {settings.SILICONFLOW_API_KEY}", "Content-Type": "application/json"},
            json=request.model_dump(),
        )

        if response.status_code == 200:
            result = ImageGenerationResponse.model_validate(response.json())
            return result.images[0]["url"]
        else:
            return None
