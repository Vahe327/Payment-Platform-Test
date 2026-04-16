from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str


class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UpdateUserRequest(BaseModel):
    email: EmailStr | None = None
    password: str | None = None
    full_name: str | None = None
