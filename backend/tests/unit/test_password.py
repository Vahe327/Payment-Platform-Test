from app.security.password import hash_password, verify_password


def test_hash_and_verify() -> None:
    hashed = hash_password("my_secret")
    assert verify_password("my_secret", hashed)
    assert not verify_password("wrong", hashed)


def test_different_hashes() -> None:
    h1 = hash_password("same_pass")
    h2 = hash_password("same_pass")
    assert h1 != h2
