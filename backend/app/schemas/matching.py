from datetime import datetime

from pydantic import BaseModel


class MatchCalculateRequest(BaseModel):
    entity_type: str
    entity_id: str
    policy_ids: list[str] | None = None


class GapItem(BaseModel):
    condition_id: str | None = None
    dimension: str | None = None
    current_value: str | None = None
    required_value: str | None = None
    gap_desc: str | None = None
    suggestion: str | None = None


class MatchResultResponse(BaseModel):
    id: str
    entity_id: str
    entity_type: str
    policy_id: str
    match_score: float
    match_status: str
    estimated_amount: float | None = None
    gap_list: dict | None = None
    growth_path: dict | None = None
    collaboration_matches: dict | None = None
    calculated_at: datetime

    model_config = {"from_attributes": True}


class GrowthPathResponse(BaseModel):
    entity_id: str
    current_certifications: list[str] = []
    recommended_path: list[dict] = []
    quick_wins: list[dict] = []
