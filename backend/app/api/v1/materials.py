import os
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.material import Material
from app.models.user import User
from app.schemas.common import ResponseModel
from app.schemas.material import MaterialResponse, MaterialUploadResponse

router = APIRouter()


@router.get("", response_model=ResponseModel[list[MaterialResponse]])
async def list_materials(
    entity_id: str | None = None,
    category: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Material).where(Material.user_id == current_user.id)
    if entity_id:
        query = query.where(Material.entity_id == entity_id)
    if category:
        query = query.where(Material.category == category)
    result = await db.execute(query.order_by(Material.created_at.desc()))
    items = [MaterialResponse.model_validate(m) for m in result.scalars().all()]
    return ResponseModel(data=items)


@router.post("/upload", response_model=ResponseModel[MaterialUploadResponse])
async def upload_material(
    file: UploadFile,
    entity_id: str = "",
    entity_type: str = "enterprise",
    category: str = "other",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    upload_dir = os.path.join(settings.UPLOAD_DIR, current_user.id)
    os.makedirs(upload_dir, exist_ok=True)

    file_id = uuid4().hex
    file_ext = os.path.splitext(file.filename or "file")[1]
    file_path = os.path.join(upload_dir, f"{file_id}{file_ext}")

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    material = Material(
        id=file_id,
        user_id=current_user.id,
        entity_id=entity_id,
        entity_type=entity_type,
        category=category,
        file_name=file.filename or "unknown",
        file_path=file_path,
        file_size=len(content),
    )
    db.add(material)
    await db.commit()
    return ResponseModel(data=MaterialUploadResponse(id=file_id, file_name=material.file_name, category=category, status="active"))


@router.delete("/{material_id}", response_model=ResponseModel)
async def delete_material(
    material_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Material).where(Material.id == material_id, Material.user_id == current_user.id))
    material = result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=404, detail="素材不存在")
    await db.delete(material)
    await db.commit()
    return ResponseModel(message="删除成功")


@router.get("/{material_id}", response_model=ResponseModel[MaterialResponse])
async def get_material(
    material_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Material).where(Material.id == material_id, Material.user_id == current_user.id))
    material = result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=404, detail="素材不存在")
    return ResponseModel(data=MaterialResponse.model_validate(material))


@router.post("/{material_id}/pre-review", response_model=ResponseModel)
async def pre_review_material(
    material_id: str,
    review_type: str = "ai",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Material).where(Material.id == material_id, Material.user_id == current_user.id))
    material = result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=404, detail="素材不存在")
    if review_type == "expert":
        # TODO: submit to expert review queue
        return ResponseModel(data={"status": "submitted_to_expert", "estimated_days": 3})
    # TODO: invoke MaterialFactoryAgent for AI pre-review
    return ResponseModel(data={"status": "ai_review_pending", "review_type": review_type})
