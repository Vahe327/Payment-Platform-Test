from decimal import Decimal

from sanic import Blueprint, Request, json

from app.api.deps import get_session
from app.api.middleware.auth import require_role
from app.services.user import (
    create_account,
    deposit_to_account,
    get_user,
    get_user_accounts,
    get_user_payments,
    transfer_between_accounts,
    withdraw_from_account,
)

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


@bp.post("/me/accounts")
async def create_my_account(request: Request) -> json:  # type: ignore[valid-type]
    user_id = require_role(request, "user")
    session = get_session(request)
    account = await create_account(session, user_id)
    return json({"id": account.id, "balance": str(account.balance)}, status=201)


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


@bp.post("/me/accounts/<account_id:int>/deposit")
async def deposit(request: Request, account_id: int) -> json:  # type: ignore[valid-type]
    user_id = require_role(request, "user")
    session = get_session(request)
    body = request.json or {}
    amount = Decimal(str(body.get("amount", 0)))
    result = await deposit_to_account(session, user_id, account_id, amount)
    return json(result)


@bp.post("/me/accounts/<account_id:int>/withdraw")
async def withdraw(request: Request, account_id: int) -> json:  # type: ignore[valid-type]
    user_id = require_role(request, "user")
    session = get_session(request)
    body = request.json or {}
    amount = Decimal(str(body.get("amount", 0)))
    result = await withdraw_from_account(session, user_id, account_id, amount)
    return json(result)


@bp.post("/me/transfers")
async def transfer(request: Request) -> json:  # type: ignore[valid-type]
    user_id = require_role(request, "user")
    session = get_session(request)
    body = request.json or {}
    from_id = int(body.get("from_account_id", 0))
    to_id = int(body.get("to_account_id", 0))
    amount = Decimal(str(body.get("amount", 0)))
    result = await transfer_between_accounts(session, user_id, from_id, to_id, amount)
    return json(result)
