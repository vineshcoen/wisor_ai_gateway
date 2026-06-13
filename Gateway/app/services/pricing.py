from sqlalchemy.orm import Session

from app.models.rfq import RateCard, Surcharge
from app.schemas.quote import PricingLineItem


def _normalize(value: str | None) -> str:
    return (value or "").strip().lower()


def _find_rate_card(
    db: Session, origin: str, destination: str, container_type: str
) -> RateCard | None:
    origin_n = _normalize(origin)
    dest_n = _normalize(destination)
    container_n = _normalize(container_type)

    cards = db.query(RateCard).all()
    for card in cards:
        if (
            _normalize(card.origin) in origin_n or origin_n in _normalize(card.origin)
        ) and (
            _normalize(card.destination) in dest_n
            or dest_n in _normalize(card.destination)
        ):
            if _normalize(card.container_type) == container_n:
                return card

    for card in cards:
        if (
            _normalize(card.origin) in origin_n or origin_n in _normalize(card.origin)
        ) and (
            _normalize(card.destination) in dest_n
            or dest_n in _normalize(card.destination)
        ):
            return card

    return None


def calculate_quote(
    db: Session,
    origin: str,
    destination: str,
    container_type: str,
    quantity: int = 1,
) -> tuple[list[PricingLineItem], float, list[str]]:
    risk_flags: list[str] = []
    line_items: list[PricingLineItem] = []

    rate_card = _find_rate_card(db, origin, destination, container_type)
    if not rate_card:
        raise ValueError(
            f"No rate card found for route {origin} → {destination} ({container_type})"
        )

    base_amount = rate_card.base_price * max(quantity, 1)
    code = rate_card.rate_card_code or f"RC-{rate_card.id}"
    line_items.append(
        PricingLineItem(
            name="Base Freight",
            amount=base_amount,
            reason=f"{rate_card.origin} → {rate_card.destination} route, Rate Card #{code}",
        )
    )

    surcharges = db.query(Surcharge).all()
    for surcharge in surcharges:
        amount = surcharge.amount * max(quantity, 1)
        reason = surcharge.reason_template.format(
            origin=origin,
            destination=destination,
            container_type=container_type,
            name=surcharge.name,
        )
        line_items.append(
            PricingLineItem(
                name=surcharge.name,
                amount=amount,
                reason=reason,
            )
        )

    total = sum(item.amount for item in line_items)
    return line_items, total, risk_flags


def compute_quote_confidence(
    has_all_required: bool, missing_optional: list[str]
) -> tuple[float, list[str]]:
    risk_flags: list[str] = []
    confidence = 0.96 if has_all_required else 0.75

    for field in missing_optional:
        risk_flags.append(f"{field.replace('_', ' ').title()} not provided.")

    if not has_all_required:
        risk_flags.append("Required shipment data incomplete.")
        confidence = 0.6

    if not risk_flags:
        risk_flags.append("No missing data")
        risk_flags.append("No validation errors")

    return confidence, risk_flags
