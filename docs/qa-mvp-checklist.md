# ProcureIQ — MVP QA checklist

Use this for **hackathon demo prep** and **acceptance** before judges. Check each box when verified on **localhost** or **staging**. Notes in brackets mark **demo-only** behaviour (localStorage, simulated research) vs **production** (real API).

---

## 1. Environment & smoke

- [ ] `npm install` completes without errors  
- [ ] `npm run dev` starts; app loads at the URL printed (usually `http://localhost:5173`)  
- [ ] `npm run build` succeeds (CI parity)  
- [ ] No secrets or API keys committed in repo (only `.env.example` names, not real values)

---

## 2. Auth & access (demo)

- [ ] Visiting `/app` without session redirects to `/sign-in`  
- [ ] Sign-in with invalid email shows validation message (Zod)  
- [ ] Sign-in with valid email + password succeeds → lands on Dashboard  
- [ ] Top bar shows session display name after sign-in  
- [ ] Settings → Sign out clears session and returns to `/sign-in`

---

## 3. Customers

- [ ] **Customers** list empty state is readable  
- [ ] **Add Customer**: required org name enforced; at least one contact with **name + email** enforced  
- [ ] Contact row partially filled shows clear field errors  
- [ ] After save, customer appears in list with expected fields  
- [ ] **Recent activity** (Dashboard) logs customer created (when implemented)

---

## 4. Engagements — list & create

- [ ] **Engagements** empty state invites creation  
- [ ] **New Engagement** blocked or clearly messaged when there are **no customers**  
- [ ] **New Engagement**: title + problem statement validation (min length) works  
- [ ] After create, redirects to engagement workspace (`/app/engagements/:id`)  
- [ ] Engagement appears on Dashboard **Recent engagements** with correct status badge

---

## 5. Engagement workspace (tabs)

For one test engagement, verify all tabs load without console errors:

| Tab | Pass criteria |
|-----|----------------|
| Overview | Problem brief fields render; “Open research workspace” link works; Export panel visible |
| Research | Start supplier research shows progress; completes (demo simulation if API down) |
| Findings | After research complete: ≥3 entities, source links, comparison table + chart |
| Recommendations | Generate draft works; “Mark ready for customer review” updates flow |
| Roadmap | Generate from recommendation shows milestones |
| Customer review | Approve / Request changes updates state and messaging |

- [ ] Sidebar **Engagement** tabs highlight matches current route  
- [ ] “Draft” banners visible where AI/customer content is unapproved (expected)

---

## 6. Supplier research (current build)

**Demo (no backend):**

- [ ] Research job completes and seeds demo findings  
- [ ] Phase list progresses (8 phases) or shows clear running/complete state  

**With backend (when wired):**

- [ ] `POST /api/v1/engagements/:id/research` returns `job_id`  
- [ ] `GET /api/v1/research/:job_id/stream` (SSE) updates UI in real time  
- [ ] Failure states: network error, 401, 500 — user sees error or safe fallback (no blank screen)

---

## 7. Data integrity (demo localStorage)

- [ ] Refresh page: customers and engagements **persist** (same browser)  
- [ ] Different browser / incognito = fresh state (expected for local demo)

---

## 8. Solutions hub & ProcureIQ

- [ ] `/app/solutions` lists ProcureIQ card and links correctly  
- [ ] ProcureIQ page explains workflow and links to **New engagement**

---

## 9. Dashboard & charts

- [ ] Stat cards show plausible counts (active, customers, pending review, completed)  
- [ ] When ≥1 engagement exists, **Engagements by status** chart renders (may show **“Loading chart…”** briefly while Recharts loads — expected)  
- [ ] No layout break at ~375px width (smoke mobile)

---

## 10. Exports

- [ ] JSON download includes engagement + findings blob (structure sanity)  
- [ ] CSV opens in spreadsheet with expected columns  
- [ ] Markdown downloads and opens legibly  
- [ ] PDF: **not in browser MVP** — confirm backend/ReportLab path for production note in demo script

---

## 11. Accessibility & UX (light pass)

- [ ] All primary buttons have visible focus / hover (keyboard tab through sign-in + one form)  
- [ ] Images/icons have `aria-label` where icon-only (spot-check notifications, remove contact)  
- [ ] Error text associated with fields (screen reader: check one invalid submit)

---

## 12. Security smoke (MVP)

- [ ] Password field is `type="password"` on sign-in  
- [ ] No API keys in browser bundle for LLM (keys stay server-side when integrated)  
- [ ] External links (source URLs) use `rel="noreferrer noopener"` where applicable

---

## Demo script (3–5 minutes) — suggested order

1. Sign in → Dashboard (mention “demo auth”).  
2. Add customer → Add engagement (problem + scope).  
3. Research → wait for completion → Findings (mention source-backed draft).  
4. Recommendations → generate → “ready for review”.  
5. Customer review → approve or request changes.  
6. Roadmap → show milestones.  
7. Settings / sign out (optional).  
8. One sentence on **next**: backend API + verified research integrations + Vultr deploy.

---

## Sign-off

| Role | Name | Date | Notes |
|------|------|------|--------|
| QA | | | |
| Product | | | |
| Backend | | | API wired: Y/N |
| Frontend | | | |

---

*Aligned with the ProcureIQ product scope (purchase requests, supplier research, evidence, comparisons, approvals, and procurement records). Adjust rows when production APIs replace localStorage.*
