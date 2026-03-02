from pydantic import BaseModel


class LoginRequest(BaseModel):
    phone: str
    password: str


class RegisterRequest(BaseModel):
    phone: str
    password: str
    role: str
    code: str | None = None


class UserInfo(BaseModel):
    id: str
    phone: str
    role: str
    status: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserInfo


class PasswordResetRequest(BaseModel):
    phone: str
    code: str
    new_password: str
