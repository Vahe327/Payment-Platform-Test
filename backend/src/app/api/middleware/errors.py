from sanic import Request, Sanic, json
from sanic.exceptions import NotFound, SanicException

from app.exceptions import AppError


def setup_error_handlers(app: Sanic) -> None:
    @app.exception(AppError)
    async def handle_app_error(request: Request, exception: AppError) -> json:  # type: ignore[valid-type]
        return json(
            {"error": {"code": exception.code, "message": exception.message}},
            status=exception.status,
        )

    @app.exception(NotFound)
    async def handle_not_found(request: Request, exception: NotFound) -> json:  # type: ignore[valid-type]
        return json(
            {"error": {"code": "not_found", "message": "Resource not found"}},
            status=404,
        )

    @app.exception(SanicException)
    async def handle_sanic_error(request: Request, exception: SanicException) -> json:  # type: ignore[valid-type]
        return json(
            {"error": {"code": "server_error", "message": str(exception)}},
            status=exception.status_code,
        )

    @app.exception(Exception)
    async def handle_generic(request: Request, exception: Exception) -> json:  # type: ignore[valid-type]
        import logging

        logging.getLogger("app").exception("Unhandled exception")
        return json(
            {"error": {"code": "internal_error", "message": "Internal server error"}},
            status=500,
        )
