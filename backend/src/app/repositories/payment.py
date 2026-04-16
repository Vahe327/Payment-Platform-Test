from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.payment import Payment
from app.repositories.base import BaseRepository


class PaymentRepository(BaseRepository[Payment]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Payment)

    async def get_by_transaction_id(self, transaction_id: str) -> Payment | None:
        result = await self._session.execute(
            select(Payment).where(Payment.transaction_id == transaction_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user_id(self, user_id: int) -> list[Payment]:
        result = await self._session.execute(
            select(Payment).where(Payment.user_id == user_id).order_by(Payment.created_at.desc())
        )
        return list(result.scalars().all())
