from datetime import date, datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import BigInteger, Date, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Material(Base):
    __tablename__ = "materials"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    entity_id: Mapped[str] = mapped_column(String(32), index=True)
    entity_type: Mapped[str] = mapped_column(String(20))

    category: Mapped[str] = mapped_column(String(20))
    material_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    file_name: Mapped[str] = mapped_column(String(255))
    file_path: Mapped[str] = mapped_column(String(500))
    file_size: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)

    ocr_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    extracted_data: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    valid_from: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    valid_to: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(10), default="active")

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
