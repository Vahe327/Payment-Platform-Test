import pytest
from httpx import AsyncClient

from app.security.signature import compute_signature


@pytest.mark.asyncio
async def test_webhook_unknown_user(client: AsyncClient) -> None:
    sig = compute_signature(
        account_id=1,
        amount=100,
        transaction_id="unknown-user-test",
        user_id=9999,
        secret_key="gfdmhghif38yrf9ew0jkf32",
    )
    resp = await client.post(
        "/api/v1/webhooks/payment",
        json={
            "transaction_id": "unknown-user-test",
            "user_id": 9999,
            "account_id": 1,
            "amount": 100,
            "signature": sig,
        },
    )
    assert resp.status_code == 404
    assert resp.json()["error"]["code"] == "user_not_found"
