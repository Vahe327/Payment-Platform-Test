class AppError(Exception):
    def __init__(self, code: str, message: str, status: int = 400) -> None:
        self.code = code
        self.message = message
        self.status = status
        super().__init__(message)


class NotFoundError(AppError):
    def __init__(self, code: str = "not_found", message: str = "Resource not found") -> None:
        super().__init__(code=code, message=message, status=404)


class AuthError(AppError):
    def __init__(
        self, code: str = "unauthorized", message: str = "Authentication required"
    ) -> None:
        super().__init__(code=code, message=message, status=401)


class ForbiddenError(AppError):
    def __init__(self, code: str = "forbidden", message: str = "Access denied") -> None:
        super().__init__(code=code, message=message, status=403)
