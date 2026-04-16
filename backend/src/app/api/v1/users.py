from sanic import Blueprint, Request, json

from app.api.deps import get_session
from app.api.middleware.auth import require_role
from app.services.user import get_user, get_user_accounts, get_user_payments

bp = Blueprint("users", url_prefix="/api/v1/users")


@bp.get("/me")
async def me(request: Request) -> json:  # type: ignore[valid-type]
    user_id = require_role(request, "user")
    session = get_session(request)
    user = await get_user(session, user_id)
    return json({"id": user.id, "email": user.email, "full_name": user.full_name})


@bp.get("/me/accounts")
async def my_accounts(request: Request) -> json:  # type: ignore[valid-type]
    user_id = require_role(request, "user")
    session = get_session(request)
    accounts = await get_user_accounts(session, user_id)
    return json([{"id": a.id, "balance": str(a.balance)} for a in accounts])


@bp.get("/me/payments")
async def my_payments(request: Request) -> json:  # type: ignore[valid-type]
    user_id = require_role(request, "user")
    session = get_session(request)
    payments = await get_user_payments(session, user_id)
    return json(
        [
            {
                "id": p.id,
                "transaction_id": p.transaction_id,
                "account_id": p.account_id,
                "amount": str(p.amount),
                "created_at": p.created_at.isoformat(),
            }
            for p in payments
        ]
    )
