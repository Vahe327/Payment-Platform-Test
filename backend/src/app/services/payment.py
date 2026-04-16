from decimal import Decimal

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db.models.account import Account
from app.exceptions import AppError, NotFoundError
from app.repositories.account import AccountRepository
from app.repositories.payment import PaymentRepository
from app.repositories.user import UserRepository
from app.security.signature import verify_signature


async def process_webhook(
    session: AsyncSession,
    transaction_id: str,
    user_id: int,
    account_id: int,
    amount: float,
    signature: str,
) -> dict[str, object]:
    if not verify_signature(
        account_id=account_id,
        amount=amount,
        transaction_id=transaction_id,
        user_id=user_id,
        secret_key=settings.WEBHOOK_SECRET_KEY,
        signature=signature,
    ):
        raise AppError(code="invalid_signature", message="Invalid webhook signature", status=400)

    user_repo = UserRepository(session)
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise NotFoundError(code="user_not_found", message="User not found")

    payment_repo = PaymentRepository(session)
    existing = await payment_repo.get_by_transaction_id(transaction_id)
    if existing:
        account_repo = AccountRepository(session)
        account = await account_repo.get_by_id_and_user(account_id, user_id)
        balance = account.balance if account else Decimal("0.00")
        return {
            "status": "accepted",
            "transaction_id": transaction_id,
            "balance": str(balance),
            "already_processed": True,
        }

    account_repo = AccountRepository(session)
    account = await account_repo.get_for_update(account_id, user_id)
    if not account:
        account = Account(id=account_id, user_id=user_id, balance=Decimal("0.00"))
        session.add(account)
        await session.flush()

    try:
        await payment_repo.create(
            transaction_id=transaction_id,
            user_id=user_id,
            account_id=account_id,
            amount=Decimal(str(amount)),
        )
        account.balance += Decimal(str(amount))
        await session.flush()
        await session.commit()
    except IntegrityError:
        await session.rollback()
        account = await account_repo.get_by_id_and_user(account_id, user_id)
        balance = account.balance if account else Decimal("0.00")
        return {
            "status": "accepted",
            "transaction_id": transaction_id,
            "balance": str(balance),
            "already_processed": True,
        }

    return {
        "status": "accepted",
        "transaction_id": transaction_id,
        "balance": str(account.balance),
        "already_processed": False,
    }
