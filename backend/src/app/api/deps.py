from sanic import Request
from sqlalchemy.ext.asyncio import AsyncSession


def get_session(request: Request) -> AsyncSession:
    return request.ctx.session  # type: ignore[no-any-return]
