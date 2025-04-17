from fastapi import APIRouter

from backend.app.agent.api.v1.agents import agents_router
from backend.app.agent.api.v1.status import status_router
from backend.core.conf import settings

v1 = APIRouter(prefix=settings.FASTAPI_API_V1_PATH)

v1.include_router(status_router)
v1.include_router(agents_router)
# v1.include_router(playground_router)
