from datetime import date, datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import Boolean, Date, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Policy(Base):
    __tablename__ = "policies"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    title: Mapped[str] = mapped_column(String(255), index=True)
    policy_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    issuing_authority: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    level: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    policy_type: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    classification: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    support_details: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    application_info: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    conditions: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    prerequisites: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    materials_required: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    source_type: Mapped[str] = mapped_column(String(20), default="government")
    source_park_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    is_opc_policy: Mapped[bool] = mapped_column(Boolean, default=False)
    region: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    status: Mapped[str] = mapped_column(String(20), default="active", index=True)
    review_status: Mapped[str] = mapped_column(String(20), default="unreviewed")

    original_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    interpretation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    publish_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    effective_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    expiry_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    apply_start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    apply_end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    official_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    apply_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
