import pytest
from httpx import AsyncClient

from app.security.signature import compute_signature


@pytest.mark.asyncio
async def test_webhook_idempotency(client: AsyncClient) -> None:
    sig = compute_signature(
        account_id=1,
        amount=50,
        transaction_id="idempotent-test-001",
        user_id=1,
        secret_key="gfdmhghif38yrf9ew0jkf32",
    )
    payload = {
        "transaction_id": "idempotent-test-001",
        "user_id": 1,
        "account_id": 1,
        "amount": 50,
        "signature": sig,
    }

    resp1 = await client.post("/api/v1/webhooks/payment", json=payload)
    assert resp1.status_code == 200
    assert resp1.json()["already_processed"] is False

    resp2 = await client.post("/api/v1/webhooks/payment", json=payload)
    assert resp2.status_code == 200
    assert resp2.json()["already_processed"] is True
