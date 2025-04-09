from backend.app.admin.schema.user import GetUserInfo
from backend.common.schema import SchemaBase


class GetSwaggerToken(SchemaBase):
    access_token: str
    token_type: str = "Bearer"
    user: GetUserInfo


class GetLoginToken(GetSwaggerToken):
    access_token_type: str = "Bearer"
