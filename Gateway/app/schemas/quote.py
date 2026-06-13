from datetime import datetime

from pydantic import BaseModel, Field


class QuoteGenerateRequest(BaseModel):
    rfq_id: str | None = None
    origin: str | None = None
    destination: str | None = None
    container_type: str | None = None
    cargo_type: str | None = None
    weight: str | None = None
    quantity: int | None = None


class PricingLineItem(BaseModel):
    name: str
    amount: float
    reason: str


class QuoteGenerateResponse(BaseModel):
    quote_id: str
    rfq_id: str | None = None
    shipment_summary: dict
    breakdown: list[PricingLineItem]
    total: float
    currency: str = "USD"
    quote_confidence: float
    risk_flags: list[str]


class QuoteExplanationRequest(BaseModel):
    quote_id: str


class QuoteExplanationResponse(BaseModel):
    quote_id: str
    route: str
    line_items: list[PricingLineItem]
    quote_confidence: float
    risk_flags: list[str]


class QuoteHistoryItem(BaseModel):
    quote_id: str
    customer: str | None
    route: str
    amount: float
    currency: str
    created_at: datetime
