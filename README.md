# Expert Intelligence Assistant (EIA)

Expert Intelligence Assistant is an expert-led research and decision-support workspace. It helps teams turn a customer or business challenge into a structured engagement, collect and organize evidence, compare options, and prepare recommendations for human review.

The project also includes **ProcureIQ**, a procurement-focused module that applies the same engagement, research, evidence, and approval concepts to purchasing decisions. It is designed to help an expert clarify a purchase need, compare suppliers transparently, and prepare RFQs and purchase-order records without falsely claiming that an external action has taken place.

> **In simple terms:** EIA helps people make better business decisions using organized research and traceable evidence. ProcureIQ applies that idea to buying products and services.

## Project idea

Organizations often make important decisions using scattered documents, web searches, spreadsheets, and informal conversations. That makes it hard to understand what is known, where a claim came from, what information is missing, and who approved the final recommendation.

EIA brings that work into one guided process:

1. Record a customer and create an engagement around a business need.
2. Define the scope, objectives, constraints, and questions that need research.
3. Organize research jobs and findings, including their source references.
4. Compare available options and prepare recommendations and a roadmap.
5. Let an expert review the work before it is presented as a final recommendation.

For procurement, the same process can capture a purchase request, record vendors and research, compare vendors using configurable weights, and manage RFQ, approval, and purchase-order records. Missing evidence should remain visible as missing; it should not automatically be treated as a confirmed negative.

### Roman Urdu summary

EIA aik aisa workspace hai jo business problems ko structured research aur evidence ke zariye samajhne aur un par behtar decisions lene mein madad karta hai. Expert customer engagement banata hai, requirements aur research questions define karta hai, findings aur sources organize karta hai, phir options compare karke recommendation tayyar karta hai. Final decision aur customer ko share karna expert review ke baad hota hai.

ProcureIQ isi idea ko purchasing ke liye use karta hai: purchase request, vendor research, transparent scoring, RFQ drafts, approvals, aur purchase-order tracking. Baghair real integration ke system yeh claim nahi karta ke RFQ bhej di gayi ya order place ho gaya.

## Product principles

- **Human-in-the-loop:** AI can assist research and drafting, but experts remain responsible for review and decisions.
- **Evidence-first:** Findings should retain their source references so reviewers can trace claims.
- **Transparent evaluation:** Comparison weights and criterion scores should be visible and explainable.
- **Honest uncertainty:** Estimated, verified, and unavailable information should be distinguishable.
- **No fabricated actions:** Creating an RFQ or purchase-order record is not the same as sending an RFQ or placing a real order.
- **Shared EIA foundation:** ProcureIQ reuses customers, engagements, research, and review concepts rather than creating a separate duplicate product.

## Current project status

This repository contains a working React frontend and a FastAPI backend foundation. The frontend is primarily a demo-mode experience that stores much of its workspace data in browser storage. The backend has authenticated API foundations and procurement data models/endpoints, but it is not yet a production-connected research or procurement system.

In particular:

- The frontend's sign-in is a **local demo session**; it does not currently call the backend login endpoint.
- Several frontend workflows use local/demo data rather than loading and saving through the API.
- The ProcureIQ frontend route is currently a workflow overview/entry point, not yet a full procurement console connected to these APIs.
- The backend currently creates tables with SQLAlchemy `create_all`; Alembic is listed as a dependency, but production migration files/workflow are not yet established.
- LLM configuration exists, but the current service has a mock implementation and does not yet call a verified external provider.
- Procurement discovery records can be stored, but a real vendor discovery worker or CHRONICLE integration is not configured.
- The procurement comparison endpoint currently uses illustrative criterion values; do not treat these as researched vendor scores.
- RFQs are records/drafts. There is no verified vendor delivery integration, and the API does not send them externally.
- Purchase orders are manually maintained records. There is no external purchasing integration.
- Report surfaces include illustrative/static values and should not be used as audited financial or supplier-performance reporting.

Treat this as a demo/prototype foundation until authentication, data isolation, migrations, integrations, and production security have been completed and reviewed.

## Features

### Frontend

- React 19, TypeScript, and Vite application.
- Protected application shell with dashboard and sidebar navigation.
- Customer and engagement screens.
- Engagement workspace sections for overview, research, findings, recommendations, roadmap, and customer review.
- Solutions hub with specialized solution routes, including ProcureIQ.
- Knowledge Hub.
- Responsive dashboard and charts.
- Form validation using React Hook Form and Zod.
- Local demo sign-in and browser-storage-backed demo flows.

### Backend

- FastAPI application with versioned API routing and health endpoints.
- SQLAlchemy models for users, workspaces, customers, engagements, research jobs, findings, recommendations, and procurement records.
- JWT authentication foundations.
- SQLite configuration for local development, with PostgreSQL driver support in dependencies.
- Procurement APIs for requests, vendors, discovery records, comparisons, RFQs, approvals, purchase orders, dashboard summary, and early report surfaces.
- Deterministic weighted vendor-score calculation helper. Missing criteria are excluded from the score denominator instead of being treated as zero.

## Technology stack

| Area | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router |
| UI and forms | Tailwind CSS v4, project CSS, Radix UI primitives, React Hook Form, Zod |
| Charts | Recharts |
| Backend | Python, FastAPI, Pydantic |
| Persistence | SQLAlchemy; SQLite by default; PostgreSQL driver included |
| Authentication | JWT utilities and password hashing foundations |
| Optional infrastructure | Redis service in Docker Compose; not yet wired to an asynchronous research worker |

## Repository layout

```text
.
├── backend/
│   ├── app/
│   │   ├── api/v1/           # API router, dependencies, and endpoints
│   │   ├── core/             # Settings and security helpers
│   │   ├── db/               # SQLAlchemy engine/session
│   │   ├── services/         # Research, LLM, and procurement scoring helpers
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   └── main.py           # FastAPI application
│   ├── tests/                # Backend tests
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
├── docs/                     # Product acceptance, QA, and AI/LLM notes
├── src/
│   ├── app/                  # App shell, routing, and navigation
│   ├── components/           # Shared UI components
│   ├── features/             # Dashboard, engagements, research, ProcureIQ, etc.
│   └── lib/                  # Storage, validation, and app utilities
├── .env.example
└── package.json
```

## Prerequisites

- Node.js and npm compatible with the versions in the repository lockfile.
- Python 3.10 or later (Python 3.13 is used by the backend Dockerfile).
- Git (optional, for cloning and version control).

## Run the frontend

From the repository root in PowerShell:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

The sign-in screen is currently a demo flow: enter a valid-looking email and a password that satisfies the form validation. The app stores a local session in the browser; this does not create or authenticate a backend user.

Useful frontend commands:

```powershell
npm run build   # TypeScript project build and Vite production build
npm run lint    # Oxlint
npm run preview # Serve the production build locally
```

## Run the backend

From the repository root in PowerShell:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --reload
```

The API is normally available at `http://localhost:8000`. Interactive API documentation is at `http://localhost:8000/docs`; the OpenAPI schema is at `http://localhost:8000/openapi.json`.

The backend defaults to SQLite and creates database tables on application startup.

### Backend tests

From the repository root:

```powershell
.\.venv\Scripts\python.exe -m pytest backend\tests -q
```

## Run with Docker Compose

The Compose file is under `backend`. From PowerShell:

```powershell
Set-Location backend
docker compose up --build
```

It starts the API and Redis containers. Redis is infrastructure scaffolding; an asynchronous procurement/research queue is not currently connected to it.

## Environment configuration

Use `.env.example` as a reference and create an appropriate local `.env` file for the backend. Do not commit credentials or production secrets.

Common backend settings include:

| Variable | Purpose | Current default/notes |
|---|---|---|
| `APP_NAME` | API display name | Expert Intelligence Assistant API |
| `APP_ENV` | Environment label | `development` |
| `DEBUG` | FastAPI debug mode | `false` |
| `API_PREFIX` | Versioned API prefix | `/api/v1` |
| `DATABASE_URL` | SQLAlchemy database URL | `sqlite:///./eia.db` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated browser origins | Local Vite origins |
| `JWT_SECRET_KEY` | JWT signing secret | Replace before deployment |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT lifetime | 1440 minutes |
| `LLM_PROVIDER` | LLM provider selection | `mock` |
| `LLM_BASE_URL` | Optional provider endpoint | Not called by current mock service |
| `LLM_API_KEY` | Optional provider credential | Keep server-side only |
| `LLM_MODEL` | Optional model identifier | `gpt-4o-mini` |
| `VULTR_INFERENCE_URL` | Optional Vultr inference URL | Integration not verified/configured |
| `VULTR_INFERENCE_API_KEY` | Optional Vultr credential | Keep server-side only |
| `VULTR_INFERENCE_MODEL` | Optional Vultr model identifier | Integration not verified/configured |

Frontend environment variables can be provided through a Vite environment file such as `.env.local`. `VITE_API_BASE_URL` is the intended API base URL setting, but the current frontend demo flows are not fully wired to the backend.

## API overview

The versioned API uses the `/api/v1` prefix. Health checks are available at:

- `GET /health`
- `GET /api/v1/health`

### Core API groups

The router includes authentication, customers, engagements, research, recommendations, roadmaps, and procurement endpoint groups. Authentication-protected endpoints expect a bearer JWT:

```http
Authorization: Bearer <access_token>
```

Authentication foundations:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

The current registration endpoint is a basic foundation; workspace provisioning and comprehensive access-control rules still need production design.

### ProcureIQ API

The procurement router is available under both `/api/v1/procureiq` and the earlier `/api/v1/procurement` prefix for the overlapping routes.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/v1/procureiq/dashboard/summary` | Procurement summary counts and spend estimate |
| `GET` | `/api/v1/procureiq/dashboard/recent-activity` | Recent activity records |
| `POST` | `/api/v1/procureiq/requests` | Create a purchase request (may include request items) |
| `GET` | `/api/v1/procureiq/requests` | List requests with filters and pagination |
| `GET` | `/api/v1/procureiq/requests/{id}` | Retrieve a request |
| `PATCH` | `/api/v1/procureiq/requests/{id}` | Update request fields |
| `DELETE` | `/api/v1/procureiq/requests/{id}` | Delete a request |
| `POST` | `/api/v1/procureiq/vendors` | Create a vendor |
| `GET` | `/api/v1/procureiq/vendors` | List/search vendors |
| `GET` | `/api/v1/procureiq/vendors/{id}` | Retrieve a vendor |
| `PATCH` | `/api/v1/procureiq/vendors/{id}` | Update a vendor |
| `POST` | `/api/v1/procureiq/discovery` | Store a vendor research/discovery record |
| `GET` | `/api/v1/procureiq/discovery/{job_id}` | Retrieve a discovery record by research job ID |
| `GET` | `/api/v1/procureiq/discovery/{job_id}/results` | Retrieve discovery results for a job |
| `POST` | `/api/v1/procureiq/comparisons` | Create a vendor comparison |
| `GET` | `/api/v1/procureiq/comparisons` | List comparisons |
| `GET` | `/api/v1/procureiq/comparisons/{id}` | Retrieve a comparison |
| `POST` | `/api/v1/procureiq/comparisons/{id}/recalculate` | Recalculate saved scores |
| `POST` | `/api/v1/procureiq/rfqs` | Create an RFQ draft/record |
| `GET` | `/api/v1/procureiq/rfqs` | List RFQs |
| `GET` | `/api/v1/procureiq/rfqs/{id}` | Retrieve an RFQ |
| `GET` | `/api/v1/procureiq/approvals` | List approval records |
| `POST` | `/api/v1/procureiq/approvals/{id}/decision` | Record an approval decision |
| `POST` | `/api/v1/procureiq/purchase-orders` | Create a purchase-order record |
| `GET` | `/api/v1/procureiq/purchase-orders` | List purchase orders |
| `GET` | `/api/v1/procureiq/purchase-orders/{id}` | Retrieve a purchase order |
| `PATCH` | `/api/v1/procureiq/purchase-orders/{id}` | Update a purchase-order record |
| `GET` | `/api/v1/procureiq/reports/overview` | Early procurement overview report |
| `GET` | `/api/v1/procureiq/reports/spending` | Early spending report surface |
| `GET` | `/api/v1/procureiq/reports/vendors` | Early vendor report surface |

All API routes can be explored in Swagger UI at `/docs`. The route list describes the current code, not a claim that external discovery, RFQ delivery, purchase-order submission, or production analytics are operational.

## Vendor scoring

The scoring helper has these default weights:

| Criterion | Default weight |
|---|---:|
| Specification fit | 30% |
| Price | 25% |
| Delivery | 20% |
| Warranty and support | 15% |
| Evidence confidence | 10% |

Weights may be provided when creating a comparison. Scores are calculated deterministically by application code. Missing or non-numeric criteria are listed as missing and excluded from the available-weight denominator; they are not silently converted to a score of zero.

**Prototype limitation:** Current comparison creation seeds illustrative scores for vendors already in the database. Those values are not derived from supplier evidence. Integrate real research and validated evidence before relying on comparison rankings.

## Main data model concepts

- **Workspace:** tenant/workspace foundation for users and customers.
- **Customer:** the organization receiving expert support.
- **Engagement:** a scoped project attached to a customer and owner.
- **ResearchJob / Finding:** research lifecycle record and source-linked finding records.
- **Recommendation / RoadmapItem:** proposed direction and implementation steps.
- **ProcurementRequest / PurchaseRequestItem:** purchasing need, budget, schedule, and item-level requirements.
- **Vendor / VendorResearch:** supplier details and research/discovery records.
- **VendorComparison / VendorComparisonResult:** comparison settings, scores, missing information, and evidence references.
- **RFQ / Quotation:** request-for-quotation records and quotation data model foundations.
- **Approval:** decision and comments for a business record.
- **PurchaseOrder:** manually maintained purchase-order record.
- **ProcurementActivity:** activity history entries.

## Documentation

- [Product acceptance MVP](docs/product-acceptance-mvp.md) — acceptance criteria and product scope.
- [QA MVP checklist](docs/qa-mvp-checklist.md) — manual checks for demo readiness.
- [AI/LLM MVP guide](docs/ai-llm-mvp-guide.md) — AI integration notes and next steps.

## Security and production readiness

Before deploying with real customers or procurement data:

1. Replace all development JWT and application secrets with securely managed secrets.
2. Implement and test tenant/workspace isolation on every relevant query and write.
3. Enforce role-based authorization for sensitive procurement and approval operations.
4. Add and verify database migrations; do not rely on `create_all` for production schema changes.
5. Configure PostgreSQL backups, TLS, least-privilege database access, and operational monitoring.
6. Add rate limits, audit logging, request limits, and secure file/document handling as appropriate.
7. Integrate real asynchronous research workers with retries, deduplication, and job status tracking.
8. Treat third-party website content as untrusted input; never provide secrets to browser/research tasks.
9. Verify any LLM or procurement provider's API, authentication, request/response formats, and data policies before enabling it.
10. Require human approval before externally sending RFQs or submitting purchase orders.

## Roadmap

- Connect frontend authentication and feature data flows to the backend APIs.
- Complete tenant-aware authorization and role/approval policies.
- Establish Alembic migrations and production PostgreSQL configuration.
- Connect an asynchronous research workflow and a verified CHRONICLE adapter.
- Implement configurable, provider-tested LLM integrations and structured outputs.
- Replace illustrative vendor scoring inputs with evidence-backed data and explanations.
- Add quotation capture, RFQ approval lifecycle, and audited manual workflow transitions.
- Add accurate, data-derived reports and tested CSV/PDF exports where required.
- Add integration and API tests covering permissions, transactions, error cases, and workflow transitions.

## Contributing

Keep changes focused, preserve existing frontend and backend conventions, and include tests for behavior changes. Do not add real credentials, customer records, vendor research, or purchase data to source control.
