# INKLOOM AI
## Intelligent Brand Governance Platform

> **"Create confidently. Stay consistent. Protect your brand."**

[![Node.js](https://img.shields.io/badge/Node.js-v24+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.14+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-indigo.svg)](https://ai.google.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-brightgreen.svg)](https://www.mongodb.com/)

---

## 1. Project Introduction

**Inkloom AI** is a full-stack, enterprise-grade Brand Governance and Consistency SaaS platform. In modern distributed organizations, content is produced rapidly across dozens of employees, decentralized agencies, marketing departments, and autonomous generative AI tools. Without centralized real-time governance, this leads to:

- Inconsistent or contradictory tone of voice.
- Outdated, unverified, or legally hazardous product claims.
- Non-compliant terminology and forbidden phrases.
- Off-brand visual and editorial styles.
- Bottlenecks in manual human review queues.

Inkloom AI systematically audits submitted content against an organization's approved brand guidelines, verified fact sheets, prohibited claims, and vocabulary standards. It produces **explainable AI diagnostics** with one-click contextual suggestions while ensuring that **authorized human reviewers retain the sole authority to certify content for publication**.

---

## 2. Key Features

### 🛡️ AI Content Consistency Engine (Core Feature)
- Scans drafts across 5 governance dimensions: **Tone of Voice**, **Terminology Compliance**, **Factual Claims**, **Brand Messaging**, and **Visual Consistency**.
- Calculates an instant **Brand Consistency Score (0–100)** with circular gauge visualizations.
- Flags each issue with exact offending snippets, severity levels (`Critical`, `Warning`, `Suggestion`), cited brand guidelines, and source references.

### 🔍 Zero-Hallucination Factual Verification
- Claims are strictly cross-referenced with the brand's **Approved Factual Repository**.
- Unsubstantiated claims are never assumed or invented by the AI; they are explicitly flagged as `"Requires Human Verification"`.

### ⚡ Contextual AI Suggestion Engine
- Context-aware revisions that preserve the original marketing intent and voice while correcting infractions.
- **Side-by-Side Comparison**: Real-time diff between Original Submitted Content and AI-Improved Compliant Text.
- One-click actions: **Apply Suggestion**, **Dismiss**, **Edit Manually**, or **Regenerate**.

### 👥 Certified Human Approval Workflow (Human-in-the-Loop)
- Formal governance pipeline: `Draft` ➔ `Under Review` ➔ `Changes Requested` ➔ `Approved` / `Rejected`.
- Role-based sign-off with audit logging: timestamped notes and reviewer identity recorded.
- **Safeguard Guarantee**: The AI engine never autonomously marks content as officially published.

### 📚 Brand Profile & Guideline Management
- Create and manage multi-brand profiles with custom tone descriptors, formality, dos & don'ts, target audience, preferred terminology, and restricted words.
- Native ingestion of **PDF**, **DOCX**, and **TXT** guideline documents with automated text extraction.

### 📊 Governance Analytics Dashboard
- Track organization-wide consistency scores over time with interactive Recharts visualizations.
- Violation breakdown by category and leaderboard of most frequently violated brand guidelines.

---

## 3. Technology Architecture

```
inkloom-ai/
│
├── frontend/                 # React 18 + Vite + Tailwind CSS + Recharts + Lucide
│   ├── src/
│   │   ├── components/       # Reusable UI cards, gauges, navigation, modals
│   │   ├── context/          # AuthContext & BrandContext state providers
│   │   ├── layouts/          # PublicLayout and Authenticated DashboardLayout
│   │   ├── pages/            # LandingPage, Auth, Dashboard, Brands, Review, Approvals, History, Analytics, Settings
│   │   └── services/         # Axios API client and Firebase Auth integration
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js + Express.js REST API
│   ├── config/               # MongoDB connection with resilient fallback
│   ├── controllers/          # Brand, Review, Approval, Analytics, User controllers
│   ├── middleware/           # Auth (JWT & Firebase), file upload (Multer), error handler
│   ├── models/               # Mongoose schemas: User, BrandProfile, ContentReview, Approval
│   ├── routes/               # Modular Express REST endpoints
│   ├── utils/                # Realistic database seed utility
│   ├── server.js             # Main server entry point
│   └── package.json
│
├── ai-service/               # Python 3 + FastAPI AI Microservice
│   ├── app/
│   │   ├── routes/           # /api/ai/analyze, /api/ai/suggest, /api/ai/extract-text
│   │   ├── schemas/          # Pydantic data validation models
│   │   ├── services/         # Gemini 2.5 Flash client, PyPDF / DOCX document extractor, local rule engine
│   │   └── main.py           # FastAPI ASGI entry point
│   ├── requirements.txt
│   └── .env
│
├── docs/                     # System architecture and sequence diagrams
│   └── architecture.md
│
├── .gitignore
└── README.md
```

---

## 4. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/inkloom
AI_SERVICE_URL=http://127.0.0.1:8000
JWT_SECRET=your-secure-jwt-secret-key-2026
NODE_ENV=development
```

### AI Service (`ai-service/.env`)
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=8000
ENVIRONMENT=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 5. Local Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **MongoDB** (Running locally or MongoDB Atlas connection string)

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/inkloom-ai.git
cd inkloom
```

### Step 2: Set Up Backend
```bash
cd backend
npm install
node utils/seed.js   # Seeds database with realistic brand profiles and reviews
npm run dev          # Starts Express API on port 5000
```

### Step 3: Set Up AI Microservice
```bash
cd ../ai-service
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Step 4: Set Up Frontend
```bash
cd ../frontend
npm install
npm run dev          # Starts Vite React dev server on port 3000
```

Open your browser at **`http://localhost:3000`**.

---

## 6. One-Click Hackathon Demo Mode

To allow instant evaluation without requiring external credentials:
1. **One-Click Demo Login**: On the `/login` screen, click **"Compliance Lead"** or **"Brand Creator"** to bypass setup and explore the workspace immediately.
2. **Pre-Seeded Brands**: Includes complete profiles:
   - **AuraHealth Systems** (Healthcare & Life Sciences)
   - **FinPulse Core** (FinTech & Banking)
3. **Resilient Local Governance Engine**: If a Gemini API key is not yet configured, the system executes a deterministic local compliance engine labeled clearly as `[Inkloom Rule Engine]`, ensuring zero crashes.

---

## 7. REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/auth/demo-login` | Fast one-click demo login |
| `GET` | `/api/brands` | List all brand profiles |
| `POST` | `/api/brands` | Create new brand profile |
| `POST` | `/api/brands/:id/guidelines` | Upload PDF/DOCX and index extracted text |
| `GET` | `/api/reviews` | List previous content reviews with filters |
| `POST` | `/api/reviews` | Submit content for AI consistency review |
| `PATCH`| `/api/reviews/:id/findings/:findingId` | Apply, dismiss, or edit finding |
| `POST` | `/api/approvals` | Submit human approval decision (Approve, Reject, Request Changes) |
| `GET` | `/api/analytics/overview` | Fetch aggregate governance KPIs & violation metrics |
| `GET` | `/api/ai/status` | Check health and connectivity of Gemini AI service |

---

## 8. Privacy, Security & Compliance
- **Workspace Isolation**: Brand guidelines, prohibited claims, and drafts are isolated to their respective organizations.
- **Zero Hallucination Mandate**: Unsupported claims are explicitly routed to human verification.
- **Audit Logging**: Every approval, revision, and rejection records reviewer name and timestamp.
- **No Secret Exposure**: All keys and credentials reside strictly in server-side environment variables.

---

## 9. License & Team
Developed for Hackathon 2026. Built with ❤️ by the Inkloom AI Team.
Licensed under the [MIT License](LICENSE).
