from datetime import datetime

from pydantic import BaseModel


class UserResponse(BaseModel):
    id: str
    phone: str
    role: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    phone: str | None = None
