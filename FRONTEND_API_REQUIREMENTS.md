# Frontend API Requirements

## Purpose

This document defines the backend contract expected by the current frontend. The frontend is designed to support a FastAPI backend and hybrid localStorage demo mode, but the real application should move to API-backed data flows once the backend is ready.

## Base configuration

Environment variable:
- `VITE_API_BASE_URL`

Expected behavior:
- Base API should be configurable by environment
- All backend calls should use a single client pattern
- Requests should include auth headers when sessions are available
- Errors should be normalized for UI messaging and retry handling

Current frontend pattern:
- `src/lib/api/config.ts` defines `API_BASE_URL` and `apiV1()`

## Authentication endpoints

### POST /api/v1/auth/login
Request:
```json
{
  "email": "user@company.com",
  "password": "secret"
}
```

Response:
```json
{
  "token": "jwt-or-session-token",
  "user": {
    "id": "user-123",
    "email": "user@company.com",
    "display_name": "Expert User",
    "role": "expert"
  }
}
```

Required frontend behavior:
- Store token securely
- Persist user identity for the authenticated session
- Handle invalid credentials and network errors consistently

### POST /api/v1/auth/logout
Optional but recommended

### GET /api/v1/auth/me
Returns the authenticated current user, used for route/session validation

## Customers

### GET /api/v1/customers
Response:
```json
[
  {
    "id": "c-1",
    "name": "Contoso Procurement",
    "customerType": "Company",
    "industry": "Information Technology",
    "department": "Procurement",
    "description": "Customer description",
    "contacts": [
      {
        "id": "c-1-contact-1",
        "name": "Jordan Clark",
        "email": "jordan@contoso.com",
        "role": "Procurement lead",
        "contactPreferences": "Email; Tue/Thu afternoons"
      }
    ],
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### POST /api/v1/customers
Body should match the same shape as the frontend form model

### PUT /api/v1/customers/:id
For editing customer data

### DELETE /api/v1/customers/:id

## Engagements

### GET /api/v1/engagements
Response should include the engagement model used by `src/types/engagement.ts`

Required shape:
```json
{
  "id": "eng-1",
  "title": "Remote team project management tooling",
  "customerId": "c-1",
  "problemStatement": "We need a platform ...",
  "objectives": "Reduce tool sprawl and improve visibility",
  "constraints": "Must integrate with current identity provider",
  "successMetrics": "30% adoption in 90 days",
  "stakeholders": "Procurement, Security, IT",
  "status": "scoping",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### POST /api/v1/engagements
Create new engagement

### GET /api/v1/engagements/:id
Fetch one engagement

### PUT /api/v1/engagements/:id
Update engagement

## Supplier research

### POST /api/v1/engagements/:id/research
Request:
```json
{
  "brief": "Optional detailed research brief",
  "options": {}
}
```

Response:
```json
{
  "job_id": "research-abc123"
}
```

### GET /api/v1/research/:job_id/stream
Expected stream format:
- SSE / EventSource-compatible stream
- Frequent status/job updates with phase, progress, and error state

Example payload:
```json
{
  "jobId": "research-abc123",
  "engagementId": "eng-1",
  "status": "running",
  "currentPhase": "discover",
  "progressPercent": 42,
  "phases": [
    { "id": "plan", "status": "done" },
    { "id": "discover", "status": "active" }
  ]
}
```

Required frontend behavior:
- Update phase progress in real time
- Show success/failure state without blank screens
- Persist job snapshot locally until completion
- Use mock fallback only when API is unreachable

## Findings and evidence

### GET /api/v1/engagements/:id/findings
Response:
```json
[
  {
    "id": "finding-1",
    "engagementId": "eng-1",
    "name": "Notion",
    "summary": "Flexible workspace combining docs and tasks",
    "pricing": "Free tier; Plus ~$10/user/mo",
    "features": "Wiki, database, templates, AI assistant",
    "pros": "Highly flexible; good for documentation",
    "cons": "Learning curve for advanced setups",
    "depthScore": 0.86,
    "confidence": 0.82,
    "validationStatus": "supported",
    "sourceIds": ["src-1"]
  }
]
```

### GET /api/v1/engagements/:id/sources
Return research sources and citations

### GET /api/v1/engagements/:id/comparison
Return weighted criteria and score matrix

## Recommendations

### GET /api/v1/engagements/:id/recommendations
### POST /api/v1/engagements/:id/recommendations
### PUT /api/v1/engagements/:id/recommendations/:id

Recommended model:
```json
{
  "engagementId": "eng-1",
  "version": 1,
  "summary": "Recommended based on weighted fit and evidence quality",
  "rationale": "Blended recommendation logic",
  "status": "draft",
  "options": [
    {
      "id": "opt-1",
      "engagementId": "eng-1",
      "name": "Notion",
      "description": "Best fit for documentation and flexibility",
      "estimatedCost": "$1200 / year",
      "feasibility": "high",
      "riskLevel": "low",
      "pros": ["Flexible", "Strong docs"],
      "cons": ["Learning curve"],
      "scoreExplanation": "Weighted fit + evidence score",
      "recommended": true
    }
  ],
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

## Roadmap

### GET /api/v1/engagements/:id/roadmap
### POST /api/v1/engagements/:id/roadmap/generate
Returns timeline items and milestone metadata

## Customer review

### GET /api/v1/engagements/:id/review
### POST /api/v1/engagements/:id/review
Request:
```json
{
  "decision": "approved",
  "customerComment": "Looks good; proceed with pilot."
}
```

## Procurement / ProcureIQ

### POST /api/v1/procureiq/rfq
### GET /api/v1/procureiq/vendors
### GET /api/v1/procureiq/compare

This area should remain modular and solution-specific, matching the current app structure.

## Non-functional requirements

- All responses should be typed and validated on the frontend
- Handle 401/403/500/timeout responses consistently
- Use retries for slow requests where appropriate
- Keep UI states explicit: idle, loading, error, success, empty
- Do not pretend backend operations succeed before confirmation
- Keep local mock storage clearly identified as temporary demo-only data

## Missing endpoints to define with backend team

1. Auth/session refresh
2. Team member management
3. Knowledge hub documents
4. Activity stream/feed
5. Real-time research updates and error payload schema
6. Review/approval audit trail
7. Solution-specific procurement workflow endpoints

## Final API readiness status

The frontend is architecturally ready for backend integration, but the backend contract is still only partially defined. The most important work now is to align on authentication, research streaming, and engagement lifecycle APIs.
