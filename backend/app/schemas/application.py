from datetime import datetime

from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    entity_id: str
    entity_type: str
    policy_id: str


class ApplicationResponse(BaseModel):
    id: str
    user_id: str
    entity_id: str
    entity_type: str
    policy_id: str
    status: str
    material_package: dict | None = None
    pre_review_result: dict | None = None
    pre_review_type: str | None = None
    redirect_url: str | None = None
    actual_result: str | None = None
    grant_amount: float | None = None
    progress_logs: dict | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class FeedbackRequest(BaseModel):
    result: str  # passed / rejected / returned
    reject_reason: str | None = None
    grant_amount: float | None = None


class PreReviewRequest(BaseModel):
    review_type: str  # ai / expert
