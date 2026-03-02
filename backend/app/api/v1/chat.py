from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import ResponseModel

router = APIRouter()


class ChatMessageRequest(BaseModel):
    session_id: str | None = None
    message: str
    context: dict | None = None


@router.post("/message", response_model=ResponseModel)
async def send_message(body: ChatMessageRequest, current_user: User = Depends(get_current_user)):
    # TODO: invoke NavigationAgent -> route to appropriate agent
    return ResponseModel(
        data={
            "session_id": body.session_id or "new_session",
            "response": {"type": "text", "content": "AI 对话功能即将上线，敬请期待。"},
        }
    )


@router.get("/sessions", response_model=ResponseModel)
async def list_sessions(_: User = Depends(get_current_user)):
    # TODO: return chat session list
    return ResponseModel(data=[])


@router.get("/sessions/{session_id}", response_model=ResponseModel)
async def get_session(session_id: str, _: User = Depends(get_current_user)):
    # TODO: return session messages
    raise HTTPException(status_code=501, detail="Not implemented")
