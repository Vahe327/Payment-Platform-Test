import asyncio

import pytest
from httpx import AsyncClient

from app.security.signature import compute_signature


@pytest.mark.asyncio
async def test_webhook_concurrency(client: AsyncClient) -> None:
    sig = compute_signature(
        account_id=1,
        amount=10,
        transaction_id="concurrent-test-001",
        user_id=1,
        secret_key="gfdmhghif38yrf9ew0jkf32",
    )
    payload = {
        "transaction_id": "concurrent-test-001",
        "user_id": 1,
        "account_id": 1,
        "amount": 10,
        "signature": sig,
    }

    tasks = [client.post("/api/v1/webhooks/payment", json=payload) for _ in range(5)]
    responses = await asyncio.gather(*tasks)

    success_count = sum(1 for r in responses if r.status_code == 200)
    assert success_count == 5

    not_processed = [r for r in responses if not r.json()["already_processed"]]
    assert len(not_processed) == 1
