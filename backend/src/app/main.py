from sanic import Sanic

from app.api.middleware.cors import setup_cors
from app.api.middleware.db import setup_db_middleware
from app.api.middleware.errors import setup_error_handlers
from app.api.v1.admin import bp as admin_bp
from app.api.v1.admin_auth import bp as admin_auth_bp
from app.api.v1.auth import bp as auth_bp
from app.api.v1.users import bp as users_bp
from app.api.v1.webhook import bp as webhook_bp
from app.config import settings


def create_app() -> Sanic:
    app = Sanic("PaymentPlatform")

    setup_cors(app)
    setup_db_middleware(app)
    setup_error_handlers(app)

    app.blueprint(auth_bp)
    app.blueprint(users_bp)
    app.blueprint(admin_auth_bp)
    app.blueprint(admin_bp)
    app.blueprint(webhook_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host=settings.APP_HOST, port=settings.APP_PORT, debug=settings.APP_DEBUG)
