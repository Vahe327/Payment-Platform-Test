from sanic import Blueprint, Request, json

from app.api.deps import get_session
from app.api.middleware.auth import require_role
from app.schemas.user import CreateUserRequest, UpdateUserRequest
from app.services.admin import create_user, delete_user, list_users, update_user
from app.services.user import get_user

bp = Blueprint("admin", url_prefix="/api/v1/admin")


@bp.get("/me")
async def admin_me(request: Request) -> json:  # type: ignore[valid-type]
    from app.repositories.admin import AdminRepository

    admin_id = require_role(request, "admin")
    session = get_session(request)
    repo = AdminRepository(session)
    admin = await repo.get_by_id(admin_id)
    if not admin:
        return json({"error": {"code": "not_found", "message": "Admin not found"}}, status=404)
    return json({"id": admin.id, "email": admin.email, "full_name": admin.full_name})


@bp.post("/users")
async def admin_create_user(request: Request) -> json:  # type: ignore[valid-type]
    require_role(request, "admin")
    session = get_session(request)
    data = CreateUserRequest.model_validate(request.json)
    user = await create_user(session, data.email, data.password, data.full_name)
    await session.commit()
    return json(
        {"id": user.id, "email": user.email, "full_name": user.full_name}, status=201
    )


@bp.patch("/users/<user_id:int>")
async def admin_update_user(request: Request, user_id: int) -> json:  # type: ignore[valid-type]
    require_role(request, "admin")
    session = get_session(request)
    data = UpdateUserRequest.model_validate(request.json)
    user = await update_user(
        session,
        user_id,
        email=data.email,
        password=data.password,
        full_name=data.full_name,
    )
    await session.commit()
    return json({"id": user.id, "email": user.email, "full_name": user.full_name})


@bp.delete("/users/<user_id:int>")
async def admin_delete_user(request: Request, user_id: int) -> json:  # type: ignore[valid-type]
    require_role(request, "admin")
    session = get_session(request)
    await delete_user(session, user_id)
    await session.commit()
    return json({"status": "deleted"})


@bp.get("/users")
async def admin_list_users(request: Request) -> json:  # type: ignore[valid-type]
    require_role(request, "admin")
    session = get_session(request)
    users = await list_users(session)
    result = []
    for u in users:
        accounts = [{"id": a.id, "balance": str(a.balance)} for a in u.accounts]
        result.append(
            {
                "id": u.id,
                "email": u.email,
                "full_name": u.full_name,
                "accounts": accounts,
            }
        )
    return json(result)


@bp.get("/users/<user_id:int>")
async def admin_get_user(request: Request, user_id: int) -> json:  # type: ignore[valid-type]
    require_role(request, "admin")
    session = get_session(request)
    user = await get_user(session, user_id)
    accounts = [{"id": a.id, "balance": str(a.balance)} for a in user.accounts]
    payments = [
        {
            "id": p.id,
            "transaction_id": p.transaction_id,
            "account_id": p.account_id,
            "amount": str(p.amount),
            "created_at": p.created_at.isoformat(),
        }
        for p in user.payments
    ]
    return json(
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "accounts": accounts,
            "payments": payments,
        }
    )
