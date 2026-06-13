from pydantic import BaseModel, Field


class RateCardCreate(BaseModel):
    origin: str
    destination: str
    container_type: str
    base_price: float
    rate_card_code: str | None = None


class RateCardUpdate(BaseModel):
    origin: str | None = None
    destination: str | None = None
    container_type: str | None = None
    base_price: float | None = None
    rate_card_code: str | None = None


class RateCardResponse(BaseModel):
    id: int
    origin: str
    destination: str
    container_type: str
    base_price: float
    rate_card_code: str | None = None

    model_config = {"from_attributes": True}


class SurchargeUpdate(BaseModel):
    amount: float | None = None
    reason_template: str | None = None


class SurchargeResponse(BaseModel):
    id: int
    name: str
    amount: float
    reason_template: str

    model_config = {"from_attributes": True}


class DashboardStats(BaseModel):
    rfqs_today: int
    quotes_generated: int
    pending_review: int
    revenue: float
