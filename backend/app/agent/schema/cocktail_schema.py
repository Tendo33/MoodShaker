from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class AlcoholLevel(str, Enum):
    """酒精浓度等级"""

    NON_ALCOHOLIC = "无酒精"
    LOW = "低度"
    MEDIUM = "中度"
    HIGH = "高度"


class BaseSpirit(str, Enum):
    """基酒类型"""

    VODKA = "伏特加"
    GIN = "金酒"
    RUM = "朗姆酒"
    TEQUILA = "龙舌兰"
    WHISKEY = "威士忌"
    BRANDY = "白兰地"
    WINE = "葡萄酒"
    BEER = "啤酒"
    NONE = "无基酒"


class FlavorProfile(str, Enum):
    """口味特征"""

    SWEET = "甜"
    SOUR = "酸"
    BITTER = "苦"
    SPICY = "辣"
    FRUITY = "果味"
    HERBAL = "草本"
    FLORAL = "花香"
    SMOKY = "烟熏"
    REFRESHING = "清爽"


class Ingredient(BaseModel):
    """鸡尾酒原料"""

    name: str = Field(..., description="原料名称")
    amount: str = Field(..., description="原料用量")
    unit: Optional[str] = Field(None, description="计量单位")
    substitute: Optional[str] = Field(None, description="替代品")
    is_garnish: bool = Field(False, description="是否为装饰物")


class Step(BaseModel):
    """制作步骤"""

    step_number: int = Field(..., description="步骤序号")
    description: str = Field(..., description="步骤描述")
    tips: Optional[str] = Field(None, description="小贴士")
    time_required: Optional[str] = Field(None, description="所需时间")


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
    match_reason: str = Field(..., description="推荐理由")

    # 关键特征
    base_spirit: BaseSpirit = Field(..., description="基酒类型")
    alcohol_level: AlcoholLevel = Field(..., description="酒精浓度")
    flavor_profiles: List[FlavorProfile] = Field(..., description="口味特征")

    # 制作信息
    ingredients: List[Ingredient] = Field(..., description="原料列表")
    steps: List[Step] = Field(..., description="制作步骤")
    tools: List[Tool] = Field(..., description="所需工具")
    serving_glass: str = Field(..., description="建议使用的酒杯")


class BartenderResponse(BaseModel):
    """调酒师响应"""

    cocktail: Optional[CocktailRecommendation] = Field(None, description="推荐的鸡尾酒")
