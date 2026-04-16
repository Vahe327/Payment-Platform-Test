from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.account import Account
from app.db.models.payment import Payment
from app.db.models.user import User
from app.exceptions import NotFoundError
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
