from typing import List, Optional

from backend.common.enums import StrEnum
from pydantic import BaseModel


class AgentType(StrEnum):
    CLASSIC_BARTENDER = "classic_bartender"
    CREATIVE_BARTENDER = "creative_bartender"
    CASUAL_CHAT = "casual_chat"


class ModelName(StrEnum):
    """模型枚举类"""

    DEEPSEEK_V3 = "deepseek-v3-250324"
    DEEPSEEK_R1 = "deepseek-r1-250120"


class AlcoholLevel(StrEnum):
    """酒精浓度选项"""

    LOW = "low"  # 低度
    MEDIUM = "medium"  # 中度
    HIGH = "high"  # 高度
    ANY = "any"  # 任意


class DifficultyLevel(StrEnum):
    """制作难度选项"""

    EASY = "easy"  # 简单
    MEDIUM = "medium"  # 中等
    HARD = "hard"  # 困难
    ANY = "any"  # 任意


class AgentRequest(BaseModel):
    message: str
    model: ModelName = ModelName.DEEPSEEK_V3
    user_id: Optional[str] = None
    session_id: Optional[str] = None


class BartenderRequest(AgentRequest):
    """Request model for bartender agents"""

    # 选择题选项
    alcohol_level: Optional[AlcoholLevel] = AlcoholLevel.ANY
    has_tools: Optional[bool] = None
    difficulty_level: Optional[DifficultyLevel] = DifficultyLevel.ANY
    base_spirits: Optional[List[str]] = None

    def get_user_prompt(self) -> str:
        """组装用户提示"""
        # 用户需求是必填的，作为基础信息
        prompt = f"用户需求: {self.message}\n"

        # 添加其他可选条件
        conditions = []

        # 添加酒精浓度选择
        if self.alcohol_level != AlcoholLevel.ANY:
            conditions.append(f"酒精浓度: {self.alcohol_level.value}")

        # 添加工具情况
        if self.has_tools is not None:
            conditions.append(f"是否有调酒工具: {'有' if self.has_tools else '没有'}")

        # 添加制作难度
        if self.difficulty_level != DifficultyLevel.ANY:
            conditions.append(f"制作难度: {self.difficulty_level.value}")

        # 添加可用基酒
        if self.base_spirits:
            conditions.append(f"可用的基酒: {', '.join(self.base_spirits)}")

        # 如果有其他条件，添加到提示中
        if conditions:
            prompt += "其他条件:\n" + "\n".join(conditions)

        return prompt
