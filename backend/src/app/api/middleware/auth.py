from sanic import Request

from app.exceptions import AuthError, ForbiddenError
from app.security.jwt import decode_access_token


def extract_token_data(request: Request) -> dict[str, str]:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise AuthError(code="unauthorized", message="Missing or invalid Authorization header")
    token = auth_header[7:]
    try:
        return decode_access_token(token)
    except Exception:
        raise AuthError(code="unauthorized", message="Invalid or expired token")


def require_role(request: Request, role: str) -> int:
    data = extract_token_data(request)
    if data.get("role") != role:
        raise ForbiddenError(code="forbidden", message="Access denied")
    return int(data["sub"])
