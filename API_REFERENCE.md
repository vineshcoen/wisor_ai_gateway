# API_REFERENCE.md

# Wisor AI Clone - API Reference

## Overview

This document describes all REST APIs exposed by the Wisor AI backend.

Base URL:

```text
http://localhost:8000
```

API Prefix:

```text
/api
```

Response Format:

```json
{
  "success": true,
  "data": {}
}
```

---

# Dashboard APIs

## Get Dashboard Statistics

Returns summary metrics displayed on the dashboard.

### Endpoint

```http
GET /api/dashboard/stats
```

### Purpose

Provides operational KPIs for dashboard cards.

### Response

```json
{
  "rfqs_today": 3,
  "quotes_generated": 3,
  "pending_reviews": 1,
  "revenue": 15180
}
```

### Frontend Usage

Used by:

```text
Dashboard.jsx
```

Displayed in:

```text
StatCard.jsx
```

---

# RFQ APIs

RFQ = Request For Quotation

These endpoints manage incoming freight inquiries.

---

## Get All RFQs

Returns all RFQ records.

### Endpoint

```http
GET /api/rfq
```

### Response

```json
[
  {
    "rfq_id": "RFQ-1",
    "customer": "ABC Exports",
    "status": "quoted"
  }
]
```

### Frontend Usage

Used by:

```text
RFQInbox.jsx
RFQList.jsx
```

---

## Get RFQ Details

Returns a complete RFQ including extraction results, confidence scores, and validation results.

### Endpoint

```http
GET /api/rfq/{rfq_id}
```

### Example

```http
GET /api/rfq/RFQ-1
```

### Response

```json
{
  "rfq_id": "RFQ-1",
  "customer": "ABC Exports",
  "email_body": "...",

  "extracted": {
    "origin": "Ahmedabad",
    "destination": "Hamburg",
    "container_type": "40FT",
    "quantity": 2
  },

  "confidence": {
    "origin": 0.95,
    "destination": 0.93
  },

  "validation": {
    "origin": "ok",
    "weight": "missing"
  }
}
```

### Frontend Usage

Used by:

```text
RFQDetail.jsx
```

---

## Create RFQ

Processes a freight inquiry email and creates a new RFQ.

### Endpoint

```http
POST /api/rfq/process
```

### Request

```json
{
  "customer": "ABC Exports",
  "customer_email": "sales@abc.com",
  "email_body": "Need rates for 2 x 40FT containers from Ahmedabad to Hamburg."
}
```

### Backend Flow

1. Receive Email
2. Extract Shipment Data
3. Generate Confidence Scores
4. Run Validation
5. Save RFQ

### Response

```json
{
  "rfq_id": "RFQ-4",
  "status": "pending"
}
```

### Frontend Usage

Used by:

```text
CreateRFQDialog.jsx
RFQForm.jsx
```

---

## Mark RFQ Complete

Updates RFQ status.

### Endpoint

```http
PATCH /api/rfq/{rfq_id}/complete
```

### Example

```http
PATCH /api/rfq/RFQ-1/complete
```

### Response

```json
{
  "message": "RFQ marked complete"
}
```

### Frontend Usage

Used by:

```text
RFQDetail.jsx
```

---

## Delete RFQ

Removes an RFQ record.

### Endpoint

```http
DELETE /api/rfq/{rfq_id}
```

### Example

```http
DELETE /api/rfq/RFQ-1
```

### Response

```json
{
  "message": "RFQ deleted successfully"
}
```

### Frontend Usage

Used by:

```text
RFQDetail.jsx
```

---

# Quote APIs

Responsible for freight pricing and quotation generation.

---

## Generate Quote

Creates a quotation from a selected RFQ.

### Endpoint

```http
POST /api/quote/generate
```

### Request

```json
{
  "rfq_id": "RFQ-1"
}
```

### Backend Flow

1. Load RFQ
2. Read Extracted Shipment Data
3. Apply Pricing Rules
4. Calculate Charges
5. Generate Quote
6. Save Quote

### Response

```json
{
  "quote_id": "Q-5",

  "shipment": {
    "container_type": "40FT",
    "cargo_type": "Textile Garments",
    "quantity": 2,
    "weight": 20500
  },

  "charges": [
    {
      "name": "Base Freight",
      "amount": 4400
    },
    {
      "name": "Documentation",
      "amount": 300
    }
  ],

  "total": 5060,
  "currency": "USD"
}
```

### Frontend Usage

Used by:

```text
RFQDetail.jsx
QuoteDialog.jsx
```

---

## Get AI Pricing Explanation

Returns detailed reasoning behind generated pricing.

### Endpoint

```http
POST /api/quote/explanation
```

### Request

```json
{
  "quote_id": "Q-5"
}
```

### Response

```json
{
  "confidence": 0.96,

  "risk_flags": [
    "Fuel Volatility"
  ],

  "explanations": [
    {
      "charge": "Base Freight",
      "amount": 4400,
      "reason": "India to Germany rate card applied."
    },
    {
      "charge": "Fuel",
      "amount": 160,
      "reason": "Current fuel surcharge policy."
    }
  ]
}
```

### Frontend Usage

Used by:

```text
QuoteExplanationDialog.jsx
```

---

## Get Quote History

Returns all previously generated quotations.

### Endpoint

```http
GET /api/quote/history
```

### Response

```json
[
  {
    "quote_id": "Q-5",
    "customer": "ABC Exports",
    "route": "Ahmedabad → Hamburg",
    "amount": 5060,
    "currency": "USD",
    "created_at": "2026-06-13T15:57:54"
  }
]
```

### Frontend Usage

Used by:

```text
QuoteHistory.jsx
```

---

# Error Responses

## Validation Error

```json
{
  "detail": "Missing required fields"
}
```

HTTP Status:

```text
400 Bad Request
```

---

## Resource Not Found

```json
{
  "detail": "RFQ not found"
}
```

HTTP Status:

```text
404 Not Found
```

---

## Internal Server Error

```json
{
  "detail": "Internal Server Error"
}
```

HTTP Status:

```text
500 Internal Server Error
```

---

# End-to-End API Flow

```text
Create RFQ
POST /api/rfq/process

        ↓

Get RFQs
GET /api/rfq

        ↓

Select RFQ
GET /api/rfq/{id}

        ↓

Generate Quote
POST /api/quote/generate

        ↓

View Explanation
POST /api/quote/explanation

        ↓

View History
GET /api/quote/history
```

---

# API Summary

| Endpoint               | Method | Purpose             |
| ---------------------- | ------ | ------------------- |
| /api/dashboard/stats   | GET    | Dashboard metrics   |
| /api/rfq               | GET    | RFQ list            |
| /api/rfq/{id}          | GET    | RFQ details         |
| /api/rfq/process       | POST   | Create RFQ          |
| /api/rfq/{id}/complete | PATCH  | Complete RFQ        |
| /api/rfq/{id}          | DELETE | Delete RFQ          |
| /api/quote/generate    | POST   | Generate Quote      |
| /api/quote/explanation | POST   | Pricing Explanation |
| /api/quote/history     | GET    | Quote History       |

This API layer forms the communication bridge between the React frontend and the FastAPI backend while supporting the complete freight quotation workflow.
