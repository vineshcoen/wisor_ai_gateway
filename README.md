# Wisor AI Clone

An AI-powered freight quotation platform that automates the workflow from customer freight inquiry emails to validated shipment extraction, intelligent pricing, and quote generation.

## Overview

Wisor AI is designed for freight forwarders who receive shipment quotation requests via email. Instead of manually reading emails, extracting shipment details, validating requirements, and creating quotes, the platform automates the entire process using AI-assisted extraction and pricing workflows.

The system processes incoming freight inquiries, extracts structured shipment data, validates missing or incomplete information, generates freight quotations, and provides AI-generated pricing explanations.

---

## Core Features

### RFQ Processing

* Create RFQs from customer freight inquiry emails
* Store customer and shipment information
* Manage RFQ lifecycle and status tracking

### AI Shipment Extraction

* Extract shipment details from unstructured emails
* Identify:

  * Origin
  * Destination
  * Cargo Type
  * Container Type
  * Quantity
  * Weight
  * Ready Date

### Validation Engine

* Detect missing shipment information
* Highlight incomplete fields
* Generate validation warnings and errors
* Provide confidence scores for extracted values

### Quote Generation

* Generate freight quotations automatically
* Apply predefined pricing rules and rate tables
* Calculate freight costs and surcharges
* Produce quote summaries instantly

### AI Pricing Explanation

* Explain how pricing was calculated
* Display line-item breakdowns
* Show confidence metrics
* Present risk indicators and reasoning

### Dashboard Analytics

* RFQs created today
* Quotes generated
* Pending reviews
* Revenue tracking
* Recent RFQ activity

### Quote History

* Track generated quotations
* View historical quote records
* Review pricing outcomes

---

## System Architecture

Customer Email
↓
RFQ Creation
↓
AI Extraction Engine
↓
Validation Engine
↓
Pricing Engine
↓
Quote Generation
↓
Pricing Explanation
↓
Quote History & Analytics

---

## Technology Stack

### Frontend

* React
* Vite
* Material UI (MUI)
* React Router
* Axios

### Backend

* FastAPI
* Python

### Database

* MySQL

### AI Layer

* LLM-based extraction workflow
* Structured JSON extraction
* Confidence scoring
* Validation pipeline

---

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── rfq/
│   │   └── quotes/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── theme/
│
backend/
├── app/
├── scripts/
└── requirements.txt
```

---

## API Endpoints

### Dashboard

```http
GET /api/dashboard/stats
```

### RFQ Management

```http
GET    /api/rfq
GET    /api/rfq/{id}
POST   /api/rfq/process
PATCH  /api/rfq/{id}/complete
DELETE /api/rfq/{id}
```

### Quote Management

```http
POST /api/quote/generate
POST /api/quote/explanation
GET  /api/quote/history
```

---

## Running the Application

### Backend

```bash
cd Gateway

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Assignment Scope

### Implemented

* RFQ creation workflow
* AI extraction interface
* Validation engine
* Confidence scoring
* Quote generation
* Pricing explanation dialogs
* Dashboard analytics
* Quote history
* Responsive SaaS UI

### Future Enhancements

* Email inbox integration
* CRM integration
* TMS integration
* User authentication
* Role-based access control
* Dynamic carrier rate ingestion
* Multi-tenant architecture
* Production monitoring and observability

---

## Author

Vinesh Thakkar

AI Engineer Assignment Submission

Reverse Engineering and Rebuilding Wisor AI – Freight Quotation Platform
