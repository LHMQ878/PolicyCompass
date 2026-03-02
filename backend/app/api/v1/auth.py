from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.enterprise import Enterprise
from app.models.park import Park
from app.models.talent import Talent
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.common import ResponseModel
from app.schemas.user import UserResponse

router = APIRouter()


@router.post("/login", response_model=ResponseModel[TokenResponse])
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.phone == req.phone))
    user = result.scalar_one_or_none()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="手机号或密码错误")
    token = create_access_token({"sub": user.id, "role": user.role})
    from app.schemas.auth import UserInfo
    return ResponseModel(data=TokenResponse(access_token=token, user=UserInfo.model_validate(user)))


@router.post("/register", response_model=ResponseModel[UserResponse])
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.phone == req.phone))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="该手机号已注册")
    user = User(
        id=uuid4().hex,
        phone=req.phone,
        password_hash=hash_password(req.password),
        role=req.role,
    )
    db.add(user)
    await db.flush()

    profile_id = uuid4().hex
    if req.role == "talent":
        db.add(Talent(id=profile_id, user_id=user.id, name=""))
    elif req.role in ("tech_enterprise", "transform_enterprise"):
        db.add(Enterprise(id=profile_id, user_id=user.id, name=""))
    elif req.role == "park":
        db.add(Park(id=profile_id, user_id=user.id, name=""))

    await db.commit()
    await db.refresh(user)
    return ResponseModel(data=UserResponse.model_validate(user))


@router.post("/refresh", response_model=ResponseModel[TokenResponse])
async def refresh_token():
    # TODO: implement refresh token logic
    raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/forgot-password", response_model=ResponseModel)
async def forgot_password():
    # TODO: implement SMS verification + password reset
    raise HTTPException(status_code=501, detail="Not implemented")
