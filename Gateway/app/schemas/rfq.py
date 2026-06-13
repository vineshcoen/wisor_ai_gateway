from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class RFQProcessRequest(BaseModel):
    email: str


class ExtractedData(BaseModel):
    customer: str | None = None
    origin: str | None = None
    destination: str | None = None
    cargo_type: str | None = None
    container_type: str | None = None
    weight: str | None = None
    quantity: int | None = None
    ready_date: str | None = None


class ValidationItem(BaseModel):
    field: str
    status: Literal["ok", "missing", "warning"]
    message: str | None = None


class RFQProcessResponse(BaseModel):
    rfq_id: str
    extracted: ExtractedData
    confidence: dict[str, float]
    validation: list[ValidationItem]
    status: str


class RFQListItem(BaseModel):
    rfq_id: str
    customer: str | None
    origin: str | None
    destination: str | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class RFQDetail(RFQListItem):
    email_body: str
    extracted: ExtractedData
    confidence: dict[str, float]
    validation: list[ValidationItem]
