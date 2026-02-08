# Client Platform Task Plan

## Phase 0 — Discovery & Alignment
- [ ] Confirm core user flows (landing → auth → platform → competitions → join → team/solo → play → leaderboard → certificate).
- [ ] Confirm UI/UX direction (brand colors, typography, tone).
- [ ] Confirm data contracts / API base URL for production.
- [ ] Validate endpoint responses against OpenAPI (status codes, error payloads, pagination schemas).

## Phase 1 — Project Setup
- [ ] Create `/client-platform` Vite + React + TS app.
- [ ] Install Tailwind, shadcn/ui, TanStack Query, Clerk.
- [ ] Add environment setup (`VITE_API_BASE_URL`, `VITE_CLERK_PUBLISHABLE_KEY`).
- [ ] Establish shared UI primitives and layout shell.

## Phase 2 — Public Experience
- [ ] Landing page (hero, features, CTA, FAQ).
- [ ] Public competitions list + filters.
- [ ] Competition detail preview.
- [ ] Public leaderboard + certificate verification.

## Phase 3 — Auth & Onboarding
- [ ] Clerk auth routes.
- [ ] Onboarding profile completion (optional if backend requires).

## Phase 4 — Core Platform
- [ ] App shell (sidebar/top nav, responsive).
- [ ] Dashboard (stats + quick actions).
- [ ] My competitions list + status.
- [ ] Competition hub (announcements + progress + leaderboard snippet).

## Phase 5 — Competition Participation
- [ ] Challenge list + filters by category/difficulty.
- [ ] Challenge detail page: description, files, hints, submit flag.
- [ ] Submissions history.

## Phase 6 — Teams & Join Flow
- [ ] Team creation + invite code.
- [ ] Join team flow.
- [ ] Captain management (kick, transfer).
- [ ] Solo registration flow.

## Phase 7 — Certificates & Wrap-up
- [ ] Request certificate page.
- [ ] Certificate list + download/verify flow.

## Phase 8 — QA, Performance, Release
- [ ] Error states, empty states, loading skeletons.
- [ ] Accessibility pass (keyboard nav, contrast).
- [ ] Mobile layout pass.
- [ ] Final deployment checklist (CORS, Clerk keys, API env).
- [ ] End-to-end runbook: auth, register, team join, challenge submit, certificate request.

---

## Milestone Outputs
- **M1:** Project setup + landing + public competitions
- **M2:** Auth + dashboard + competition hub
- **M3:** Challenges + submissions
- **M4:** Teams + certificates
- **M5:** QA + production readiness

---

## Open Questions
- Branding (logo, color palette, typography)?
- Do we need multilingual support in V1?
- Any custom payment/paid competitions?
