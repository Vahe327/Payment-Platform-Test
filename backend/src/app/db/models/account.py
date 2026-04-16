from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    balance: Mapped[Decimal] = mapped_column(
        Numeric(18, 2), nullable=False, default=Decimal("0.00"), server_default="0.00"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="accounts")  # type: ignore[name-defined]  # noqa: F821
    payments: Mapped[list["Payment"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="account", cascade="all, delete-orphan", lazy="selectin"
    )
