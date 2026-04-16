from passlib.context import CryptContext

_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return _ctx.hash(password)  # type: ignore[no-any-return]


def verify_password(plain: str, hashed: str) -> bool:
    return _ctx.verify(plain, hashed)  # type: ignore[no-any-return]
