import asyncio
import os
from collections.abc import AsyncGenerator, Generator
from decimal import Decimal

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://app:app@localhost:5432/app")
os.environ.setdefault("JWT_SECRET", "test-jwt-secret")
os.environ.setdefault("WEBHOOK_SECRET_KEY", "gfdmhghif38yrf9ew0jkf32")

from app.db.base import Base
from app.db.models import Account, Admin, Payment, User  # noqa: F401
from app.main import create_app
from app.security.jwt import create_access_token
from app.security.password import hash_password


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def engine():  # type: ignore[no-untyped-def]
    url = os.environ["DATABASE_URL"]
    eng = create_async_engine(url, echo=False)
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield eng
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await eng.dispose()


@pytest_asyncio.fixture
async def session(engine) -> AsyncGenerator[AsyncSession, None]:  # type: ignore[no-untyped-def]
    factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with factory() as sess:
        yield sess
        await sess.rollback()


@pytest_asyncio.fixture
async def seed_data(session: AsyncSession) -> dict[str, object]:
    user = User(
        id=1,
        email="user@example.com",
        password_hash=hash_password("user_pass_123"),
        full_name="Test User",
    )
    admin = Admin(
        id=1,
        email="admin@example.com",
        password_hash=hash_password("admin_pass_123"),
        full_name="Test Admin",
    )
    account = Account(id=1, user_id=1, balance=Decimal("0.00"))
    session.add_all([user, admin, account])
    await session.commit()
    return {"user": user, "admin": admin, "account": account}


@pytest_asyncio.fixture
async def app(engine, seed_data):  # type: ignore[no-untyped-def]
    from app.db import session as session_module

    session_module.engine = engine
    session_module.async_session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    sanic_app = create_app()
    yield sanic_app


@pytest_asyncio.fixture
async def client(app) -> AsyncGenerator[AsyncClient, None]:  # type: ignore[no-untyped-def]
    transport = ASGITransport(app=app)  # type: ignore[arg-type]
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.fixture
def user_token() -> str:
    return create_access_token(1, "user")


@pytest.fixture
def admin_token() -> str:
    return create_access_token(1, "admin")
