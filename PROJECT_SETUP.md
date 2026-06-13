# PROJECT_SETUP.md

# Wisor AI Freight Quotation Platform

## Prerequisites

Please ensure the following software is installed:

### Backend

* Python 3.11+
* pip

### Frontend

* Node.js 18+
* npm

---

# Project Structure

```text
Wisor_AI/
├── backend/
├── frontend/
├── README.md
├── ARCHITECTURE.md
├── API_REFERENCE.md
├── DECONSTRUCTION.md
└── PROJECT_SETUP.md
```

---

# Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

### macOS / Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

Backend will start at:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

---

# Frontend Setup

Open a new terminal.

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend will start at:

```text
http://localhost:5173
```

---

# Build Verification

Frontend production build:

```bash
cd frontend
npm run build
```

Backend verification:

```bash
http://localhost:8000/docs
```

Verify all API endpoints are visible and responding.

---

# Application Workflow

1. Open Frontend (http://localhost:5173)
2. Navigate to RFQ Inbox
3. Create a new RFQ using "Create RFQ"
4. Paste customer freight inquiry email
5. Submit RFQ for AI extraction
6. Review extracted shipment details
7. Generate Quote
8. Review AI pricing explanation
9. View Quote History

---

# Notes

* This implementation uses mock AI extraction and pricing logic for demonstration purposes.
* Freight rates are currently generated using rule-based calculations and sample tariff logic.
* The system architecture is designed so external AI services, carrier APIs, and pricing engines can be integrated later without frontend changes.
* `node_modules` and `venv` folders have been intentionally excluded from the submission package.

Submission Notes

Thank you for reviewing my solution.

The project contains:

Backend API (FastAPI)
Frontend Application (React + Material UI)
Architecture Documentation
API Reference Documentation
System Deconstruction
Setup Instructions

To run the application, please follow the steps in PROJECT_SETUP.md.

Expected startup order:

Start Backend
Verify Swagger UI at http://localhost:8000/docs
Start Frontend
Open http://localhost:5173

Author: Vinesh Thakkar

```
```
