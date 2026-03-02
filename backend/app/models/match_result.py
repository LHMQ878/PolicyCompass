from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import Float, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class MatchResult(Base):
    __tablename__ = "match_results"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    entity_id: Mapped[str] = mapped_column(String(32), index=True)
    entity_type: Mapped[str] = mapped_column(String(20))
    policy_id: Mapped[str] = mapped_column(String(32), ForeignKey("policies.id"), index=True)

    match_score: Mapped[float] = mapped_column(Float, default=0.0)
    match_status: Mapped[str] = mapped_column(String(20), default="pending")
    estimated_amount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    gap_list: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    growth_path: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    collaboration_matches: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    calculated_at: Mapped[datetime] = mapped_column(server_default=func.now())
