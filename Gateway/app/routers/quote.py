import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.rfq import Quote, RFQ
from app.schemas.quote import (
    QuoteExplanationRequest,
    QuoteExplanationResponse,
    QuoteGenerateRequest,
    QuoteGenerateResponse,
    QuoteHistoryItem,
)
from app.services.explanation import build_explanation, serialize_breakdown
from app.services.pricing import calculate_quote, compute_quote_confidence
from app.services.validation import REQUIRED_FIELDS

router = APIRouter(prefix="/api/quote", tags=["Quote"])


@router.post("/generate", response_model=QuoteGenerateResponse)
def generate_quote(payload: QuoteGenerateRequest, db: Session = Depends(get_db)):
    rfq: RFQ | None = None

    if payload.rfq_id:
        db_id = _parse_rfq_id(payload.rfq_id)
        rfq = db.query(RFQ).filter(RFQ.id == db_id).first()
        if not rfq:
            raise HTTPException(status_code=404, detail="RFQ not found")

        origin = rfq.origin or payload.origin
        destination = rfq.destination or payload.destination
        container_type = rfq.container_type or payload.container_type
        quantity = rfq.quantity or payload.quantity or 1
    else:
        origin = payload.origin
        destination = payload.destination
        container_type = payload.container_type
        quantity = payload.quantity or 1

    if not origin or not destination or not container_type:
        raise HTTPException(
            status_code=400,
            detail="origin, destination, and container_type are required",
        )

    try:
        breakdown, total, pricing_flags = calculate_quote(
            db, origin, destination, container_type, quantity
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    missing_optional = []
    if rfq:
        for field in ["cargo_type", "weight", "ready_date"]:
            if not getattr(rfq, field):
                missing_optional.append(field)

    has_all_required = all(
        getattr(rfq, f) if rfq else getattr(payload, f, None) for f in REQUIRED_FIELDS
    )
    quote_confidence, validation_flags = compute_quote_confidence(
        has_all_required, missing_optional
    )
    risk_flags = list(dict.fromkeys(pricing_flags + validation_flags))

    explanation = build_explanation(
        quote_id="pending",
        origin=origin,
        destination=destination,
        breakdown=breakdown,
        quote_confidence=quote_confidence,
        risk_flags=risk_flags,
    )

    quote = Quote(
        rfq_id=rfq.id if rfq else _get_or_create_standalone_rfq(db, payload),
        total_amount=total,
        currency="USD",
        breakdown_json=serialize_breakdown(breakdown),
        explanation_json=json.dumps(explanation.model_dump()),
        quote_confidence=quote_confidence,
    )
    db.add(quote)
    if rfq:
        rfq.status = "quoted"
    db.commit()
    db.refresh(quote)

    shipment_summary = {
        "origin": origin,
        "destination": destination,
        "container_type": container_type,
        "quantity": quantity,
        "cargo_type": (rfq.cargo_type if rfq else payload.cargo_type),
        "weight": (rfq.weight if rfq else payload.weight),
    }

    return QuoteGenerateResponse(
        quote_id=quote.quote_id,
        rfq_id=rfq.rfq_id if rfq else None,
        shipment_summary=shipment_summary,
        breakdown=breakdown,
        total=total,
        currency="USD",
        quote_confidence=quote_confidence,
        risk_flags=risk_flags,
    )


@router.post("/explanation", response_model=QuoteExplanationResponse)
def get_explanation(payload: QuoteExplanationRequest, db: Session = Depends(get_db)):
    db_id = _parse_quote_id(payload.quote_id)
    quote = db.query(Quote).filter(Quote.id == db_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    if quote.explanation_json:
        data = json.loads(quote.explanation_json)
        data["quote_id"] = quote.quote_id
        return QuoteExplanationResponse(**data)

    rfq = quote.rfq
    breakdown_data = json.loads(quote.breakdown_json)
    from app.schemas.quote import PricingLineItem

    breakdown = [PricingLineItem(**item) for item in breakdown_data]
    return build_explanation(
        quote_id=quote.quote_id,
        origin=rfq.origin or "",
        destination=rfq.destination or "",
        breakdown=breakdown,
        quote_confidence=quote.quote_confidence or 0.0,
        risk_flags=["No validation errors"],
    )


@router.get("/history", response_model=list[QuoteHistoryItem])
def quote_history(db: Session = Depends(get_db)):
    quotes = db.query(Quote).order_by(Quote.created_at.desc()).all()
    items = []
    for q in quotes:
        rfq = q.rfq
        route = f"{rfq.origin or '?'} → {rfq.destination or '?'}"
        items.append(
            QuoteHistoryItem(
                quote_id=q.quote_id,
                customer=rfq.customer,
                route=route,
                amount=q.total_amount,
                currency=q.currency,
                created_at=q.created_at,
            )
        )
    return items


def _parse_rfq_id(prefixed_id: str) -> int:
    try:
        return int(prefixed_id.replace("RFQ-", "").replace("rfq-", ""))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid RFQ ID") from exc


def _parse_quote_id(prefixed_id: str) -> int:
    try:
        return int(prefixed_id.replace("Q-", "").replace("q-", ""))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid Quote ID") from exc


def _get_or_create_standalone_rfq(db: Session, payload: QuoteGenerateRequest) -> int:
    rfq = RFQ(
        customer=None,
        email_body="Direct quote request",
        origin=payload.origin,
        destination=payload.destination,
        cargo_type=payload.cargo_type,
        container_type=payload.container_type,
        weight=payload.weight,
        quantity=payload.quantity,
        status="quoted",
        confidence_json="{}",
    )
    db.add(rfq)
    db.flush()
    return rfq.id
