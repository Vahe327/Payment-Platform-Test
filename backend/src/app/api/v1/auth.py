from sanic import Blueprint, Request, json

from app.api.deps import get_session
from app.schemas.auth import LoginRequest
from app.schemas.user import CreateUserRequest
from app.services.admin import create_user
from app.services.auth import login_user
from app.services.user import create_account

bp = Blueprint("auth", url_prefix="/api/v1/auth")


@bp.post("/login")
async def user_login(request: Request) -> json:  # type: ignore[valid-type]
    data = LoginRequest.model_validate(request.json)
    session = get_session(request)
    token = await login_user(session, data.email, data.password)
    return json({"access_token": token, "token_type": "bearer"})


@bp.post("/register")
async def user_register(request: Request) -> json:  # type: ignore[valid-type]
    data = CreateUserRequest.model_validate(request.json)
    session = get_session(request)
    user = await create_user(session, data.email, data.password, data.full_name)
    await create_account(session, user.id)
    token = await login_user(session, data.email, data.password)
    return json(
        {
            "user": {"id": user.id, "email": user.email, "full_name": user.full_name},
            "access_token": token,
            "token_type": "bearer",
        },
        status=201,
    )
