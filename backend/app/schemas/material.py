from datetime import date, datetime

from pydantic import BaseModel


class MaterialResponse(BaseModel):
    id: str
    user_id: str
    entity_id: str
    entity_type: str
    category: str
    material_type: str | None = None
    file_name: str
    file_path: str
    file_size: int | None = None
    ocr_content: str | None = None
    extracted_data: dict | None = None
    valid_from: date | None = None
    valid_to: date | None = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class MaterialUploadResponse(BaseModel):
    id: str
    file_name: str
    category: str
    status: str
    extracted_data: dict | None = None
