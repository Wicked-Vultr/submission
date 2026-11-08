# AI / LLM — MVP guide (blueprint §7)

**Scope:** Backend-owned. This doc gives **contracts and tasks** so AI/LLM work is parallelizable without duplicating logic in the browser.

## Principles (non‑negotiable)

- LLM **never** decides auth; backend enforces RBAC, approvals, tool allow-lists.
- Structured outputs **validated** (Pydantic server-side; Zod can mirror DTOs for FE).
- No API keys or secrets in the frontend bundle.

## Environment (names only)

`LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`, optional `LLM_FAST_MODEL` for classification. See blueprint §11 for full list alongside `DATABASE_URL`, `REDIS_URL`, etc.

## Suggested API tasks (map to §7 “AI capabilities”)

| Task | Input | Output schema (concept) | Notes |
|------|--------|-------------------------|--------|
| `scope_assistant` | Engagement scope fields | objectives[], constraints, success_metrics[], open_questions[] | Expert edits before research |
| `research_plan` | Approved brief | topics[], entities[], query_groups[] | Feeds supplier research workflow |
| `extract_facts` | Raw snippets + URLs | claims[], confidence, validation_status | Evidence service |
| `compare_options` | Normalized entities + criteria | matrix + weights + rationale text | Matches comparison UI |
| `recommendation_draft` | Validated findings + priorities | options[], recommended_id, risks[] | Expert review before customer |
| `roadmap_draft` | Approved recommendation | phases[], milestones[] | Expert edits |

## Research workflow vs LLM
- **Research workflow** = supplier discovery and evaluation pipeline, job ID, progress updates, and source-backed findings.
- **LLM** = scoping, extraction helpers, and drafting recommendations *from normalized evidence*; deterministic application logic remains responsible for permissions, scoring, and status changes.

## Evaluation checklist (minimal)

- [ ] JSON parses; schema validation fails → retry cap, then 503 with safe message.
- [ ] Citations present when claim implies external fact.
- [ ] Prompt-injection strings in page content do not change system policy (tool layer enforces).

## What the frontend expects (when wired)

- `POST /api/v1/engagements/:id/scope` (or equivalent) returning structured scope.
- Research: existing contract `POST .../research`, `GET .../stream`.
- Findings/recommendations/exports per blueprint §5.

**“Complete” AI/LLM** = backend services above **implemented + tested**; this file is the **spec**, not the implementation.
