from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Enterprise(Base):
    __tablename__ = "enterprises"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    credit_code: Mapped[Optional[str]] = mapped_column(String(50), unique=True, nullable=True)

    basic_info: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    operation_data: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    certifications: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    intellectual_property: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    ai_compliance: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    general_compliance: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    opc_info: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    implicit_tags: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    policy_history: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    completeness_score: Mapped[float] = mapped_column(default=0.0)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
