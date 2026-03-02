from datetime import datetime
from uuid import uuid4

from sqlalchemy import ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = (UniqueConstraint("user_id", "policy_id", name="uq_user_policy"),)

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), index=True)
    policy_id: Mapped[str] = mapped_column(String(32), ForeignKey("policies.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
