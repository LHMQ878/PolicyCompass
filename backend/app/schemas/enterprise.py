from datetime import datetime

from pydantic import BaseModel


class EnterpriseCreate(BaseModel):
    name: str
    credit_code: str | None = None


class EnterpriseUpdate(BaseModel):
    name: str | None = None
    credit_code: str | None = None
    basic_info: dict | None = None
    operation_data: dict | None = None
    certifications: dict | None = None
    intellectual_property: dict | None = None
    ai_compliance: dict | None = None
    general_compliance: dict | None = None
    opc_info: dict | None = None


class EnterpriseResponse(BaseModel):
    id: str
    user_id: str
    name: str
    credit_code: str | None = None
    basic_info: dict | None = None
    operation_data: dict | None = None
    certifications: dict | None = None
    intellectual_property: dict | None = None
    ai_compliance: dict | None = None
    general_compliance: dict | None = None
    opc_info: dict | None = None
    completeness_score: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
