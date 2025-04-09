from fastapi import APIRouter

from backend.app.agent.api.v1.agents import agents_router
from backend.app.agent.api.v1.playground import playground_router
from backend.app.agent.api.v1.status import status_router

v1_router = APIRouter(prefix="/v1")
v1_router.include_router(status_router)
v1_router.include_router(agents_router)
v1_router.include_router(playground_router)
