from app.security.jwt import create_access_token, decode_access_token


def test_create_and_decode() -> None:
    token = create_access_token(42, "user")
    data = decode_access_token(token)
    assert data["sub"] == "42"
    assert data["role"] == "user"


def test_admin_token() -> None:
    token = create_access_token(1, "admin")
    data = decode_access_token(token)
    assert data["role"] == "admin"
