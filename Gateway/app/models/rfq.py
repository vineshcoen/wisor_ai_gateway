from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RFQ(Base):
    __tablename__ = "rfqs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email_body: Mapped[str] = mapped_column(Text, nullable=False)
    origin: Mapped[str | None] = mapped_column(String(255), nullable=True)
    destination: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cargo_type: Mapped[str | None] = mapped_column(String(255), nullable=True)
    container_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    weight: Mapped[str | None] = mapped_column(String(100), nullable=True)
    quantity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    ready_date: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    confidence_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    quotes: Mapped[list["Quote"]] = relationship(back_populates="rfq")

    @property
    def rfq_id(self) -> str:
        return f"RFQ-{self.id}"


class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    rfq_id: Mapped[int] = mapped_column(ForeignKey("rfqs.id"), nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    breakdown_json: Mapped[str] = mapped_column(Text, nullable=False)
    explanation_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    quote_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    rfq: Mapped["RFQ"] = relationship(back_populates="quotes")

    @property
    def quote_id(self) -> str:
        return f"Q-{self.id}"


class RateCard(Base):
    __tablename__ = "rate_cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    origin: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    container_type: Mapped[str] = mapped_column(String(50), nullable=False)
    base_price: Mapped[float] = mapped_column(Float, nullable=False)
    rate_card_code: Mapped[str | None] = mapped_column(String(50), nullable=True)


class Surcharge(Base):
    __tablename__ = "surcharges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    reason_template: Mapped[str] = mapped_column(Text, nullable=False)
