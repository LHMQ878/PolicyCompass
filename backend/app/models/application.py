from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import Float, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    entity_id: Mapped[str] = mapped_column(String(32))
    entity_type: Mapped[str] = mapped_column(String(20))
    policy_id: Mapped[str] = mapped_column(String(32), ForeignKey("policies.id"), index=True)

    status: Mapped[str] = mapped_column(String(20), default="draft")

    material_package: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    pre_review_result: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    pre_review_type: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    redirect_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    redirect_time: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    estimated_review_stage: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    estimated_result_date: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    actual_result: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    actual_result_time: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    result_screenshot_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    reject_reason: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    grant_amount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    progress_logs: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
