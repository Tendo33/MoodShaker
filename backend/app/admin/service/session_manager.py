# backend/app/agent/service/session_manager.py

import uuid

from datetime import datetime, timedelta
from typing import Optional

from backend.app.admin.schema.session_schema import SessionData
from backend.common.log import logger
from backend.database.redis import redis_client

# Redis key 前缀
SESSION_KEY_PREFIX = "user_session"
SESSION_DATA_KEY_PREFIX = "session_data"
COCKTAIL_IMAGE_KEY_PREFIX = "cocktail_image"


async def create_user_session(user_id: int, device_info: Optional[str] = None, ip_address: Optional[str] = None) -> str:
    # 创建用户会话的逻辑
    session_id = str(uuid.uuid4())
    session_data = SessionData(
        user_id=user_id,
        created_at=datetime.now(),
        last_activity=datetime.now(),
        device_info=device_info,
        ip_address=ip_address,
    )
    session_key = f"{SESSION_KEY_PREFIX}:{user_id}:{session_id}"
    session_data_key = f"{SESSION_DATA_KEY_PREFIX}:{user_id}:{session_id}"
    expire_time = timedelta(hours=24)
    await redis_client.setex(session_key, expire_time, datetime.now().isoformat())
    await redis_client.setex(session_data_key, expire_time, session_data.model_dump_json())
    logger.info(f"Created new session for user {user_id}: {session_id}")
    return session_id


async def verify_session(user_id: int, session_id: str) -> bool:
    # 验证会话的逻辑
    session_key = f"{SESSION_KEY_PREFIX}:{user_id}:{session_id}"
    session_data_key = f"{SESSION_DATA_KEY_PREFIX}:{user_id}:{session_id}"
    session_exists = await redis_client.exists(session_key)
    if not session_exists:
        logger.warning(f"Session not found for user {user_id}: {session_id}")
        return False
    session_data = await redis_client.get(session_data_key)
    if not session_data:
        logger.warning(f"Session data not found for user {user_id}: {session_id}")
        return False
    session_data_obj = SessionData.model_validate_json(session_data)
    session_data_obj.last_activity = datetime.now()
    await redis_client.setex(session_data_key, timedelta(hours=24), session_data_obj.model_dump_json())
    return True


async def get_session_data(user_id: int, session_id: str) -> Optional[SessionData]:
    # 获取会话数据的逻辑
    session_data_key = f"{SESSION_DATA_KEY_PREFIX}:{user_id}:{session_id}"
    session_data = await redis_client.get(session_data_key)
    if session_data:
        return SessionData.model_validate_json(session_data)
    return None


async def delete_session(user_id: int, session_id: str) -> bool:
    # 删除会话的逻辑
    session_key = f"{SESSION_KEY_PREFIX}:{user_id}:{session_id}"
    session_data_key = f"{SESSION_DATA_KEY_PREFIX}:{user_id}:{session_id}"
    await redis_client.delete(session_key)
    await redis_client.delete(session_data_key)
    logger.info(f"Deleted session for user {user_id}: {session_id}")
    return True


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
