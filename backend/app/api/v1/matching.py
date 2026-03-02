from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.match_result import MatchResult
from app.models.user import User
from app.schemas.common import ResponseModel
from app.schemas.matching import GrowthPathResponse, MatchCalculateRequest, MatchResultResponse

router = APIRouter()


@router.post("/calculate", response_model=ResponseModel)
async def calculate_match(
    body: MatchCalculateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # TODO: invoke PolicyCalculationAgent
    return ResponseModel(message="匹配计算已触发，请稍后查看结果")


@router.get("/result/{entity_id}", response_model=ResponseModel[list[MatchResultResponse]])
async def get_match_results(
    entity_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(
        select(MatchResult).where(MatchResult.entity_id == entity_id).order_by(MatchResult.match_score.desc())
    )
    items = [MatchResultResponse.model_validate(r) for r in result.scalars().all()]
    return ResponseModel(data=items)


@router.get("/gaps/{entity_id}/{policy_id}", response_model=ResponseModel)
async def get_gap_analysis(entity_id: str, policy_id: str, _: User = Depends(get_current_user)):
    # TODO: return structured gap analysis
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/growth-path/{entity_id}", response_model=ResponseModel[GrowthPathResponse])
async def get_growth_path(entity_id: str, _: User = Depends(get_current_user)):
    # TODO: invoke growth path calculation
    raise HTTPException(status_code=501, detail="Not implemented")
