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


class Occasion(str, Enum):
    """适合场合"""

    PARTY = "派对"
    DINNER = "晚餐"
    BRUNCH = "早午餐"
    AFTER_DINNER = "餐后"
    SUMMER = "夏日"
    WINTER = "冬日"
    ROMANTIC = "浪漫"
    CASUAL = "休闲"


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

    # 核心信息（第一屏展示）
    name: str = Field(..., description="鸡尾酒名称")
    english_name: Optional[str] = Field(None, description="英文名称")
    description: str = Field(..., description="鸡尾酒描述")
    image_url: Optional[str] = Field(None, description="鸡尾酒图片URL")
    match_reason: str = Field(..., description="推荐理由")

    # 关键特征（第二屏展示）
    base_spirit: BaseSpirit = Field(..., description="基酒类型")
    alcohol_level: AlcoholLevel = Field(..., description="酒精浓度")
    flavor_profiles: List[FlavorProfile] = Field(..., description="口味特征")
    difficulty: str = Field(..., description="制作难度", examples=["简单", "中等", "困难"])
    preparation_time: str = Field(..., description="准备时间")

    # 制作信息（第三屏展示）
    ingredients: List[Ingredient] = Field(..., description="原料列表")
    steps: List[Step] = Field(..., description="制作步骤")
    tools: List[Tool] = Field(..., description="所需工具")
    serving_glass: str = Field(..., description="建议使用的酒杯")
    garnish: Optional[str] = Field(None, description="装饰物")

    # 扩展信息（可折叠展示）
    occasions: Optional[List[Occasion]] = Field(None, description="适合场合")
    food_pairing: Optional[List[str]] = Field(None, description="食物搭配建议")
    variations: Optional[List[str]] = Field(None, description="变体配方")
    history: Optional[str] = Field(None, description="历史背景")


class BartenderResponse(BaseModel):
    """调酒师响应"""

    cocktail: CocktailRecommendation = Field(..., description="推荐的鸡尾酒")
    conversation: Optional[str] = Field(None, description="调酒师的对话内容")
    next_question: Optional[str] = Field(None, description="下一个问题（如果有）")
    is_final: bool = Field(..., description="是否为最终推荐")
