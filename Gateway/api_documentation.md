Wisor AI — API Reference Notes
Base URL: http://localhost:8000
Interactive docs: http://localhost:8000/docs

How the APIs fit together
Customer Email
      ↓
POST /api/rfq/process        ← AI extracts shipment data
      ↓
GET  /api/rfq/{id}           ← Review extraction + validation
      ↓
POST /api/quote/generate     ← Pricing engine calculates quote
      ↓
POST /api/quote/explanation  ← Explain WHY each charge exists
      ↓
GET  /api/quote/history      ← Audit trail
Admin screens use /api/rates, /api/surcharges, and /api/dashboard/stats.

RFQ APIs — /api/rfq
These handle incoming customer emails and AI extraction. Maps to Screen 2 (RFQ Inbox) and Screen 3 (AI Extraction Review).

1. POST /api/rfq/process
Purpose: Main entry point. Takes a raw customer email, uses Groq AI to extract shipment details, validates them, and saves an RFQ to the database.

When to use: User clicks "Process RFQ" on an email in the inbox.

Request body:

{
  "email": "Hi Team,\n\nPlease provide rates for shipping 2 x 40FT containers from Ahmedabad, India to Hamburg, Germany.\n\nCargo: Textile\nWeight: 20 Tons\nReady Date: Next Week\n\nRegards,\nABC Exports"
}
What happens internally:

Groq AI (llama-3.3-70b-versatile) parses the email into structured fields
Validation service checks required vs optional fields
RFQ record is saved to MySQL rfqs table
Status is set automatically:
ready_for_quote — all required fields found (origin, destination, container_type)
pending — some required fields missing
Response:

{
  "rfq_id": "RFQ-1",
  "extracted": {
    "customer": "ABC Exports",
    "origin": "Ahmedabad, India",
    "destination": "Hamburg, Germany",
    "cargo_type": "Textile",
    "container_type": "40FT",
    "weight": "20 Tons",
    "quantity": 2,
    "ready_date": "Next Week"
  },
  "confidence": {
    "customer": 0.9,
    "origin": 0.9,
    "destination": 0.9,
    "cargo_type": 0.9,
    "container_type": 0.9,
    "weight": 0.9,
    "quantity": 0.9,
    "ready_date": 0.5
  },
  "validation": [
    { "field": "origin", "status": "ok", "message": "Origin found" },
    { "field": "destination", "status": "ok", "message": "Destination found" },
    { "field": "container_type", "status": "ok", "message": "Container Type found" },
    { "field": "cargo_type", "status": "ok", "message": "Cargo Type found" },
    { "field": "weight", "status": "ok", "message": "Weight found" },
    { "field": "ready_date", "status": "warning", "message": "Ready Date not provided" }
  ],
  "status": "ready_for_quote"
}
Validation status values:

Status	Meaning
ok
Field was found
missing
Required field not found — blocks quote
warning
Optional field missing — quote can still be generated
Errors: None specific — always returns 200 if email is provided. Falls back to regex extraction if Groq key is missing.

2. POST /api/rfq/sample
Purpose: Shortcut for demos/interviews. Processes a hardcoded sample email (Ahmedabad → Hamburg) without sending a body.

When to use: Quick demo, testing, or "Try Sample" button on frontend.

Request body: None

Response: Same shape as /process.

3. GET /api/rfq
Purpose: List all RFQs for the inbox table. Newest first.

When to use: Load RFQ Inbox screen (Screen 2).

Request: No body. No query params.

Response:

[
  {
    "rfq_id": "RFQ-1",
    "customer": "ABC Exports",
    "origin": "Ahmedabad, India",
    "destination": "Hamburg, Germany",
    "status": "ready_for_quote",
    "created_at": "2026-06-13T09:00:00"
  }
]
RFQ status values:

Status	Meaning
pending
Missing required data
ready_for_quote
All required fields present
quoted
Quote has been generated
complete
Manually marked done
4. GET /api/rfq/{rfq_id}
Purpose: Full detail for one RFQ — original email, extracted data, confidence scores, and validation panel. Powers Screen 3 (AI Extraction Review).

When to use: User selects an RFQ from the inbox.

URL example: GET /api/rfq/RFQ-1 (also accepts rfq-1)

Response: Everything from the list item, plus:

{
  "rfq_id": "RFQ-1",
  "customer": "ABC Exports",
  "origin": "Ahmedabad, India",
  "destination": "Hamburg, Germany",
  "status": "ready_for_quote",
  "created_at": "2026-06-13T09:00:00",
  "email_body": "Hi Team,\n\nPlease provide rates...",
  "extracted": { "...same as process response..." },
  "confidence": { "...same as process response..." },
  "validation": [ "...same as process response..." ]
}
Errors:

Code	Reason
400
Invalid RFQ ID format
404
RFQ not found
5. DELETE /api/rfq/{rfq_id}
Purpose: Remove an RFQ from the inbox.

When to use: "Delete" button on RFQ Inbox (Screen 2).

Response:

{ "message": "RFQ deleted" }
Errors: 400 (bad ID), 404 (not found)

6. PATCH /api/rfq/{rfq_id}/complete
Purpose: Mark an RFQ as handled/done.

When to use: "Mark Complete" button on RFQ Inbox (Screen 2).

Response:

{ "rfq_id": "RFQ-1", "status": "complete" }
Errors: 400 (bad ID), 404 (not found)

Quote APIs — /api/quote
These handle pricing, explanation, and history. Maps to Screen 4 (Quote Generation), Screen 5 (AI Pricing Explanation), and Screen 7 (Quote History).

7. POST /api/quote/generate
Purpose: Core pricing engine. Looks up rate cards + surcharges, calculates total, saves quote, and returns a full breakdown with reasons.

When to use: User clicks "Generate Quote" on Extraction Review (Screen 3) or Quote screen (Screen 4).

Request — Option A (from existing RFQ):

{ "rfq_id": "RFQ-1" }
Request — Option B (direct, no RFQ):

{
  "origin": "Ahmedabad, India",
  "destination": "Hamburg, Germany",
  "container_type": "40FT",
  "quantity": 2
}
What happens internally:

Loads RFQ data (if rfq_id provided)
Finds matching rate card (fuzzy match: "Ahmedabad, India" matches origin "India")
Applies all surcharges from DB (Documentation, Fuel, Handling)
Multiplies by quantity (number of containers)
Computes quote confidence and risk flags
Saves quote to quotes table
Updates RFQ status to quoted
Response:

{
  "quote_id": "Q-1",
  "rfq_id": "RFQ-1",
  "shipment_summary": {
    "origin": "Ahmedabad, India",
    "destination": "Hamburg, Germany",
    "container_type": "40FT",
    "quantity": 2,
    "cargo_type": "Textile",
    "weight": "20 Tons"
  },
  "breakdown": [
    {
      "name": "Base Freight",
      "amount": 4400.0,
      "reason": "India → Germany route, Rate Card #EU-40FT"
    },
    {
      "name": "Documentation",
      "amount": 300.0,
      "reason": "Required export documentation for Ahmedabad, India → Hamburg, Germany."
    },
    {
      "name": "Fuel",
      "amount": 160.0,
      "reason": "Current fuel surcharge policy applied."
    },
    {
      "name": "Handling",
      "amount": 200.0,
      "reason": "Port handling fee for 40FT container."
    }
  ],
  "total": 5060.0,
  "currency": "USD",
  "quote_confidence": 0.96,
  "risk_flags": ["No missing data", "No validation errors"]
}
Pricing math example (2 × 40FT containers):

Line item	Calculation	Amount
Base Freight
$2200 × 2
$4400
Documentation
$150 × 2
$300
Fuel
$80 × 2
$160
Handling
$100 × 2
$200
Total
$5060
Errors:

Code	Reason
400
Missing origin, destination, or container_type
404
RFQ not found, or no matching rate card for route
8. POST /api/quote/explanation
Purpose: Returns the explainable AI breakdown — the key differentiator. Shows WHY each charge was applied. Powers Screen 5 (AI Pricing Explanation).

When to use: After quote is generated, user opens the explanation panel.

Request:

{ "quote_id": "Q-1" }
Response:

{
  "quote_id": "Q-1",
  "route": "Ahmedabad, India → Hamburg, Germany",
  "line_items": [
    {
      "name": "Base Freight",
      "amount": 4400.0,
      "reason": "India → Germany route, Rate Card #EU-40FT"
    },
    {
      "name": "Documentation",
      "amount": 300.0,
      "reason": "Required export documentation for Ahmedabad, India → Hamburg, Germany."
    }
  ],
  "quote_confidence": 0.96,
  "risk_flags": ["No missing data", "No validation errors"]
}
Note: Explanation is also stored in DB at quote generation time. This endpoint retrieves it — no second AI call.

Errors: 400 (bad ID), 404 (quote not found)

9. GET /api/quote/history
Purpose: Audit trail of all generated quotes. Powers Screen 7 (Quote History).

When to use: Load quote history table.

Response:

[
  {
    "quote_id": "Q-1",
    "customer": "ABC Exports",
    "route": "Ahmedabad, India → Hamburg, Germany",
    "amount": 5060.0,
    "currency": "USD",
    "created_at": "2026-06-13T09:05:00"
  }
]
Admin & Dashboard APIs — /api
Maps to Screen 1 (Dashboard) and Screen 6 (Pricing Administration).

10. GET /api/dashboard/stats
Purpose: KPI cards for the executive dashboard.

When to use: Load Dashboard screen (Screen 1).

Response:

{
  "rfqs_today": 5,
  "quotes_generated": 3,
  "pending_review": 2,
  "revenue": 15180.0
}
Field	What it counts
rfqs_today
RFQs created today
quotes_generated
Total quotes ever generated
pending_review
RFQs with status pending or ready_for_quote
revenue
Sum of all quote totals
11. GET /api/rates
Purpose: List all freight rate cards.

When to use: Load Pricing Admin table (Screen 6).

Response:

[
  {
    "id": 1,
    "origin": "India",
    "destination": "Germany",
    "container_type": "40FT",
    "base_price": 2200.0,
    "rate_card_code": "EU-40FT"
  }
]
12. POST /api/rates
Purpose: Add a new route rate card.

When to use: "Add Route" button on Pricing Admin.

Request:

{
  "origin": "India",
  "destination": "France",
  "container_type": "40FT",
  "base_price": 2100.0,
  "rate_card_code": "EU-FR-40FT"
}
Response: Created rate card object (status 201).

13. PUT /api/rates/{rate_id}
Purpose: Update an existing rate card. Partial update — only send fields you want to change.

When to use: "Edit Route" on Pricing Admin.

Request example:

{ "base_price": 2300.0 }
Response: Updated rate card object.

Errors: 404 if rate_id doesn't exist.

14. DELETE /api/rates/{rate_id}
Purpose: Remove a rate card.

When to use: "Delete Route" on Pricing Admin.

Response:

{ "message": "Rate card deleted" }
Errors: 404 if not found.

15. GET /api/surcharges
Purpose: List all surcharges (Documentation, Fuel, Handling, etc.).

When to use: Surcharge section on Pricing Admin (Screen 6).

Response:

[
  {
    "id": 1,
    "name": "Documentation",
    "amount": 150.0,
    "reason_template": "Required export documentation for {origin} → {destination}."
  },
  {
    "id": 2,
    "name": "Fuel",
    "amount": 80.0,
    "reason_template": "Current fuel surcharge policy applied."
  }
]
The reason_template supports placeholders: {origin}, {destination}, {container_type}, {name} — filled in at quote time.

16. PUT /api/surcharges/{surcharge_id}
Purpose: Update surcharge amount or reason text.

When to use: Edit surcharge on Pricing Admin.

Request example:

{
  "amount": 175.0,
  "reason_template": "Updated customs processing fee for {origin} → {destination}."
}
Response: Updated surcharge object.

Errors: 404 if not found.

Root endpoint
GET /
Purpose: Health check.

Response:

{ "message": "Wisor AI API", "docs": "/docs" }
Screen → API mapping (quick reference)
Screen	APIs used
1. Dashboard
GET /api/dashboard/stats, GET /api/rfq
2. RFQ Inbox
GET /api/rfq, GET /api/rfq/{id}, DELETE /api/rfq/{id}, PATCH /api/rfq/{id}/complete
3. AI Extraction Review
GET /api/rfq/{id}, POST /api/rfq/process, POST /api/quote/generate
4. Quote Generation
POST /api/quote/generate
5. AI Pricing Explanation
POST /api/quote/explanation
6. Pricing Admin
GET/POST/PUT/DELETE /api/rates, GET/PUT /api/surcharges
7. Quote History
GET /api/quote/history
Typical demo flow (for interview notes)
# 1. Process sample email
POST /api/rfq/sample
# 2. Generate quote from extracted RFQ
POST /api/quote/generate  { "rfq_id": "RFQ-1" }
# 3. Show explainable pricing
POST /api/quote/explanation  { "quote_id": "Q-1" }
# 4. Show dashboard stats
GET /api/dashboard/stats
This demonstrates the full pipeline: Email → AI Extraction → Validation → Pricing → Explainable Quote — the core value proposition of the platform.