import json
import re

from groq import Groq

from app.config import settings
from app.schemas.rfq import ExtractedData

EXTRACTION_PROMPT = """You are a freight logistics assistant. Extract shipment details from the customer email.

Return ONLY valid JSON with this exact structure:
{
  "customer": "company or sender name or null",
  "origin": "city/port/country or null",
  "destination": "city/port/country or null",
  "cargo_type": "type of cargo or null",
  "container_type": "e.g. 20FT, 40FT, LCL or null",
  "weight": "weight with unit or null",
  "quantity": number of containers/units or null,
  "ready_date": "shipment ready date or null",
  "confidence": {
    "customer": 0.0 to 1.0,
    "origin": 0.0 to 1.0,
    "destination": 0.0 to 1.0,
    "cargo_type": 0.0 to 1.0,
    "container_type": 0.0 to 1.0,
    "weight": 0.0 to 1.0,
    "quantity": 0.0 to 1.0,
    "ready_date": 0.0 to 1.0
  }
}

Email:
"""


def _fallback_extraction(email: str) -> tuple[ExtractedData, dict[str, float]]:
    """Regex fallback when Groq is unavailable."""
    data: dict = {
        "customer": None,
        "origin": None,
        "destination": None,
        "cargo_type": None,
        "container_type": None,
        "weight": None,
        "quantity": None,
        "ready_date": None,
    }

    container_match = re.search(r"(\d+)\s*x\s*(\d+FT)", email, re.IGNORECASE)
    if container_match:
        data["quantity"] = int(container_match.group(1))
        data["container_type"] = container_match.group(2).upper()

    route_match = re.search(
        r"from\s+([^,\n]+?)(?:,\s*[^,\n]+)?\s+to\s+([^,\n]+?)(?:,\s*[^,\n]+)?",
        email,
        re.IGNORECASE,
    )
    if route_match:
        data["origin"] = route_match.group(1).strip()
        data["destination"] = route_match.group(2).strip()

    cargo_match = re.search(r"cargo:\s*(.+)", email, re.IGNORECASE)
    if cargo_match:
        data["cargo_type"] = cargo_match.group(1).strip()

    weight_match = re.search(r"weight:\s*(.+)", email, re.IGNORECASE)
    if weight_match:
        data["weight"] = weight_match.group(1).strip()

    ready_match = re.search(r"ready\s*date:\s*(.+)", email, re.IGNORECASE)
    if ready_match:
        data["ready_date"] = ready_match.group(1).strip()

    regards_match = re.search(r"regards,?\s*\n(.+)", email, re.IGNORECASE)
    if regards_match:
        data["customer"] = regards_match.group(1).strip()

    confidence = {
        field: 0.85 if data.get(field) is not None else 0.0
        for field in [
            "customer",
            "origin",
            "destination",
            "cargo_type",
            "container_type",
            "weight",
            "quantity",
            "ready_date",
        ]
    }

    return ExtractedData(**data), confidence


def extract_from_email(email: str) -> tuple[ExtractedData, dict[str, float]]:
    if not settings.groq_api_key:
        return _fallback_extraction(email)

    client = Groq(api_key=settings.groq_api_key)
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": EXTRACTION_PROMPT + email},
        ],
        temperature=0.1,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content or "{}"
    parsed = json.loads(raw)
    confidence = parsed.pop("confidence", {})

    extracted = ExtractedData(
        customer=parsed.get("customer"),
        origin=parsed.get("origin"),
        destination=parsed.get("destination"),
        cargo_type=parsed.get("cargo_type"),
        container_type=parsed.get("container_type"),
        weight=parsed.get("weight"),
        quantity=parsed.get("quantity"),
        ready_date=parsed.get("ready_date"),
    )

    normalized_confidence = {
        field: float(confidence.get(field, 0.0))
        for field in [
            "customer",
            "origin",
            "destination",
            "cargo_type",
            "container_type",
            "weight",
            "quantity",
            "ready_date",
        ]
    }

    return extracted, normalized_confidence
