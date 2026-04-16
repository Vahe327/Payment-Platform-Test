from sanic import Blueprint, Request, json

from app.api.deps import get_session
from app.schemas.auth import LoginRequest
from app.services.auth import login_admin

bp = Blueprint("admin_auth", url_prefix="/api/v1/admin/auth")


@bp.post("/login")
async def admin_login(request: Request) -> json:  # type: ignore[valid-type]
    data = LoginRequest.model_validate(request.json)
    session = get_session(request)
    token = await login_admin(session, data.email, data.password)
    return json({"access_token": token, "token_type": "bearer"})
