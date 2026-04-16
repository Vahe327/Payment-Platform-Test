import uuid
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.account import Account
from app.db.models.payment import Payment
from app.db.models.user import User
from app.exceptions import AppError, NotFoundError
from app.repositories.account import AccountRepository
from app.repositories.payment import PaymentRepository
from app.repositories.user import UserRepository


async def get_user(session: AsyncSession, user_id: int) -> User:
    repo = UserRepository(session)
    user = await repo.get_by_id(user_id)
    if not user:
        raise NotFoundError(code="user_not_found", message="User not found")
    return user


async def get_user_accounts(session: AsyncSession, user_id: int) -> list[Account]:
    repo = AccountRepository(session)
    return await repo.get_by_user_id(user_id)


async def get_user_payments(session: AsyncSession, user_id: int) -> list[Payment]:
    repo = PaymentRepository(session)
    return await repo.get_by_user_id(user_id)


async def create_account(session: AsyncSession, user_id: int) -> Account:
    repo = AccountRepository(session)
    account = await repo.create(user_id=user_id, balance=Decimal("0.00"))
    await session.commit()
    return account


async def deposit_to_account(
    session: AsyncSession, user_id: int, account_id: int, amount: Decimal
) -> dict[str, object]:
    if amount <= 0:
        raise AppError(code="invalid_amount", message="Amount must be positive", status=400)

    account_repo = AccountRepository(session)
    account = await account_repo.get_for_update(account_id, user_id)
    if not account:
        raise NotFoundError(code="account_not_found", message="Account not found")

    tx_id = str(uuid.uuid4())
    payment_repo = PaymentRepository(session)
    await payment_repo.create(
        transaction_id=tx_id,
        user_id=user_id,
        account_id=account_id,
        amount=amount,
    )
    account.balance += amount
    await session.flush()
    await session.commit()

    return {
        "status": "completed",
        "transaction_id": tx_id,
        "account_id": account_id,
        "amount": str(amount),
        "balance": str(account.balance),
    }


async def withdraw_from_account(
    session: AsyncSession, user_id: int, account_id: int, amount: Decimal
) -> dict[str, object]:
    if amount <= 0:
        raise AppError(code="invalid_amount", message="Amount must be positive", status=400)

    account_repo = AccountRepository(session)
    account = await account_repo.get_for_update(account_id, user_id)
    if not account:
        raise NotFoundError(code="account_not_found", message="Account not found")

    if account.balance < amount:
        raise AppError(code="insufficient_funds", message="Insufficient funds", status=400)

    tx_id = str(uuid.uuid4())
    payment_repo = PaymentRepository(session)
    await payment_repo.create(
        transaction_id=tx_id,
        user_id=user_id,
        account_id=account_id,
        amount=-amount,
    )
    account.balance -= amount
    await session.flush()
    await session.commit()

    return {
        "status": "completed",
        "transaction_id": tx_id,
        "account_id": account_id,
        "amount": str(-amount),
        "balance": str(account.balance),
    }


async def transfer_between_accounts(
    session: AsyncSession,
    user_id: int,
    from_account_id: int,
    to_account_id: int,
    amount: Decimal,
) -> dict[str, object]:
    if amount <= 0:
        raise AppError(code="invalid_amount", message="Amount must be positive", status=400)
    if from_account_id == to_account_id:
        raise AppError(code="same_account", message="Cannot transfer to the same account", status=400)

    account_repo = AccountRepository(session)

    from_acc = await account_repo.get_for_update(from_account_id, user_id)
    if not from_acc:
        raise NotFoundError(code="account_not_found", message="Source account not found")

    to_acc = await account_repo.get_for_update(to_account_id, user_id)
    if not to_acc:
        raise NotFoundError(code="account_not_found", message="Destination account not found")

    if from_acc.balance < amount:
        raise AppError(code="insufficient_funds", message="Insufficient funds", status=400)

    tx_id_out = str(uuid.uuid4())
    tx_id_in = str(uuid.uuid4())
    payment_repo = PaymentRepository(session)

    await payment_repo.create(
        transaction_id=tx_id_out,
        user_id=user_id,
        account_id=from_account_id,
        amount=-amount,
    )
    await payment_repo.create(
        transaction_id=tx_id_in,
        user_id=user_id,
        account_id=to_account_id,
        amount=amount,
    )

    from_acc.balance -= amount
    to_acc.balance += amount
    await session.flush()
    await session.commit()

    return {
        "status": "completed",
        "from_account": {"id": from_account_id, "balance": str(from_acc.balance)},
        "to_account": {"id": to_account_id, "balance": str(to_acc.balance)},
        "amount": str(amount),
    }
