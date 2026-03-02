from datetime import datetime

from pydantic import BaseModel


class ParkCreate(BaseModel):
    name: str
    address: str | None = None


class ParkUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    basic_info: dict | None = None
    industry_focus: dict | None = None
    tenant_info: dict | None = None
    investment_needs: dict | None = None
    opc_community_info: dict | None = None


class ParkResponse(BaseModel):
    id: str
    user_id: str
    name: str
    address: str | None = None
    basic_info: dict | None = None
    industry_focus: dict | None = None
    tenant_info: dict | None = None
    investment_needs: dict | None = None
    opc_community_info: dict | None = None
    completeness_score: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
