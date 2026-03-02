from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import ResponseModel

router = APIRouter()


@router.get("/opportunities/{entity_id}", response_model=ResponseModel)
async def get_opportunities(entity_id: str, _: User = Depends(get_current_user)):
    # TODO: invoke IndustryCollaborationAgent
    return ResponseModel(data={"entity_id": entity_id, "opportunities": []})


@router.post("/connect", response_model=ResponseModel)
async def send_connect_request(_: User = Depends(get_current_user)):
    # TODO: implement connection request
    raise HTTPException(status_code=501, detail="Not implemented")


@router.get("/requests", response_model=ResponseModel)
async def list_requests(_: User = Depends(get_current_user)):
    # TODO: list collaboration requests
    return ResponseModel(data=[])
