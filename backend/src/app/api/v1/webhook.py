from sanic import Blueprint, Request, json

from app.api.deps import get_session
from app.schemas.webhook import WebhookPaymentRequest
from app.services.payment import process_webhook

bp = Blueprint("webhook", url_prefix="/api/v1/webhooks")


@bp.post("/payment")
async def payment_webhook(request: Request) -> json:  # type: ignore[valid-type]
    data = WebhookPaymentRequest.model_validate(request.json)
    session = get_session(request)
    result = await process_webhook(
        session=session,
        transaction_id=data.transaction_id,
        user_id=data.user_id,
        account_id=data.account_id,
        amount=data.amount,
        signature=data.signature,
    )
    return json(result)
