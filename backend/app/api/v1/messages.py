from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.message import Message
from app.models.user import User
from app.schemas.common import ResponseModel
from app.schemas.message import MessageResponse

router = APIRouter()


@router.get("", response_model=ResponseModel[list[MessageResponse]])
async def list_messages(
    msg_type: str | None = None,
    is_read: bool | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Message).where(Message.user_id == current_user.id)
    if msg_type:
        query = query.where(Message.msg_type == msg_type)
    if is_read is not None:
        query = query.where(Message.is_read == is_read)
    result = await db.execute(query.order_by(Message.created_at.desc()).offset((page - 1) * page_size).limit(page_size))
    items = [MessageResponse.model_validate(m) for m in result.scalars().all()]
    return ResponseModel(data=items)


@router.post("/read-all", response_model=ResponseModel)
async def mark_all_read(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await db.execute(update(Message).where(Message.user_id == current_user.id, Message.is_read == False).values(is_read=True))
    await db.commit()
    return ResponseModel(message="全部已读")
