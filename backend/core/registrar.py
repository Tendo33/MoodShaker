import os.path

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.responses import RedirectResponse
from fastapi_limiter import FastAPILimiter
from fastapi_pagination import add_pagination

from backend.app.router import router
from backend.common.exception.exception_handler import register_exception
from backend.common.log import set_custom_logfile, setup_logging
from backend.core.conf import settings
from backend.core.path_conf import STATIC_DIR
from backend.database.db import create_table
from backend.database.redis import redis_client
from backend.utils.demo_site import demo_site
from backend.utils.health_check import ensure_unique_route_names, http_limit_callback
from backend.utils.openapi import simplify_operation_ids


@asynccontextmanager
async def register_init(app: FastAPI):
    """
    启动初始化

    :return:
    """
    # 创建数据库表
    await create_table()
    # 连接 redis
    await redis_client.open()
    # 初始化 limiter
    await FastAPILimiter.init(
        redis_client, prefix=settings.REQUEST_LIMITER_REDIS_PREFIX, http_callback=http_limit_callback
    )

    yield

    # 关闭 redis 连接
    await redis_client.close()
    # 关闭 limiter
    await FastAPILimiter.close()


def register_app():
    # FastAPI
    app = FastAPI(
        title=settings.FASTAPI_TITLE,
        version=settings.FASTAPI_VERSION,
        description=settings.FASTAPI_DESCRIPTION,
        docs_url=settings.FASTAPI_DOCS_URL,
        redoc_url=settings.FASTAPI_REDOC_URL,
        openapi_url=settings.FASTAPI_OPENAPI_URL,
        lifespan=register_init,
    )
    # 首页重定向

    @app.get("/")
    async def welcome():
        return RedirectResponse(url="/docs")

    # 日志
    register_logger()

    # 静态文件
    register_static_file(app)

    # 中间件
    register_middleware(app)

    # 路由
    register_router(app)

    # 分页
    register_page(app)

    # 全局异常处理
    register_exception(app)

    return app


def register_logger() -> None:
    """
    系统日志

    :return:
    """
    setup_logging()
    set_custom_logfile()


def register_static_file(app: FastAPI):
    """
    静态文件交互开发模式, 生产将自动关闭，生产必须使用 nginx 静态资源服务

    :param app:
    :return:
    """
    if settings.FASTAPI_STATIC_FILES:
        from fastapi.staticfiles import StaticFiles

        if not os.path.exists(STATIC_DIR):
            os.makedirs(STATIC_DIR)

        app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


def register_middleware(app) -> None:
    # 接口访问日志
    if settings.MIDDLEWARE_ACCESS:
        from backend.middleware.access_middle import AccessMiddleware

        app.add_middleware(AccessMiddleware)
    # 跨域
    if settings.MIDDLEWARE_CORS:
        from starlette.middleware.cors import CORSMiddleware

        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )


def register_router(app: FastAPI):
    """
    路由

    :param app: FastAPI
    :return:
    """
    dependencies = [Depends(demo_site)] if settings.DEMO_MODE else None

    # API
    app.include_router(router, dependencies=dependencies)

    # Extra
    ensure_unique_route_names(app)
    simplify_operation_ids(app)


def register_page(app: FastAPI):
    """
    分页查询

    :param app:
    :return:
    """
    add_pagination(app)
