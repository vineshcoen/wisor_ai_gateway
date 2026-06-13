"""Seed rate cards and surcharges for demo."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import Base, SessionLocal, engine
from app.models.rfq import RateCard, Surcharge


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if db.query(RateCard).count() == 0:
            db.add_all(
                [
                    RateCard(
                        origin="India",
                        destination="Germany",
                        container_type="40FT",
                        base_price=2200.0,
                        rate_card_code="EU-40FT",
                    ),
                    RateCard(
                        origin="India",
                        destination="Germany",
                        container_type="20FT",
                        base_price=1400.0,
                        rate_card_code="EU-20FT",
                    ),
                    RateCard(
                        origin="India",
                        destination="USA",
                        container_type="40FT",
                        base_price=2800.0,
                        rate_card_code="US-40FT",
                    ),
                ]
            )

        if db.query(Surcharge).count() == 0:
            db.add_all(
                [
                    Surcharge(
                        name="Documentation",
                        amount=150.0,
                        reason_template="Required export documentation for {origin} → {destination}.",
                    ),
                    Surcharge(
                        name="Fuel",
                        amount=80.0,
                        reason_template="Current fuel surcharge policy applied.",
                    ),
                    Surcharge(
                        name="Handling",
                        amount=100.0,
                        reason_template="Port handling fee for {container_type} container.",
                    ),
                ]
            )

        db.commit()
        print("Seed data loaded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
