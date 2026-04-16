from app.security.signature import compute_signature, verify_signature


def test_signature_test_vector() -> None:
    sig = compute_signature(
        account_id=1,
        amount=100,
        transaction_id="5eae174f-7cd0-472c-bd36-35660f00132b",
        user_id=1,
        secret_key="gfdmhghif38yrf9ew0jkf32",
    )
    assert sig == "7b47e41efe564a062029da3367bde8844bea0fb049f894687cee5d57f2858bc8"


def test_verify_signature_valid() -> None:
    assert verify_signature(
        account_id=1,
        amount=100,
        transaction_id="5eae174f-7cd0-472c-bd36-35660f00132b",
        user_id=1,
        secret_key="gfdmhghif38yrf9ew0jkf32",
        signature="7b47e41efe564a062029da3367bde8844bea0fb049f894687cee5d57f2858bc8",
    )


def test_verify_signature_invalid() -> None:
    assert not verify_signature(
        account_id=1,
        amount=100,
        transaction_id="5eae174f-7cd0-472c-bd36-35660f00132b",
        user_id=1,
        secret_key="gfdmhghif38yrf9ew0jkf32",
        signature="0000000000000000000000000000000000000000000000000000000000000000",
    )
