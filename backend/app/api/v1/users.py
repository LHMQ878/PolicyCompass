from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import ResponseModel
from app.schemas.user import UserResponse

router = APIRouter()


@router.get("/me", response_model=ResponseModel[UserResponse])
async def get_me(current_user: User = Depends(get_current_user)):
    return ResponseModel(data=UserResponse.model_validate(current_user))
