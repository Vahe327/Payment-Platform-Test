from sanic import Request, Sanic

from app.db.session import async_session_factory


def setup_db_middleware(app: Sanic) -> None:
    @app.middleware("request")
    async def inject_session(request: Request) -> None:
        request.ctx.session = async_session_factory()

    @app.middleware("response")
    async def close_session(request: Request, response: object) -> None:
        session = getattr(request.ctx, "session", None)
        if session:
            await session.close()
