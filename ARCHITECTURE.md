# ARCHITECTURE.md

# Wisor AI Clone - System Architecture

## Overview

The system is designed as a full-stack freight quotation platform that transforms unstructured customer freight inquiry emails into structured shipment data, validates the extracted information, generates quotations, and provides AI-powered pricing explanations.

The architecture follows a modern layered design:

Frontend (React)
↓
REST API Layer (FastAPI)
↓
Business Logic Layer
↓
Data Access Layer
↓
MySQL Database

---

# High Level Architecture

```text
Customer User
     │
     ▼
React Frontend
     │
     ▼
Axios API Client
     │
     ▼
FastAPI Backend
     │
 ┌───┼─────────────────────┐
 │   │                     │
 ▼   ▼                     ▼
RFQ Service       Quote Service
 │                     │
 ▼                     ▼
Extraction Engine  Pricing Engine
 │                     │
 └──────┬──────────────┘
        ▼
     MySQL
```

---

# Frontend Architecture

Location:

```text
frontend/src/
```

The frontend follows a component-driven architecture.

---

# Frontend Layers

## Layout Layer

Purpose:

Provides global application structure.

Files:

```text
layouts/
└── MainLayout.jsx
```

Responsibilities:

* Sidebar navigation
* Header bar
* Content rendering area
* Responsive layout

---

## Page Layer

Purpose:

Represents route-level screens.

Files:

```text
pages/
├── Dashboard.jsx
├── RFQInbox.jsx
├── PricingAdmin.jsx
└── QuoteHistory.jsx
```

Responsibilities:

* API calls
* State management
* Page orchestration
* Component composition

---

## Component Layer

Purpose:

Reusable UI modules.

### Dashboard Components

```text
components/dashboard/
├── DashboardHeader.jsx
├── StatCard.jsx
└── RecentRFQTable.jsx
```

### RFQ Components

```text
components/rfq/
├── RFQList.jsx
├── RFQDetail.jsx
├── RFQForm.jsx
├── CreateRFQDialog.jsx
├── EmailCard.jsx
├── ExtractionCard.jsx
├── ConfidencePanel.jsx
├── ValidationPanel.jsx
└── RFQHealthCard.jsx
```

### Quote Components

```text
components/quotes/
├── QuoteSummary.jsx
├── QuoteBreakdown.jsx
├── QuoteConfidence.jsx
├── QuoteDialog.jsx
├── QuoteExplanationDialog.jsx
└── ExplanationCard.jsx
```

---

# Routing Architecture

Location:

```text
routes/index.jsx
```

Route Definitions:

```text
/
├── Dashboard

/rfq
├── RFQ Inbox

/pricing
├── Pricing Admin

/history
├── Quote History
```

React Router manages navigation without page reloads.

---

# API Communication Layer

Location:

```text
services/api.js
```

Purpose:

Single Axios instance.

Responsibilities:

* Centralized base URL
* Request management
* Response handling
* Future authentication support

Example:

```javascript
const api = axios.create({
  baseURL: "http://localhost:8000"
});
```

---

# Backend Architecture

Location:

```text
Gateway/
└── app/
```

Backend follows a layered architecture.

```text
API Layer
    │
Business Layer
    │
Repository Layer
    │
Database Layer
```

---

# API Layer

Purpose:

Expose REST endpoints.

Responsibilities:

* Receive requests
* Validate inputs
* Invoke services
* Return responses

Example Endpoints:

```text
/api/rfq
/api/quote
/api/dashboard
```

---

# RFQ Service

Purpose:

Manage freight inquiries.

Responsibilities:

* Create RFQs
* Retrieve RFQs
* Update RFQ status
* Delete RFQs
* Trigger extraction workflow

Endpoints:

```text
POST /api/rfq/process
GET /api/rfq
GET /api/rfq/{id}
PATCH /api/rfq/{id}/complete
DELETE /api/rfq/{id}
```

---

# Extraction Engine

Purpose:

Convert raw email text into structured shipment information.

Input:

```text
Customer email
```

Example:

```text
Need rates for 2 x 40FT containers from Ahmedabad to Hamburg.
```

Output:

```json
{
  "origin": "Ahmedabad",
  "destination": "Hamburg",
  "container_type": "40FT",
  "quantity": 2
}
```

Responsibilities:

* Entity extraction
* Field mapping
* Confidence scoring

---

# Validation Engine

Purpose:

Ensure quotation readiness.

Validation Rules:

* Origin present
* Destination present
* Cargo type present
* Container type present
* Quantity valid
* Weight valid

Output:

```json
{
  "origin":"ok",
  "destination":"ok",
  "weight":"missing"
}
```

Used by frontend validation panels.

---

# Quote Service

Purpose:

Generate freight quotations.

Endpoint:

```text
POST /api/quote/generate
```

Input:

```json
{
  "rfq_id":"RFQ-1"
}
```

Responsibilities:

* Load RFQ
* Calculate pricing
* Create quote record
* Return quotation

---

# Pricing Engine

Purpose:

Calculate freight costs.

Pricing Formula:

```text
Total Price

=
Base Freight
+ Documentation
+ Fuel Surcharge
+ Handling
+ Margin
```

Example:

```text
4400
+300
+160
+200

= 5060 USD
```

Current implementation uses predefined business rules.

Future implementation could integrate:

* Live carrier APIs
* Freight indexes
* Dynamic market rates

---

# AI Explanation Service

Endpoint:

```text
POST /api/quote/explanation
```

Purpose:

Explain quote generation logic.

Returns:

```json
{
  "charge":"Fuel",
  "amount":160,
  "reason":"Current fuel surcharge policy applied."
}
```

Displayed in:

```text
QuoteExplanationDialog
```

---

# Dashboard Service

Endpoint:

```text
GET /api/dashboard/stats
```

Purpose:

Aggregate business metrics.

Provides:

* RFQs today
* Quotes generated
* Pending reviews
* Revenue

Used by:

```text
Dashboard.jsx
```

---

# Quote History Service

Endpoint:

```text
GET /api/quote/history
```

Purpose:

Audit previously generated quotations.

Returns:

```json
{
  "quote_id":"Q-1",
  "customer":"ABC Exports",
  "amount":5060
}
```

Used by:

```text
QuoteHistory.jsx
```

---

# Database Architecture

MySQL stores all persistent records.

Primary Entities:

## RFQ

```text
rfq_id
customer
email
email_body
status
created_at
```

---

## Extraction Data

```text
origin
destination
cargo_type
container_type
weight
quantity
ready_date
```

---

## Quote

```text
quote_id
rfq_id
amount
currency
created_at
```

---

# Complete RFQ Processing Flow

Step 1

Customer submits email.

↓

Step 2

POST /api/rfq/process

↓

Step 3

Extraction Engine parses email.

↓

Step 4

Validation Engine evaluates completeness.

↓

Step 5

RFQ saved in database.

↓

Step 6

RFQ displayed in Inbox.

↓

Step 7

User reviews extracted values.

↓

Step 8

POST /api/quote/generate

↓

Step 9

Pricing Engine calculates quote.

↓

Step 10

Quote saved.

↓

Step 11

Quote displayed in Quote Dialog.

↓

Step 12

POST /api/quote/explanation

↓

Step 13

AI Explanation Dialog displays reasoning.

---

# Scalability Considerations

Future improvements:

* JWT Authentication
* Role Based Access Control
* Multi-Tenant Support
* Redis Caching
* Celery Background Workers
* Real Email Integration
* Carrier API Integration
* Live Freight Index Synchronization
* Kubernetes Deployment
* CI/CD Pipeline

---

# Architecture Summary

The solution follows a modular full-stack architecture where React provides the user interface, FastAPI exposes REST services, business services perform extraction and pricing operations, and MySQL persists RFQs and quotes. The architecture was intentionally designed to mirror the core operational workflow of the original Wisor AI platform while remaining simple enough for rapid development and demonstration purposes.
