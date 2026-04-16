from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    APP_DEBUG: bool = False
    APP_SECRET_KEY: str = "change-me-in-prod"

    DATABASE_URL: str = "postgresql+asyncpg://app:app@db:5432/app"

    JWT_SECRET: str = "jwt-super-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    JWT_TTL_MINUTES: int = 60

    WEBHOOK_SECRET_KEY: str = "gfdmhghif38yrf9ew0jkf32"

    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    DEFAULT_USER_EMAIL: str = "user@example.com"
    DEFAULT_USER_PASSWORD: str = "user_pass_123"
    DEFAULT_USER_FULL_NAME: str = "Test User"

    DEFAULT_ADMIN_EMAIL: str = "admin@example.com"
    DEFAULT_ADMIN_PASSWORD: str = "admin_pass_123"
    DEFAULT_ADMIN_FULL_NAME: str = "Test Admin"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
