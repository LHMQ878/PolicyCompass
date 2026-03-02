from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.application import Application
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationResponse, FeedbackRequest
from app.schemas.common import ResponseModel

router = APIRouter()


@router.get("", response_model=ResponseModel[list[ApplicationResponse]])
async def list_applications(
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Application).where(Application.user_id == current_user.id)
    if status:
        query = query.where(Application.status == status)
    result = await db.execute(query.order_by(Application.created_at.desc()))
    items = [ApplicationResponse.model_validate(a) for a in result.scalars().all()]
    return ResponseModel(data=items)


@router.post("", response_model=ResponseModel[ApplicationResponse])
async def create_application(
    body: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    app = Application(
        id=uuid4().hex,
        user_id=current_user.id,
        entity_id=body.entity_id,
        entity_type=body.entity_type,
        policy_id=body.policy_id,
        status="draft",
    )
    db.add(app)
    await db.commit()
    await db.refresh(app)
    return ResponseModel(data=ApplicationResponse.model_validate(app))


@router.get("/{application_id}", response_model=ResponseModel[ApplicationResponse])
async def get_application(
    application_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id, Application.user_id == current_user.id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="申报记录不存在")
    return ResponseModel(data=ApplicationResponse.model_validate(app))


@router.post("/{application_id}/feedback", response_model=ResponseModel)
async def submit_feedback(
    application_id: str,
    body: FeedbackRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id, Application.user_id == current_user.id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="申报记录不存在")
    app.actual_result = body.result
    app.reject_reason = body.reject_reason
    app.grant_amount = body.grant_amount
    app.status = f"feedback_{body.result}"
    await db.commit()
    return ResponseModel(message="反馈提交成功")


@router.get("/{application_id}/progress", response_model=ResponseModel)
async def get_progress(
    application_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id, Application.user_id == current_user.id)
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="申报记录不存在")
    return ResponseModel(data={
        "application_id": app.id,
        "status": app.status,
        "estimated_review_stage": app.estimated_review_stage,
        "estimated_result_date": str(app.estimated_result_date) if app.estimated_result_date else None,
        "actual_result": app.actual_result,
        "progress_logs": app.progress_logs or [],
    })
