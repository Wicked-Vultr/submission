# Expert Intelligence Assistant (frontend)

React + TypeScript + Vite app for the **Expert Intelligence Assistant** hackathon workspace: engagements, CHRONICLE research UI, findings, recommendations, roadmap, customer review, and exports (demo data via **localStorage** until the FastAPI backend is connected).

## Stack

- **React 19**, **TypeScript**, **Vite**
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — utility styling for new/updated screens
- **shadcn-style primitives**: `src/components/ui/button.tsx` (Radix Slot + `class-variance-authority` + `tailwind-merge`)
- **React Hook Form** + **Zod** for form validation
- **Recharts** for dashboard / comparison charts (loaded **lazily** to reduce initial bundle)
- **React Router** for routing

Legacy screens still use **plain CSS modules** in places; new polish uses Tailwind (`className`). Both can coexist.

## Quick start

```bash
cd d:\Project\Expert-Intelligence-Assistant
npm install
npm run dev
```

If **`npm install` fails** with `No matching version found for @tailwindcss/oxide@…` (seen on some Windows/npm installs), run once: `npm install @tailwindcss/oxide@4.3.5 --no-save` (or match the `tailwindcss` version in `package-lock.json`), then `npm install` again.

Open the URL Vite prints (usually **http://localhost:5173**). Use **Sign in** with any demo email/password (local session only).

```bash
npm run build   # production build + typecheck
npm run lint    # oxlint
```

## Environment

Copy `.env.example` to `.env.local` and set when the backend is available:

- `VITE_API_BASE_URL` — FastAPI origin (e.g. `http://localhost:8000`)

## Documentation (repo)

| Doc | Purpose |
|-----|---------|
| [docs/qa-mvp-checklist.md](docs/qa-mvp-checklist.md) | Manual MVP QA before demo |
| [docs/product-acceptance-mvp.md](docs/product-acceptance-mvp.md) | Product acceptance vs blueprint |
| [docs/ai-llm-mvp-guide.md](docs/ai-llm-mvp-guide.md) | AI/LLM integration notes for backend |

## Notes

- **Backend not included** in this folder: real auth, persistence, SSE, and PDF export require FastAPI + DB per the technical blueprint.
- **Charts**: first paint may show a short “Loading chart…” placeholder while the Recharts chunk loads (lazy `Suspense`).

## Original Vite template bits

Oxlint can be extended with type-aware rules — see [.oxlintrc.json](.oxlintrc.json).
