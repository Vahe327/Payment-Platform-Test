import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_admin_me(client: AsyncClient, admin_token: str) -> None:
    resp = await client.get(
        "/api/v1/admin/me", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert resp.status_code == 200
    assert resp.json()["email"] == "admin@example.com"


@pytest.mark.asyncio
async def test_admin_list_users(client: AsyncClient, admin_token: str) -> None:
    resp = await client.get(
        "/api/v1/admin/users", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_admin_create_update_delete_user(
    client: AsyncClient, admin_token: str
) -> None:
    headers = {"Authorization": f"Bearer {admin_token}"}

    resp = await client.post(
        "/api/v1/admin/users",
        json={"email": "new@example.com", "password": "pass123", "full_name": "New User"},
        headers=headers,
    )
    assert resp.status_code == 201
    user_id = resp.json()["id"]

    resp = await client.patch(
        f"/api/v1/admin/users/{user_id}",
        json={"full_name": "Updated User"},
        headers=headers,
    )
    assert resp.status_code == 200
    assert resp.json()["full_name"] == "Updated User"

    resp = await client.delete(f"/api/v1/admin/users/{user_id}", headers=headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_user_token_on_admin_route(client: AsyncClient, user_token: str) -> None:
    resp = await client.get(
        "/api/v1/admin/users", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert resp.status_code == 403
