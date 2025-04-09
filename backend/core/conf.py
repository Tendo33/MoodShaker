from datetime import datetime
from functools import lru_cache
from typing import Literal

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from backend.core.path_conf import BasePath

current_date = datetime.now().strftime("%Y%m%d")


class Settings(BaseSettings):
    """应用配置类，管理所有配置项"""

    model_config = SettingsConfigDict(env_file=f"{BasePath}/.env", env_file_encoding="utf-8", extra="ignore")

    # 环境配置
    ENVIRONMENT: Literal["dev", "pro"]  # 运行环境：开发或生产
    # 模型配置
    OPENAI_API_KEY: str
    OPENAI_API_BASE: str
    SIlICON_API_KEY: str
    SILICON_BASE_URL: str
    # 搜索配置
    EXA_API_KEY: str
    TAVILY_API_KEY: str
    # 日志配置
    LOGFIRE_TOKEN: str
    # 天气配置
    WEATHER_API_KEY: str
    # 地理编码配置
    GEO_API_KEY: str

    # 数据库配置
    DATABASE_HOST: str  # 数据库主机
    DATABASE_PORT: int  # 数据库端口
    DATABASE_USER: str  # 数据库用户
    DATABASE_PASSWORD: str  # 数据库密码

    # Redis配置
    REDIS_HOST: str  # Redis主机
    REDIS_PORT: int  # Redis端口
    REDIS_PASSWORD: str  # Redis密码
    REDIS_DATABASE: int  # Redis数据库编号

    # Token配置
    TOKEN_SECRET_KEY: str  # JWT密钥

    # FastAPI配置
    FASTAPI_API_V1_PATH: str = "/api/v1"  # API基础路径
    FASTAPI_TITLE: str = "Moodshaker"  # API标题
    FASTAPI_VERSION: str = "0.0.1"  # API版本
    FASTAPI_DESCRIPTION: str = "FastAPI Best Architecture"  # API描述
    FASTAPI_DOCS_URL: str = "/docs"  # Swagger文档路径
    FASTAPI_REDOC_URL: str = "/redoc"  # ReDoc文档路径
    FASTAPI_OPENAPI_URL: str | None = "/openapi"  # OpenAPI文档路径
    FASTAPI_STATIC_FILES: bool = False  # 静态文件服务

    @model_validator(mode="before")
    @classmethod
    def validator_api_url(cls, values):
        """生产环境禁用OpenAPI和静态文件"""
        if values["ENVIRONMENT"] == "pro":
            values["FASTAPI_OPENAPI_URL"] = None
            values["FASTAPI_STATIC_FILES"] = False
        return values

    # Postgres配置
    DATABASE_ECHO: bool = False  # SQL语句打印
    DATABASE_POOL_ECHO: bool = False  # 连接池日志
    DATABASE_SCHEMA: str = "moodshaker"  # 数据库名
    DATABASE_CHARSET: str = "utf8mb4"  # 字符集

    # Redis配置
    REDIS_TIMEOUT: int = 10  # 操作超时时间

    # 验证码配置
    CAPTCHA_LOGIN_REDIS_PREFIX: str = "moodshaker:login:captcha"  # 验证码键前缀
    CAPTCHA_LOGIN_EXPIRE_SECONDS: int = 60 * 5  # 验证码过期时间

    # Token配置
    TOKEN_ALGORITHM: str = "HS256"  # JWT算法
    TOKEN_EXPIRE_SECONDS: int = 60 * 60 * 24 * 1  # Token过期时间
    TOKEN_URL_SWAGGER: str = f"{FASTAPI_API_V1_PATH}/auth/login/swagger"  # Swagger登录路径

    # 日志配置
    LOG_STD_LEVEL: str = "INFO"  # 标准输出级别
    LOG_ACCESS_FILE_LEVEL: str = "INFO"  # 访问日志级别
    LOG_ERROR_FILE_LEVEL: str = "ERROR"  # 错误日志级别
    LOG_STD_FORMAT: str = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</> | <lvl>{level: <8}</> | <lvl>{message}</>"  # 标准输出格式
    )
    LOG_FILE_FORMAT: str = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</> | <lvl>{level: <8}</> | <lvl>{message}</>"  # 文件日志格式
    )
    LOG_ACCESS_FILENAME: str = f"moodshaker_access_{current_date}.log"  # 访问日志文件
    LOG_ERROR_FILENAME: str = f"moodshaker_error_{current_date}.log"  # 错误日志文件

    # 中间件配置
    MIDDLEWARE_CORS: bool = True  # CORS中间件
    MIDDLEWARE_ACCESS: bool = True  # 访问日志中间件

    # CORS配置
    CORS_ALLOWED_ORIGINS: list[str] = [
        "http://127.0.0.1:8000",  # 允许的跨域源
    ]
    CORS_EXPOSE_HEADERS: list[str] = [
        "*",  # 允许暴露的响应头
    ]

    # 日期时间配置
    DATETIME_TIMEZONE: str = "Asia/Shanghai"  # 时区
    DATETIME_FORMAT: str = "%Y-%m-%d %H:%M:%S"  # 时间格式

    # 请求限制配置
    REQUEST_LIMITER_REDIS_PREFIX: str = "moodshaker:limiter"  # 限流器键前缀

    # 演示模式配置
    DEMO_MODE: bool = False  # 演示模式开关
    DEMO_MODE_EXCLUDE: set[tuple[str, str]] = {  # 演示模式例外接口
        ("POST", f"{FASTAPI_API_V1_PATH}/auth/login"),
        ("POST", f"{FASTAPI_API_V1_PATH}/auth/logout"),
        ("GET", f"{FASTAPI_API_V1_PATH}/auth/captcha"),
    }


@lru_cache
def get_settings():
    """获取配置实例（带缓存）"""
    return Settings()


settings = get_settings()  # 全局配置实例
