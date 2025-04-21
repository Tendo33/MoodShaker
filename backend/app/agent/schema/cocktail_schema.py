from typing import List, Optional

from pydantic import BaseModel, Field


class Ingredient(BaseModel):
    """鸡尾酒原料"""

    name: str = Field(..., description="原料名称")
    amount: str = Field(..., description="原料用量")
    unit: Optional[str] = Field(None, description="计量单位")
    substitute: Optional[str] = Field(None, description="替代品")


class Step(BaseModel):
    """制作步骤"""

    step_number: int = Field(..., description="步骤序号")
    description: str = Field(..., description="步骤描述")
    tips: Optional[str] = Field(None, description="小贴士")


class Tool(BaseModel):
    """制作工具"""

    name: str = Field(..., description="工具名称")
    alternative: Optional[str] = Field(None, description="替代工具")


class CocktailRecommendation(BaseModel):
    """鸡尾酒推荐信息"""

    # 基本信息
    name: str = Field(..., description="鸡尾酒名称")
    description: str = Field(..., description="鸡尾酒描述")
    image_url: Optional[str] = Field(None, description="鸡尾酒图片URL")
    time_required: Optional[str] = Field(None, description="所需时间")
    match_reason: str = Field(..., description="推荐理由")

    # 关键特征
    base_spirit: str = Field(..., description="基酒类型")
    alcohol_level: str = Field(..., description="酒精浓度")
    flavor_profiles: List[str] = Field(..., description="口味特征")

    # 制作信息
    ingredients: List[Ingredient] = Field(..., description="原料列表")
    steps: List[Step] = Field(..., description="制作步骤")
    tools: List[Tool] = Field(..., description="所需工具")
    serving_glass: str = Field(..., description="建议使用的酒杯")
