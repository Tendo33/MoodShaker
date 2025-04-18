import os

from pathlib import Path

# 获取项目根目录
# 或使用绝对路径，指到backend目录为止，例如windows：BasePath = D:\git_project\fastapi_mysql
BasePath = Path(__file__).resolve().parent.parent

# alembic 迁移文件存放路径
ALEMBIC_VERSIONS_DIR = os.path.join(BasePath, "alembic", "versions")

# 日志文件路径
LOG_DIR = os.path.join(BasePath, "logs")

# 挂载静态目录
STATIC_DIR = os.path.join(BasePath, "static")
