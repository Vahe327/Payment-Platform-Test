from pydantic import BaseModel


class WebhookPaymentRequest(BaseModel):
    transaction_id: str
    user_id: int
    account_id: int
    amount: float
    signature: str


class WebhookPaymentResponse(BaseModel):
    status: str
    transaction_id: str
    balance: str
    already_processed: bool
