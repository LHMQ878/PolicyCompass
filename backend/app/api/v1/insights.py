from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import ResponseModel

router = APIRouter()


@router.get("/industry-map/{park_id}", response_model=ResponseModel)
async def get_industry_map(park_id: str, _: User = Depends(get_current_user)):
    # TODO: invoke IndustryInsightAgent
    return ResponseModel(data={"park_id": park_id, "chain_analysis": []})


@router.get("/investment-targets/{park_id}", response_model=ResponseModel)
async def get_investment_targets(park_id: str, _: User = Depends(get_current_user)):
    # TODO: invoke IndustryInsightAgent
    return ResponseModel(data={"park_id": park_id, "targets": []})


@router.get("/trends/{park_id}", response_model=ResponseModel)
async def get_trends(park_id: str, _: User = Depends(get_current_user)):
    # TODO: generate trend analysis
    raise HTTPException(status_code=501, detail="Not implemented")


@router.post("/report/{park_id}", response_model=ResponseModel)
async def generate_report(park_id: str, _: User = Depends(get_current_user)):
    # TODO: generate PDF report
    raise HTTPException(status_code=501, detail="Not implemented")
