import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.rfq import RFQ
from app.schemas.rfq import (
    ExtractedData,
    RFQDetail,
    RFQListItem,
    RFQProcessRequest,
    RFQProcessResponse,
    ValidationItem,
)
from app.services.extraction import extract_from_email
from app.services.validation import validate_extraction

router = APIRouter(prefix="/api/rfq", tags=["RFQ"])

SAMPLE_EMAIL = """Hi Team,

Please provide rates for shipping 2 x 40FT containers from Ahmedabad, India to Hamburg, Germany.

Cargo: Textile
Weight: 20 Tons
Ready Date: Next Week

Regards,
ABC Exports"""


@router.post("/process", response_model=RFQProcessResponse)
def process_rfq(payload: RFQProcessRequest, db: Session = Depends(get_db)):
    extracted, confidence = extract_from_email(payload.email)
    validation, status = validate_extraction(extracted)

    rfq = RFQ(
        customer=extracted.customer,
        email_body=payload.email,
        origin=extracted.origin,
        destination=extracted.destination,
        cargo_type=extracted.cargo_type,
        container_type=extracted.container_type,
        weight=extracted.weight,
        quantity=extracted.quantity,
        ready_date=extracted.ready_date,
        status=status,
        confidence_json=json.dumps(confidence),
    )
    db.add(rfq)
    db.commit()
    db.refresh(rfq)

    return RFQProcessResponse(
        rfq_id=rfq.rfq_id,
        extracted=extracted,
        confidence=confidence,
        validation=validation,
        status=status,
    )


@router.get("", response_model=list[RFQListItem])
def list_rfqs(db: Session = Depends(get_db)):
    rfqs = db.query(RFQ).order_by(RFQ.created_at.desc()).all()
    return [
        RFQListItem(
            rfq_id=r.rfq_id,
            customer=r.customer,
            origin=r.origin,
            destination=r.destination,
            status=r.status,
            created_at=r.created_at,
        )
        for r in rfqs
    ]


@router.get("/{rfq_id}", response_model=RFQDetail)
def get_rfq(rfq_id: str, db: Session = Depends(get_db)):
    db_id = _parse_id(rfq_id)
    rfq = db.query(RFQ).filter(RFQ.id == db_id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")

    confidence = json.loads(rfq.confidence_json or "{}")
    extracted = ExtractedData(
        customer=rfq.customer,
        origin=rfq.origin,
        destination=rfq.destination,
        cargo_type=rfq.cargo_type,
        container_type=rfq.container_type,
        weight=rfq.weight,
        quantity=rfq.quantity,
        ready_date=rfq.ready_date,
    )
    validation, _ = validate_extraction(extracted)

    return RFQDetail(
        rfq_id=rfq.rfq_id,
        customer=rfq.customer,
        origin=rfq.origin,
        destination=rfq.destination,
        status=rfq.status,
        created_at=rfq.created_at,
        email_body=rfq.email_body,
        extracted=extracted,
        confidence=confidence,
        validation=validation,
    )


@router.delete("/{rfq_id}")
def delete_rfq(rfq_id: str, db: Session = Depends(get_db)):
    db_id = _parse_id(rfq_id)
    rfq = db.query(RFQ).filter(RFQ.id == db_id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    db.delete(rfq)
    db.commit()
    return {"message": "RFQ deleted"}


@router.patch("/{rfq_id}/complete")
def mark_complete(rfq_id: str, db: Session = Depends(get_db)):
    db_id = _parse_id(rfq_id)
    rfq = db.query(RFQ).filter(RFQ.id == db_id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    rfq.status = "complete"
    db.commit()
    return {"rfq_id": rfq.rfq_id, "status": rfq.status}


@router.post("/sample", response_model=RFQProcessResponse)
def process_sample_rfq(db: Session = Depends(get_db)):
    return process_rfq(RFQProcessRequest(email=SAMPLE_EMAIL), db)


def _parse_id(prefixed_id: str) -> int:
    try:
        return int(prefixed_id.replace("RFQ-", "").replace("rfq-", ""))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid RFQ ID") from exc
