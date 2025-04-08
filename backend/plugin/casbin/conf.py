
from functools import lru_cache

from pydantic_settings import BaseSettings

from backend.core.conf import settings


class CasbinSettings(BaseSettings):
    """Casbin 配置"""

    # RBAC
    RBAC_CASBIN_EXCLUDE: set[tuple[str, str]] = {
        ('POST', f'{settings.FASTAPI_API_V1_PATH}/auth/logout'),
        ('POST', f'{settings.FASTAPI_API_V1_PATH}/auth/token/new'),
    }


@lru_cache
def get_casbin_settings() -> CasbinSettings:
    """获取 Casbin 配置"""
    return CasbinSettings()


casbin_settings = get_casbin_settings()
