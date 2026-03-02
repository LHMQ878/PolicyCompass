from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(255), default="新对话")
    context: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    session_id: Mapped[str] = mapped_column(String(32), ForeignKey("chat_sessions.id"), index=True)
    role: Mapped[str] = mapped_column(String(10))  # user / assistant
    content: Mapped[str] = mapped_column(Text)
    metadata_: Mapped[Optional[dict]] = mapped_column("metadata", JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
