from fastapi import APIRouter

from backend.app.admin.api.router import v1 as admin_v1
from backend.app.agent.api.router import v1 as agent_v1

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    健康检查接口
    """
    return {"status": "ok", "message": "服务正常运行"}


router.include_router(admin_v1)
router.include_router(agent_v1)
