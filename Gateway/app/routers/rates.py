from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.rfq import Quote, RateCard, RFQ, Surcharge
from app.schemas.rate import (
    DashboardStats,
    RateCardCreate,
    RateCardResponse,
    RateCardUpdate,
    SurchargeResponse,
    SurchargeUpdate,
)

router = APIRouter(prefix="/api", tags=["Rates & Dashboard"])


@router.get("/rates", response_model=list[RateCardResponse])
def list_rates(db: Session = Depends(get_db)):
    return db.query(RateCard).order_by(RateCard.id).all()


@router.post("/rates", response_model=RateCardResponse, status_code=201)
def create_rate(payload: RateCardCreate, db: Session = Depends(get_db)):
    rate = RateCard(**payload.model_dump())
    db.add(rate)
    db.commit()
    db.refresh(rate)
    return rate


@router.put("/rates/{rate_id}", response_model=RateCardResponse)
def update_rate(rate_id: int, payload: RateCardUpdate, db: Session = Depends(get_db)):
    rate = db.query(RateCard).filter(RateCard.id == rate_id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Rate card not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(rate, key, value)

    db.commit()
    db.refresh(rate)
    return rate


@router.delete("/rates/{rate_id}")
def delete_rate(rate_id: int, db: Session = Depends(get_db)):
    rate = db.query(RateCard).filter(RateCard.id == rate_id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Rate card not found")
    db.delete(rate)
    db.commit()
    return {"message": "Rate card deleted"}


@router.get("/surcharges", response_model=list[SurchargeResponse])
def list_surcharges(db: Session = Depends(get_db)):
    return db.query(Surcharge).order_by(Surcharge.id).all()


@router.put("/surcharges/{surcharge_id}", response_model=SurchargeResponse)
def update_surcharge(
    surcharge_id: int, payload: SurchargeUpdate, db: Session = Depends(get_db)
):
    surcharge = db.query(Surcharge).filter(Surcharge.id == surcharge_id).first()
    if not surcharge:
        raise HTTPException(status_code=404, detail="Surcharge not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(surcharge, key, value)

    db.commit()
    db.refresh(surcharge)
    return surcharge


@router.get("/dashboard/stats", response_model=DashboardStats)
def dashboard_stats(db: Session = Depends(get_db)):
    today = datetime.now().date()
    rfqs_today = (
        db.query(RFQ)
        .filter(func.date(RFQ.created_at) == today)
        .count()
    )
    quotes_generated = db.query(Quote).count()
    pending_review = (
        db.query(RFQ)
        .filter(RFQ.status.in_(["pending", "ready_for_quote"]))
        .count()
    )
    revenue = db.query(func.coalesce(func.sum(Quote.total_amount), 0.0)).scalar() or 0.0

    return DashboardStats(
        rfqs_today=rfqs_today,
        quotes_generated=quotes_generated,
        pending_review=pending_review,
        revenue=float(revenue),
    )
