import hashlib
import hmac


def _format_amount(amount: int | float) -> str:
    if isinstance(amount, float) and amount == int(amount):
        return str(int(amount))
    return str(amount)


def compute_signature(
    account_id: int, amount: int | float, transaction_id: str, user_id: int, secret_key: str
) -> str:
    amount_str = _format_amount(amount)
    raw = f"{account_id}{amount_str}{transaction_id}{user_id}{secret_key}"
    return hashlib.sha256(raw.encode()).hexdigest()


def verify_signature(
    account_id: int,
    amount: int | float,
    transaction_id: str,
    user_id: int,
    secret_key: str,
    signature: str,
) -> bool:
    expected = compute_signature(account_id, amount, transaction_id, user_id, secret_key)
    return hmac.compare_digest(expected, signature)
