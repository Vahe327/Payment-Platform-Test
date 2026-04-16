import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_user_login(client: AsyncClient) -> None:
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "user_pass_123"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_user_login_bad_password(client: AsyncClient) -> None:
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "wrong"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_admin_login(client: AsyncClient) -> None:
    resp = await client.post(
        "/api/v1/admin/auth/login",
        json={"email": "admin@example.com", "password": "admin_pass_123"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
