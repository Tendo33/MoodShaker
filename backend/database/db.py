import sys

from typing import Annotated
from urllib.parse import quote_plus
from uuid import uuid4

from fastapi import Depends
from sqlalchemy import URL
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from backend.common.log import log
from backend.common.model import MappedBase
from backend.core.conf import settings


def create_async_engine_and_session(url: str | URL) -> tuple[AsyncEngine, async_sessionmaker[AsyncSession]]:
    """
    创建异步数据库引擎和会话工厂

    Args:
        url: 数据库连接URL

    Returns:
        tuple[AsyncEngine, async_sessionmaker[AsyncSession]]: 返回数据库引擎和会话工厂的元组

    Raises:
        Exception: 如果数据库连接失败，将记录错误并退出程序
    """
    try:
        # 创建异步数据库引擎
        engine = create_async_engine(
            url,
            echo=settings.DATABASE_ECHO,  # 是否显示SQL语句
            echo_pool=settings.DATABASE_POOL_ECHO,  # 是否显示连接池操作
            future=True,  # 使用SQLAlchemy 2.0风格
            # 连接池配置
            pool_size=10,  # 连接池大小，控制并发连接数
            max_overflow=20,  # 允许超出pool_size的连接数
            pool_timeout=30,  # 获取连接的超时时间（秒）
            pool_recycle=3600,  # 连接回收时间（秒）
            pool_pre_ping=True,  # 在获取连接前进行健康检查
            pool_use_lifo=False,  # 是否使用LIFO（后进先出）策略
        )
    except Exception as e:
        log.error("❌ 数据库链接失败 {}", e)
        sys.exit()
    else:
        # 创建异步会话工厂
        db_session = async_sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
        return engine, db_session


async def get_db():
    """
    数据库会话生成器

    Yields:
        AsyncSession: 异步数据库会话对象
    """
    async with async_db_session() as session:
        yield session


async def create_table() -> None:
    """
    创建数据库表

    使用SQLAlchemy的元数据创建所有定义的表
    """
    async with async_engine.begin() as coon:
        await coon.run_sync(MappedBase.metadata.create_all)


def uuid4_str() -> str:
    """
    生成UUID字符串

    Returns:
        str: 格式化的UUID字符串

    用于解决数据库引擎UUID类型兼容性问题
    """
    return str(uuid4())


# 对数据库密码进行URL编码，确保特殊字符正确处理
mysql_password = quote_plus(settings.DATABASE_PASSWORD)

# 构建数据库连接URL
SQLALCHEMY_DATABASE_URL = (
    f"mysql+asyncmy://{settings.DATABASE_USER}:{mysql_password}@{settings.DATABASE_HOST}:"
    f"{settings.DATABASE_PORT}/{settings.DATABASE_SCHEMA}?charset={settings.DATABASE_CHARSET}"
)

# 初始化数据库引擎和会话工厂
async_engine, async_db_session = create_async_engine_and_session(SQLALCHEMY_DATABASE_URL)

# 定义FastAPI依赖注入使用的会话类型
CurrentSession = Annotated[AsyncSession, Depends(get_db)]
