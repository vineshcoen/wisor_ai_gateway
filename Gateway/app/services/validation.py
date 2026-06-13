from app.schemas.rfq import ExtractedData, ValidationItem

REQUIRED_FIELDS = ["origin", "destination", "container_type"]
OPTIONAL_FIELDS = ["cargo_type", "weight", "ready_date", "customer", "quantity"]


def validate_extraction(data: ExtractedData) -> tuple[list[ValidationItem], str]:
    validation: list[ValidationItem] = []
    missing_required = 0

    for field in REQUIRED_FIELDS:
        value = getattr(data, field)
        if value:
            validation.append(
                ValidationItem(field=field, status="ok", message=f"{field.replace('_', ' ').title()} found")
            )
        else:
            missing_required += 1
            validation.append(
                ValidationItem(
                    field=field,
                    status="missing",
                    message=f"{field.replace('_', ' ').title()} missing",
                )
            )

    for field in OPTIONAL_FIELDS:
        value = getattr(data, field)
        if value:
            validation.append(
                ValidationItem(field=field, status="ok", message=f"{field.replace('_', ' ').title()} found")
            )
        else:
            validation.append(
                ValidationItem(
                    field=field,
                    status="warning",
                    message=f"{field.replace('_', ' ').title()} not provided",
                )
            )

    if missing_required == 0:
        status = "ready_for_quote"
    elif missing_required < len(REQUIRED_FIELDS):
        status = "pending"
    else:
        status = "pending"

    return validation, status
