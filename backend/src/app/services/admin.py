from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.exceptions import AppError, NotFoundError
from app.repositories.user import UserRepository
from app.security.password import hash_password


async def create_user(
    session: AsyncSession, email: str, password: str, full_name: str
) -> User:
    repo = UserRepository(session)
    existing = await repo.get_by_email(email)
    if existing:
        raise AppError(code="email_taken", message="Email already in use", status=409)
    user = await repo.create(
        email=email,
        password_hash=hash_password(password),
        full_name=full_name,
    )
    return user


async def update_user(
    session: AsyncSession,
    user_id: int,
    email: str | None = None,
    password: str | None = None,
    full_name: str | None = None,
) -> User:
    repo = UserRepository(session)
    user = await repo.get_by_id(user_id)
    if not user:
        raise NotFoundError(code="user_not_found", message="User not found")
    kwargs: dict[str, str] = {}
    if email is not None:
        kwargs["email"] = email
    if password is not None:
        kwargs["password_hash"] = hash_password(password)
    if full_name is not None:
        kwargs["full_name"] = full_name
    return await repo.update(user, **kwargs)


async def delete_user(session: AsyncSession, user_id: int) -> None:
    repo = UserRepository(session)
    user = await repo.get_by_id(user_id)
    if not user:
        raise NotFoundError(code="user_not_found", message="User not found")
    await repo.delete(user)


async def list_users(session: AsyncSession) -> list[User]:
    repo = UserRepository(session)
    return await repo.get_all()
