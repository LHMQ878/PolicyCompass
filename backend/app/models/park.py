from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import ForeignKey, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Park(Base):
    __tablename__ = "parks"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    basic_info: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    industry_focus: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    tenant_info: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    investment_needs: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    opc_community_info: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    completeness_score: Mapped[float] = mapped_column(default=0.0)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
