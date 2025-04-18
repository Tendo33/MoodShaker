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
    brand_recommendation: Optional[str] = Field(None, description="品牌推荐")
    substitute: Optional[str] = Field(None, description="替代品")
    notes: Optional[str] = Field(None, description="特殊说明")


class Step(BaseModel):
    """制作步骤"""
    step_number: int = Field(..., description="步骤序号")
    description: str = Field(..., description="步骤描述")
    time_required: Optional[str] = Field(None, description="所需时间")
    temperature: Optional[str] = Field(None, description="温度要求")
    tips: Optional[str] = Field(None, description="小贴士")
    tools: Optional[List[str]] = Field(None, description="本步骤所需工具")


class Tool(BaseModel):
    """制作工具"""
    name: str = Field(..., description="工具名称")
    description: Optional[str] = Field(None, description="工具说明")
    alternative: Optional[str] = Field(None, description="替代工具")
    usage_tips: Optional[str] = Field(None, description="使用技巧")


class Cocktail(BaseModel):
    """鸡尾酒信息"""
    # 基本信息
    name: str = Field(..., description="鸡尾酒名称")
    english_name: Optional[str] = Field(None, description="英文名称")
    description: str = Field(..., description="鸡尾酒描述")
    image_url: Optional[str] = Field(None, description="鸡尾酒图片URL")
    history: Optional[str] = Field(None, description="历史背景")
    
    # 分类信息
    base_spirit: BaseSpirit = Field(..., description="基酒类型")
    alcohol_level: AlcoholLevel = Field(..., description="酒精浓度")
    flavor_profiles: List[FlavorProfile] = Field(..., description="口味特征")
    occasions: List[Occasion] = Field(..., description="适合场合")
    is_classic: bool = Field(..., description="是否为经典鸡尾酒")
    season_recommendation: Optional[List[str]] = Field(None, description="季节推荐")
    
    # 制作信息
    ingredients: List[Ingredient] = Field(..., description="原料列表")
    steps: List[Step] = Field(..., description="制作步骤")
    tools: List[Tool] = Field(..., description="所需工具")
    difficulty: str = Field(..., description="制作难度", examples=["简单", "中等", "困难"])
    preparation_time: str = Field(..., description="准备时间")
    serving_glass: str = Field(..., description="建议使用的酒杯")
    garnish: Optional[str] = Field(None, description="装饰物")
    serving_temperature: Optional[str] = Field(None, description="饮用温度")
    
    # 搭配建议
    food_pairing: Optional[List[str]] = Field(None, description="食物搭配建议")
    music_recommendation: Optional[List[str]] = Field(None, description="音乐推荐")
    
    # 变体和创意
    variations: Optional[List[str]] = Field(None, description="变体配方")
    creative_tips: Optional[str] = Field(None, description="创意调配建议")
    
    # 标签
    tags: Optional[List[str]] = Field(None, description="标签列表")
    
    # 元数据
    created_at: Optional[str] = Field(None, description="创建时间")
    updated_at: Optional[str] = Field(None, description="更新时间")
    popularity: Optional[int] = Field(None, description="受欢迎程度") 