from datetime import date, datetime

from pydantic import BaseModel


class PolicyCreate(BaseModel):
    title: str
    policy_number: str | None = None
    issuing_authority: str | None = None
    level: str | None = None
    policy_type: str | None = None
    classification: dict | None = None
    support_details: dict | None = None
    conditions: dict | None = None
    prerequisites: dict | None = None
    source_type: str = "government"
    is_opc_policy: bool = False
    region: str | None = None
    original_text: str | None = None
    publish_date: date | None = None
    effective_date: date | None = None
    expiry_date: date | None = None
    apply_start_date: date | None = None
    apply_end_date: date | None = None
    official_url: str | None = None
    apply_url: str | None = None


class PolicyUpdate(BaseModel):
    title: str | None = None
    level: str | None = None
    policy_type: str | None = None
    classification: dict | None = None
    support_details: dict | None = None
    conditions: dict | None = None
    status: str | None = None
    review_status: str | None = None
    interpretation: str | None = None


class PolicyListItem(BaseModel):
    id: str
    title: str
    issuing_authority: str | None = None
    level: str | None = None
    policy_type: str | None = None
    status: str
    is_opc_policy: bool
    region: str | None = None
    publish_date: date | None = None
    apply_end_date: date | None = None
    support_details: dict | None = None

    model_config = {"from_attributes": True}


class PolicyResponse(PolicyListItem):
    policy_number: str | None = None
    classification: dict | None = None
    application_info: dict | None = None
    conditions: dict | None = None
    prerequisites: dict | None = None
    materials_required: dict | None = None
    source_type: str
    review_status: str
    original_text: str | None = None
    interpretation: str | None = None
    effective_date: date | None = None
    expiry_date: date | None = None
    apply_start_date: date | None = None
    official_url: str | None = None
    apply_url: str | None = None
    created_at: datetime
    updated_at: datetime


class PolicyFilter(BaseModel):
    keyword: str | None = None
    level: str | None = None
    policy_type: str | None = None
    status: str | None = None
    is_opc_policy: bool | None = None
    region: str | None = None
    page: int = 1
    page_size: int = 20
