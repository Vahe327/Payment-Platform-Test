import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_me(client: AsyncClient, user_token: str) -> None:
    resp = await client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "user@example.com"
    assert data["full_name"] == "Test User"


@pytest.mark.asyncio
async def test_get_me_no_token(client: AsyncClient) -> None:
    resp = await client.get("/api/v1/users/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_me_admin_token_forbidden(client: AsyncClient, admin_token: str) -> None:
    resp = await client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_get_accounts(client: AsyncClient, user_token: str) -> None:
    resp = await client.get(
        "/api/v1/users/me/accounts", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_get_payments(client: AsyncClient, user_token: str) -> None:
    resp = await client.get(
        "/api/v1/users/me/payments", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
