from typing import Optional

from backend.common.enums import StrEnum
from pydantic import BaseModel


class AgentType(StrEnum):
    SAGE = "sage"
    SCHOLAR = "scholar"
    BARTENDER = "bartender"
    CASUAL_CHAT = "casual_chat"


class ModelName(StrEnum):
    """模型枚举类"""
    DEEPSEEK_V3 = "deepseek-v3-250324"
    DEEPSEEK_R1 = "deepseek-r1-250120"


class AgentRequest(BaseModel):
    """Request model for an running an agent"""

    message: str
    stream: bool = True
    model: ModelName = ModelName.DEEPSEEK_V3
    user_id: Optional[str] = None
    session_id: Optional[str] = None