from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.park import Park
from app.models.user import User
from app.schemas.common import ResponseModel
from app.schemas.park import ParkResponse, ParkUpdate

router = APIRouter()


@router.get("/mine", response_model=ResponseModel[ParkResponse])
async def get_my_park(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Park).where(Park.user_id == current_user.id))
    park = result.scalar_one_or_none()
    if not park:
        raise HTTPException(status_code=404, detail="园区不存在")
    return ResponseModel(data=ParkResponse.model_validate(park))


@router.get("/{park_id}", response_model=ResponseModel[ParkResponse])
async def get_park(park_id: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Park).where(Park.id == park_id))
    park = result.scalar_one_or_none()
    if not park:
        raise HTTPException(status_code=404, detail="园区不存在")
    return ResponseModel(data=ParkResponse.model_validate(park))


@router.put("/{park_id}", response_model=ResponseModel[ParkResponse])
async def update_park(
    park_id: str,
    body: ParkUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Park).where(Park.id == park_id))
    park = result.scalar_one_or_none()
    if not park:
        raise HTTPException(status_code=404, detail="园区不存在")
    if park.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(park, field, value)
    await db.commit()
    await db.refresh(park)
    return ResponseModel(data=ParkResponse.model_validate(park))


@router.post("/{park_id}/policies", response_model=ResponseModel)
async def publish_park_policy(park_id: str, _: User = Depends(get_current_user)):
    # TODO: accept policy file upload, AI parse, and publish
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{park_id}/policy-matches", response_model=ResponseModel)
async def get_policy_matches(park_id: str, _: User = Depends(get_current_user)):
    # TODO: return matched users for park policies
    return ResponseModel(data=[])


@router.post("/{park_id}/push-policy", response_model=ResponseModel)
async def push_policy(park_id: str, _: User = Depends(get_current_user)):
    # TODO: push policy to matched users
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/{park_id}/push-history", response_model=ResponseModel)
async def get_push_history(park_id: str, _: User = Depends(get_current_user)):
    # TODO: return push history
    return ResponseModel(data=[])
