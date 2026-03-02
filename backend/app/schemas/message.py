from datetime import datetime

from pydantic import BaseModel


class MessageResponse(BaseModel):
    id: str
    user_id: str
    msg_type: str
    title: str
    content: str | None = None
    is_read: bool
    related_entity_type: str | None = None
    related_entity_id: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
