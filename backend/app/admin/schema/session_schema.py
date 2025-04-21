from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SessionData(BaseModel):
    user_id: int
    created_at: datetime
    last_activity: datetime
    device_info: Optional[str] = None
    ip_address: Optional[str] = None


class SessionRequest(BaseModel):
    user_id: int


class SessionResponse(BaseModel):
    session_id: str
    expires_in: int  # 会话过期时间(秒)
