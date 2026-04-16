from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import AuthError
from app.repositories.admin import AdminRepository
from app.repositories.user import UserRepository
from app.security.jwt import create_access_token
from app.security.password import verify_password


async def login_user(session: AsyncSession, email: str, password: str) -> str:
    repo = UserRepository(session)
    user = await repo.get_by_email(email)
    if not user or not verify_password(password, user.password_hash):
        raise AuthError(code="invalid_credentials", message="Invalid email or password")
    return create_access_token(user.id, "user")


async def login_admin(session: AsyncSession, email: str, password: str) -> str:
    repo = AdminRepository(session)
    admin = await repo.get_by_email(email)
    if not admin or not verify_password(password, admin.password_hash):
        raise AuthError(code="invalid_credentials", message="Invalid email or password")
    return create_access_token(admin.id, "admin")
