from sanic import Request, Sanic
from sanic.response import HTTPResponse, empty

from app.config import settings


def setup_cors(app: Sanic) -> None:
    origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]

    @app.middleware("request")
    async def cors_preflight(request: Request) -> HTTPResponse | None:
        if request.method == "OPTIONS":
            response = empty(status=204)
            origin = request.headers.get("origin", "")
            if origin in origins:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Methods"] = (
                    "GET,POST,PATCH,DELETE,OPTIONS"
                )
                response.headers["Access-Control-Allow-Headers"] = "Authorization,Content-Type"
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Max-Age"] = "3600"
            return response
        return None

    @app.middleware("response")
    async def cors_response(request: Request, response: HTTPResponse) -> None:
        origin = request.headers.get("origin", "")
        if origin in origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
