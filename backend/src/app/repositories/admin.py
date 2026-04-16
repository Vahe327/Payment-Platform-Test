from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.admin import Admin
from app.repositories.base import BaseRepository


class AdminRepository(BaseRepository[Admin]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Admin)

    async def get_by_email(self, email: str) -> Admin | None:
        result = await self._session.execute(select(Admin).where(Admin.email == email))
        return result.scalar_one_or_none()
