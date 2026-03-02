from datetime import datetime

from pydantic import BaseModel


class TalentCreate(BaseModel):
    name: str


class TalentUpdate(BaseModel):
    name: str | None = None
    basic_info: dict | None = None
    education: dict | None = None
    work_experience: dict | None = None
    professional_skills: dict | None = None
    achievements: dict | None = None
    talent_titles: dict | None = None
    social_insurance: dict | None = None
    opc_info: dict | None = None


class TalentResponse(BaseModel):
    id: str
    user_id: str
    name: str
    basic_info: dict | None = None
    education: dict | None = None
    work_experience: dict | None = None
    professional_skills: dict | None = None
    achievements: dict | None = None
    talent_titles: dict | None = None
    social_insurance: dict | None = None
    opc_info: dict | None = None
    completeness_score: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
