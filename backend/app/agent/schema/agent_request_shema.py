from typing import Optional

from backend.common.enums import StrEnum
from pydantic import BaseModel


class AgentType(StrEnum):
    SAGE = "sage"
    SCHOLAR = "scholar"


class Model(StrEnum):
    """模型枚举类"""
    GPT_4O = "gpt-4o"
    O3_MINI = "o3-mini"


class RunRequest(BaseModel):
    """Request model for an running an agent"""

    message: str
    stream: bool = True
    model: Model = Model.GPT_4O
    user_id: Optional[str] = None
    session_id: Optional[str] = None