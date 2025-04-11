from fastapi import APIRouter

from backend.utils.timezone import current_utc_str

######################################################
# Router for API status
######################################################

status_router = APIRouter(tags=["Status"])


@status_router.get("/health")
def get_health() -> dict[str, str]:
    """Check the health of the Api"""

    return {
        "status": "success",
        "router": "status",
        "path": "/health",
        "utc": current_utc_str(),
    }
