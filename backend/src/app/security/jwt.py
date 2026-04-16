from datetime import UTC, datetime, timedelta

import jwt

from app.config import settings


def create_access_token(subject_id: int, role: str) -> str:
    expire = datetime.now(UTC) + timedelta(minutes=settings.JWT_TTL_MINUTES)
    payload = {
        "sub": str(subject_id),
        "role": role,
        "exp": expire,
        "iat": datetime.now(UTC),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, str]:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])  # type: ignore[no-any-return]
