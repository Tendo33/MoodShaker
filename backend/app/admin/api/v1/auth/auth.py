from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm

from backend.app.admin.schema.session_schema import SessionRequest, SessionResponse
from backend.app.admin.schema.token_schema import GetLoginToken, GetSwaggerToken
from backend.app.admin.schema.user_schema import Auth2
from backend.app.admin.service.auth_service import auth_service
from backend.app.admin.service.session_manager import (
    create_user_session,
)
from backend.common.response.response_schema import ResponseModel, ResponseSchemaModel, response_base
from backend.common.security.jwt import DependsJwtAuth

router = APIRouter()


@router.post("/login/swagger", summary="swagger 调试专用", description="用于快捷进行 swagger 认证")
async def swagger_login(form_data: OAuth2PasswordRequestForm = Depends()) -> GetSwaggerToken:
    token, user = await auth_service.swagger_login(form_data=form_data)
    return GetSwaggerToken(access_token=token, user=user)  # type: ignore


@router.post("/login", summary="验证码登录")
async def user_login(request: Request, obj: Auth2) -> ResponseSchemaModel[GetLoginToken]:
    data = await auth_service.login(request=request, obj=obj)
    return response_base.success(data=data)


@router.post("/logout", summary="用户登出", dependencies=[DependsJwtAuth])
async def user_logout() -> ResponseModel:
    return response_base.success()


@router.post("/session")
async def create_session(request: SessionRequest) -> SessionResponse:
    """
    创建新会话

    Args:
        request: 包含用户ID的请求

    Returns:
        SessionResponse: 包含会话ID和过期时间的响应
    """
    try:
        session_id = await create_user_session(request.user_id)
        return SessionResponse(session_id=session_id, expires_in=24 * 60 * 600)  # 24小时
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create session: {str(e)}"
        )
