from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.account import Account
from app.repositories.base import BaseRepository


class AccountRepository(BaseRepository[Account]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Account)

    async def get_by_user_id(self, user_id: int) -> list[Account]:
        result = await self._session.execute(
            select(Account).where(Account.user_id == user_id)
        )
        return list(result.scalars().all())

    async def get_by_id_and_user(self, account_id: int, user_id: int) -> Account | None:
        result = await self._session.execute(
            select(Account).where(Account.id == account_id, Account.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_for_update(self, account_id: int, user_id: int) -> Account | None:
        result = await self._session.execute(
            select(Account)
            .where(Account.id == account_id, Account.user_id == user_id)
            .with_for_update()
        )
        return result.scalar_one_or_none()
