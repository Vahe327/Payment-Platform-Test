import pytest
from httpx import AsyncClient

from app.security.signature import compute_signature


@pytest.mark.asyncio
async def test_webhook_auto_create_account(client: AsyncClient) -> None:
    sig = compute_signature(
        account_id=999,
        amount=200,
        transaction_id="auto-account-test",
        user_id=1,
        secret_key="gfdmhghif38yrf9ew0jkf32",
    )
    resp = await client.post(
        "/api/v1/webhooks/payment",
        json={
            "transaction_id": "auto-account-test",
            "user_id": 1,
            "account_id": 999,
            "amount": 200,
            "signature": sig,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "accepted"
    assert data["balance"] == "200.00"
