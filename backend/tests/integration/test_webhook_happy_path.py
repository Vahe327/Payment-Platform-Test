import pytest
from httpx import AsyncClient

from app.security.signature import compute_signature


@pytest.mark.asyncio
async def test_webhook_happy_path(client: AsyncClient) -> None:
    sig = compute_signature(
        account_id=1,
        amount=100,
        transaction_id="5eae174f-7cd0-472c-bd36-35660f00132b",
        user_id=1,
        secret_key="gfdmhghif38yrf9ew0jkf32",
    )
    resp = await client.post(
        "/api/v1/webhooks/payment",
        json={
            "transaction_id": "5eae174f-7cd0-472c-bd36-35660f00132b",
            "user_id": 1,
            "account_id": 1,
            "amount": 100,
            "signature": sig,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "accepted"
    assert data["already_processed"] is False
    assert data["balance"] == "100.00"
