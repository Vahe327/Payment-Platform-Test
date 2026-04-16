import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_webhook_bad_signature(client: AsyncClient) -> None:
    resp = await client.post(
        "/api/v1/webhooks/payment",
        json={
            "transaction_id": "bad-sig-test",
            "user_id": 1,
            "account_id": 1,
            "amount": 100,
            "signature": "0000000000000000000000000000000000000000000000000000000000000000",
        },
    )
    assert resp.status_code == 400
    assert resp.json()["error"]["code"] == "invalid_signature"
