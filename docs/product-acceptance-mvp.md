# Product & QA — MVP acceptance (blueprint alignment)

This file maps **blueprint §16 MVP** and **§12 Testing** to **what “done” means** for the hackathon. Execution (running tests, staging deploy) still requires the team.

## MVP “done” criteria (§16 — must-have demo scope)

| # | Criterion | Owner | Verify |
|---|-----------|--------|--------|
| 1 | Roles concept (Admin / Expert / Customer) reflected in UX (demo: Expert path) | Product + FE | Demo script |
| 2 | Create customer | FE (+ BE when live) | Checklist §3 |
| 3 | Create engagement + structured scope fields | FE (+ BE) | Checklist §4 |
| 4 | Run supplier research + visible progress | BE + FE | SSE or demo sim |
| 5 | ≥3 options with sources + comparison | BE + FE | Findings + table/chart |
| 6 | Recommendation + roadmap | FE (+ BE) | Rec + Roadmap tabs |
| 7 | Expert review → customer review (approve / changes) | FE (+ BE) | Review tab |
| 8 | Deployed demo URL (Vultr) with FE+BE | DevOps | HTTPS smoke |

## QA layers (§12) — who runs what

| Layer | What | Blocked until |
|-------|------|----------------|
| Unit | Schemas, scoring, helpers | Backend Python + CI |
| API integration | Auth, CRUD, research, approvals | FastAPI routes |
| DB | Migrations, tenant isolation | PostgreSQL + Alembic |
| AI eval | Structured output, injections | LLM adapter + test harness |
| Frontend | Forms, routes, states, responsive | Current repo + manual pass |
| E2E | Full journey on staging | Deploy + test user |
| Security | RBAC, secrets, uploads | Backend hardening |
| Deployment | /health, TLS, backups | Vultr stack |

**Frontend-only today:** use `docs/qa-mvp-checklist.md` for manual FE regression; mark API/deploy rows **N/A** until backend exists.

## Sign-off (product)

- [ ] Demo narrative matches §3 main journey (10 steps), no fake claims (browser, RFQ) unless real integration exists.
- [ ] Judging rubric cross-checked once (track requirements from organizers).
