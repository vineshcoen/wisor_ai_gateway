# Wisor AI Platform Deconstruction

## Objective

The purpose of this project was not simply to build a freight quotation application, but to reverse engineer the core workflow of the Wisor AI platform and reproduce its most important business capabilities.

Before implementation, the original Wisor platform was analyzed from a product, user experience, and business workflow perspective.

This document explains that analysis and the decisions made while rebuilding the system.

---

# 1. Understanding the Business Problem

## Traditional Freight Quotation Workflow

A freight forwarding company receives dozens or hundreds of shipment inquiries every day.

Most inquiries arrive via email and contain unstructured text such as:

"Need rates for 2 x 40FT containers from Ahmedabad to Hamburg carrying textile garments."

Operations teams must manually:

1. Read the email
2. Extract shipment information
3. Validate missing fields
4. Contact customer if information is incomplete
5. Check carrier pricing
6. Calculate costs
7. Apply company margins
8. Generate quotation
9. Send quote back to customer

This process is repetitive, slow, and error-prone.

---

# 2. What Wisor AI Solves

Wisor AI automates the middle section of the workflow.

Instead of humans extracting shipment information manually, AI performs:

* Data extraction
* Validation
* Confidence scoring
* Quote generation
* Pricing explanation

This significantly reduces operational workload.

---

# 3. Core Workflow Breakdown

The original Wisor platform can be simplified into five major stages.

## Stage 1: RFQ Intake

Customer sends email.

Example:

"Please provide rates for two 40FT containers from Ahmedabad to Hamburg carrying textile cargo."

System receives the email and creates an RFQ.

RFQ = Request For Quotation.

Output:

```json
{
  "rfq_id": "RFQ-1",
  "customer": "ABC Exports",
  "email_body": "..."
}
```

---

## Stage 2: AI Extraction

The AI model reads the email and extracts structured shipment information.

Example:

```json
{
  "origin": "Ahmedabad",
  "destination": "Hamburg",
  "cargo_type": "Textile Garments",
  "container_type": "40FT",
  "quantity": 2,
  "weight": 20500
}
```

This converts unstructured language into structured business data.

---

## Stage 3: Validation Engine

Not every email contains complete information.

Example:

"Need rates to Germany."

Missing:

* Origin
* Weight
* Container Type

Validation engine identifies gaps.

Example:

```json
{
  "origin": "missing",
  "weight": "missing",
  "container_type": "missing"
}
```

This prevents invalid quotes from being generated.

---

## Stage 4: Pricing Engine

Once sufficient shipment information exists, pricing can be calculated.

Pricing engine combines:

* Base Freight
* Fuel Surcharge
* Documentation Charges
* Handling Charges
* Margin Rules

Example:

```json
{
  "base_freight": 4400,
  "documentation": 300,
  "fuel": 160,
  "handling": 200,
  "total": 5060
}
```

---

## Stage 5: Explainable AI

One major differentiator of Wisor AI is transparency.

Instead of showing only a final number:

"$5,060"

The platform explains:

* Why the amount exists
* Which factors affected pricing
* Which route assumptions were used
* Which surcharges were applied

This increases user trust.

---

# 4. Features Rebuilt In This Project

The following features were implemented.

## Dashboard

Purpose:

Provide operational visibility.

Metrics:

* RFQs Today
* Quotes Generated
* Pending Reviews
* Revenue

---

## RFQ Inbox

Purpose:

Central review screen for incoming inquiries.

Capabilities:

* View RFQ list
* Review customer email
* Inspect extracted fields
* Analyze confidence scores
* Validate missing information

---

## RFQ Creation

Purpose:

Simulate incoming freight emails.

Capabilities:

* Enter customer details
* Paste freight inquiry email
* Trigger extraction workflow

---

## Quote Generation

Purpose:

Generate freight pricing.

Capabilities:

* Calculate shipment cost
* Show itemized charges
* Display shipment details

---

## AI Pricing Explanation

Purpose:

Provide explainability.

Capabilities:

* Pricing breakdown
* Risk indicators
* Confidence scoring
* Reasoning for each charge

---

## Quote History

Purpose:

Audit and historical tracking.

Capabilities:

* View previously generated quotes
* Review customer information
* Analyze historical pricing

---

## Pricing Admin

Purpose:

Business rule management.

Capabilities:

* Margin controls
* Auto-approval thresholds
* Buffer percentages
* AI auto-quoting settings

---

# 5. Technical Design Decisions

## Frontend

Chosen Technology:

React + Vite + Material UI

Reasons:

* Fast development
* Modern component architecture
* Excellent dashboard UI support
* Strong routing ecosystem

---

## Backend

Chosen Technology:

FastAPI

Reasons:

* High performance
* Automatic OpenAPI documentation
* Native async support
* Excellent AI integration compatibility

---

## Database

Chosen Technology:

MySQL

Reasons:

* Relational data model
* Easy reporting
* Widely used in logistics systems

---

# 6. Simplifications Made

The original Wisor platform likely contains:

* Real carrier integrations
* Live freight indexes
* CRM integrations
* User management
* Multi-tenant architecture
* Advanced AI pipelines

These were intentionally simplified for assignment scope.

The focus was on demonstrating:

* Product understanding
* Workflow reconstruction
* API architecture
* Frontend implementation
* Business logic modeling

---

# 7. Key Learning

The most important insight from this project is that AI is not replacing freight forwarding expertise.

Instead, AI acts as an operational copilot that:

* Reads emails
* Extracts information
* Identifies missing fields
* Generates pricing recommendations
* Explains pricing decisions

This allows freight professionals to focus on customer service and decision-making rather than repetitive data processing.

---

# Conclusion

This project successfully recreates the core operational workflow of Wisor AI by transforming freight inquiry emails into structured RFQs, validating shipment information, generating freight quotations, and providing explainable AI-driven pricing decisions through a modern full-stack architecture.
