from pydantic import BaseModel


class PaymentResponse(BaseModel):
    id: int
    transaction_id: str
    account_id: int
    amount: str
    created_at: str
