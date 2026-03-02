from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func as sa_func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.favorite import Favorite
from app.models.policy import Policy
from app.models.user import User
from app.schemas.common import PaginatedData, ResponseModel
from app.schemas.policy import PolicyCreate, PolicyListItem, PolicyResponse

router = APIRouter()


@router.get("", response_model=ResponseModel[PaginatedData[PolicyListItem]])
async def list_policies(
    keyword: str | None = None,
    level: str | None = None,
    policy_type: str | None = None,
    status: str | None = None,
    is_opc_policy: bool | None = None,
    region: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Policy)
    count_query = select(sa_func.count()).select_from(Policy)

    if keyword:
        query = query.where(Policy.title.ilike(f"%{keyword}%"))
        count_query = count_query.where(Policy.title.ilike(f"%{keyword}%"))
    if level:
        query = query.where(Policy.level == level)
        count_query = count_query.where(Policy.level == level)
    if policy_type:
        query = query.where(Policy.policy_type == policy_type)
        count_query = count_query.where(Policy.policy_type == policy_type)
    if status:
        query = query.where(Policy.status == status)
        count_query = count_query.where(Policy.status == status)
    if is_opc_policy is not None:
        query = query.where(Policy.is_opc_policy == is_opc_policy)
        count_query = count_query.where(Policy.is_opc_policy == is_opc_policy)
    if region:
        query = query.where(Policy.region == region)
        count_query = count_query.where(Policy.region == region)

    total = (await db.execute(count_query)).scalar() or 0
    result = await db.execute(query.offset((page - 1) * page_size).limit(page_size).order_by(Policy.created_at.desc()))
    items = [PolicyListItem.model_validate(p) for p in result.scalars().all()]
    return ResponseModel(data=PaginatedData(total=total, page=page, page_size=page_size, items=items))


@router.get("/{policy_id}", response_model=ResponseModel[PolicyResponse])
async def get_policy(policy_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Policy).where(Policy.id == policy_id))
    policy = result.scalar_one_or_none()
    if not policy:
        raise HTTPException(status_code=404, detail="政策不存在")
    return ResponseModel(data=PolicyResponse.model_validate(policy))


@router.post("", response_model=ResponseModel[PolicyResponse])
async def create_policy(
    body: PolicyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ("park", "admin"):
        raise HTTPException(status_code=403, detail="仅园区或管理员可创建政策")
    policy = Policy(id=uuid4().hex, **body.model_dump())
    if current_user.role == "park":
        policy.source_type = "park"
    db.add(policy)
    await db.commit()
    await db.refresh(policy)
    return ResponseModel(data=PolicyResponse.model_validate(policy))


@router.post("/{policy_id}/favorite", response_model=ResponseModel)
async def favorite_policy(
    policy_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = await db.execute(
        select(Favorite).where(Favorite.user_id == current_user.id, Favorite.policy_id == policy_id)
    )
    if existing.scalar_one_or_none():
        return ResponseModel(message="已收藏")
    db.add(Favorite(id=uuid4().hex, user_id=current_user.id, policy_id=policy_id))
    await db.commit()
    return ResponseModel(message="收藏成功")


@router.delete("/{policy_id}/favorite", response_model=ResponseModel)
async def unfavorite_policy(
    policy_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Favorite).where(Favorite.user_id == current_user.id, Favorite.policy_id == policy_id)
    )
    fav = result.scalar_one_or_none()
    if fav:
        await db.delete(fav)
        await db.commit()
    return ResponseModel(message="取消收藏")
