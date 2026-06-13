import json

from app.schemas.quote import PricingLineItem, QuoteExplanationResponse


def build_explanation(
    quote_id: str,
    origin: str,
    destination: str,
    breakdown: list[PricingLineItem],
    quote_confidence: float,
    risk_flags: list[str],
) -> QuoteExplanationResponse:
    return QuoteExplanationResponse(
        quote_id=quote_id,
        route=f"{origin} → {destination}",
        line_items=breakdown,
        quote_confidence=quote_confidence,
        risk_flags=risk_flags,
    )


def serialize_breakdown(breakdown: list[PricingLineItem]) -> str:
    return json.dumps([item.model_dump() for item in breakdown])
