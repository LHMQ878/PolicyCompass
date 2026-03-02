import os
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.enterprise import Enterprise
from app.models.material import Material
from app.models.user import User
from app.schemas.common import ResponseModel
from app.schemas.enterprise import EnterpriseResponse, EnterpriseUpdate
from app.schemas.material import MaterialUploadResponse

router = APIRouter()


@router.get("/mine", response_model=ResponseModel[EnterpriseResponse])
async def get_my_enterprise(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Enterprise).where(Enterprise.user_id == current_user.id))
    ent = result.scalar_one_or_none()
    if not ent:
        raise HTTPException(status_code=404, detail="企业不存在，请先完善画像")
    return ResponseModel(data=EnterpriseResponse.model_validate(ent))


@router.get("/{enterprise_id}", response_model=ResponseModel[EnterpriseResponse])
async def get_enterprise(enterprise_id: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(Enterprise).where(Enterprise.id == enterprise_id))
    ent = result.scalar_one_or_none()
    if not ent:
        raise HTTPException(status_code=404, detail="企业不存在")
    return ResponseModel(data=EnterpriseResponse.model_validate(ent))


@router.put("/{enterprise_id}", response_model=ResponseModel[EnterpriseResponse])
async def update_enterprise(
    enterprise_id: str,
    body: EnterpriseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Enterprise).where(Enterprise.id == enterprise_id))
    ent = result.scalar_one_or_none()
    if not ent:
        raise HTTPException(status_code=404, detail="企业不存在")
    if ent.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(ent, field, value)
    await db.commit()
    await db.refresh(ent)
    return ResponseModel(data=EnterpriseResponse.model_validate(ent))


@router.post("/{enterprise_id}/materials", response_model=ResponseModel[MaterialUploadResponse])
async def upload_enterprise_material(
    enterprise_id: str,
    file: UploadFile,
    category: str = "other",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Enterprise).where(Enterprise.id == enterprise_id))
    ent = result.scalar_one_or_none()
    if not ent or ent.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限")

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
        entity_id=enterprise_id,
        entity_type="enterprise",
        category=category,
        file_name=file.filename or "unknown",
        file_path=file_path,
        file_size=len(content),
    )
    db.add(material)
    await db.commit()
    return ResponseModel(data=MaterialUploadResponse(id=file_id, file_name=material.file_name, category=category, status="active"))


@router.get("/{enterprise_id}/completeness", response_model=ResponseModel)
async def get_completeness(
    enterprise_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Enterprise).where(Enterprise.id == enterprise_id))
    ent = result.scalar_one_or_none()
    if not ent:
        raise HTTPException(status_code=404, detail="企业不存在")

    jsonb_fields = [
        "basic_info", "operation_data", "certifications", "intellectual_property",
        "ai_compliance", "general_compliance", "opc_info",
    ]
    filled = sum(1 for f in jsonb_fields if getattr(ent, f) is not None)
    score = round(filled / len(jsonb_fields) * 100, 1)
    return ResponseModel(data={"completeness_score": score, "filled": filled, "total": len(jsonb_fields)})
