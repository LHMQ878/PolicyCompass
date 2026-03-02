from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import Boolean, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)

    msg_type: Mapped[str] = mapped_column(String(20))
    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)

    related_entity_type: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    related_entity_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
