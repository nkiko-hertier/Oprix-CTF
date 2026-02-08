# Client Platform App Plan

## 1) Current System Analysis (Backend + Admin Panel + API JSON)

### Backend Logic Overview (from backend README + modules)
- **Roles & tenancy:** SuperAdmin → Admin → User hierarchy (multi-tenant competition hosting). Core flows are auth → profile/role → competitions → challenges → submissions → leaderboard → certificates. This aligns with competition lifecycle: Draft → Registration → Active → Completed. Real-time updates and background jobs are supported for live leaderboards/notifications.
- **Key subsystems:** auth (Clerk + JWT), users, competitions, challenges, submissions, teams, leaderboards, announcements, notifications, certificates, files, monitoring/health, websockets, jobs.
- **Operational notes:** rate-limited flag submission, audit logging, secure file storage, and health checks are already part of the backend surface.

### API Surface + Response Expectations (from `admin-pannel/API-JSON.json`)
The client app will align to the OpenAPI contract. Below is a condensed endpoint matrix with expected response shapes/statuses to guide UI states.

#### Auth
| Endpoint | Method | Purpose | Expected Responses |
| --- | --- | --- | --- |
| `/api/v1/auth/me` | GET | Current user profile | `200` profile, `401` unauthorized |
| `/api/v1/auth/clerk` | POST | Clerk auth exchange | `200` ok, `401` failure |
| `/api/v1/auth/webhook` | POST | Clerk webhook | `200` ok, `400` invalid |
| `/api/v1/auth/health` | GET | Auth health | `200` healthy |

#### Users
| Endpoint | Method | Purpose | Expected Responses |
| --- | --- | --- | --- |
| `/api/v1/users/me` | GET | My profile | `200` profile |
| `/api/v1/users/me` | PATCH | Update my profile | `200` updated |
| `/api/v1/users/me/stats` | GET | My stats | `200` stats |
| `/api/v1/users/:id/profile` | GET | Public dashboard profile | `200` profile |
| `/api/v1/users/:id/stats` | GET | User stats | `200`, `404` not found |
| `/api/v1/users` | GET | Admin list | `200` list |
| `/api/v1/users` | POST | Create user (superadmin) | `201` created, `409` exists |
| `/api/v1/users/:id` | GET/PUT/DELETE | Admin user ops | `200`, `404`, `403` |
| `/api/v1/users/:id/role` | PATCH | Update role | `200`, `403` |

#### Competitions
| Endpoint | Method | Purpose | Expected Responses |
| --- | --- | --- | --- |
| `/api/v1/competitions` | GET | Public competitions | `200` list |
| `/api/v1/competitions` | POST | Create (admin) | `201`, `400` invalid |
| `/api/v1/competitions/my` | GET | My competitions | `200`, `401` |
| `/api/v1/competitions/:id` | GET | Competition detail | `200`, `404` |
| `/api/v1/competitions/:id` | PUT/DELETE | Update/delete | `200`, `403`, `400` |
| `/api/v1/competitions/:id/status` | PATCH | Status transition | `200`, `400` invalid |
| `/api/v1/competitions/:id/register` | POST | Register | `200`, `400`, `409` |
| `/api/v1/competitions/:id/register` | DELETE | Unregister | `200`, `400` |
| `/api/v1/competitions/:id/progress` | GET | My progress | `200` |

#### Challenges + Hints + Submissions
| Endpoint | Method | Purpose | Expected Responses |
| --- | --- | --- | --- |
| `/api/v1/challenges` | GET | List challenges (filters) | `200` list |
| `/api/v1/challenges/:id` | GET | Challenge detail | `200`, `404` |
| `/api/v1/challenges` | POST | Create (admin) | `201`, `400` |
| `/api/v1/challenges/:id` | PUT/DELETE | Update/delete | `200`, `403`, `404` |
| `/api/v1/challenges/:id/hints` | POST | Add hint | `201` |
| `/api/v1/submissions` | POST | Submit flag | `201`, `400` invalid, `429` rate-limit |
| `/api/v1/submissions` | GET | Submissions list | `200` list |

#### Teams
| Endpoint | Method | Purpose | Expected Responses |
| --- | --- | --- | --- |
| `/api/v1/teams` | POST | Create team | `201`, `400` |
| `/api/v1/teams/join` | POST | Join by invite | `200`, `400` |
| `/api/v1/teams/:id` | GET/PUT/DELETE | Team detail/manage | `200`, `403`, `404` |
| `/api/v1/teams/:id/kick` | POST | Kick member | `200`, `403` |
| `/api/v1/teams/:id/transfer` | POST | Transfer captain | `200`, `403` |

#### Leaderboards
| Endpoint | Method | Purpose | Expected Responses |
| --- | --- | --- | --- |
| `/api/v1/leaderboard` | GET | Global leaderboard | `200` list |
| `/api/v1/leaderboard/competition/:id` | GET | Competition leaderboard | `200`, `404` |

#### Announcements + Notifications
| Endpoint | Method | Purpose | Expected Responses |
| --- | --- | --- | --- |
| `/api/v1/announcements` | GET | Competition announcements | `200` list |
| `/api/v1/notifications` | GET | My notifications | `200` list |
| `/api/v1/notifications/:id/read` | PATCH | Mark as read | `200` |

#### Certificates + Files + Health
| Endpoint | Method | Purpose | Expected Responses |
| --- | --- | --- | --- |
| `/api/v1/certificates/request` | POST | Request certificate | `201`, `400`, `404` |
| `/api/v1/certificates/verify/:code` | GET | Verify | `200` valid/invalid |
| `/api/v1/files/:id/download` | GET | Download asset | `200`, `404` |
| `/api/v1/health/*` | GET | Health checks | `200` |

### Admin Panel (reference UX + data requirements)
- Admin UI already covers all management surfaces with structured layout, role-based access, dashboard analytics, and documented API usage patterns. This is a strong reference for data models and endpoint expectations, and can be used for consistency in branding + data contracts.

---

## 2) Client Platform Vision

### Goals
- **Production-ready** client platform with polished UI/UX.
- Full lifecycle: **Landing → Auth → Platform → Competitions → Join (team/no-team) → Play (challenges) → Leaderboard → Certificates**.
- Seamless integration with backend API and Clerk authentication.

### Non-Goals (initial release)
- Admin-only surfaces (handled in admin-pannel).
- Complex external integrations beyond Clerk + API.

---

## 3) Information Architecture (Pages & Routes)

### Public (Unauthenticated)
- **Landing (/)**: hero, feature highlights, how it works, CTA.
- **Competitions list (/competitions)**: public competitions, filters, preview cards.
- **Competition details (/competitions/:id)**: overview, schedule, rules, team-based flag.
- **Leaderboard (public) (/leaderboard)**: global / per-competition.
- **Certificate verification (/certificates/verify)**: verify by code.

### Auth & Onboarding
- **Sign in / Sign up (/auth)**: Clerk.
- **Profile setup (/onboarding)**: username, avatar, bio (if required), accept policies.

### Authenticated Platform
- **Dashboard (/app)**: personalized overview (current competitions, progress, stats).
- **My Competitions (/app/competitions)**: registered competitions + status.
- **Competition Hub (/app/competitions/:id)**: timeline, announcements, scoreboard entry.
- **Challenges (/app/competitions/:id/challenges)**: category filters, status, points.
- **Challenge detail (/app/competitions/:id/challenges/:challengeId)**: description, files, hints, submit flag.
- **Teams (/app/competitions/:id/team)**:
  - Create team (if team-based)
  - Join team via invite code
  - Manage team members (captain only)
- **Submissions (/app/submissions)**: history and status.
- **Leaderboard (/app/leaderboard)**: filtered to selected competition.
- **Notifications (/app/notifications)**: updates and announcements.
- **Certificates (/app/certificates)**: request, download, verify.
- **Settings (/app/settings)**: profile, security, API token (if supported).

---

## 4) Core User Flows

1. **Landing → Competition discovery → Details → Join**
2. **Auth → Profile setup → Dashboard**
3. **Join competition (solo/team)**
   - If team-based: create or join team, manage members, then register.
   - If solo: register directly.
4. **Play challenges**
   - View challenges, open details, download files, submit flags.
5. **Leaderboard + announcements**
6. **Competition complete → Request certificate**

---

## 5) UI/UX Direction

- **Design language:** modern, clean, competitive gaming/CTF vibes; high contrast, bold typography, dynamic gradients.
- **Layout:** responsive, mobile-first; card-based discovery; clear CTA placement.
- **Accessibility:** AA-level contrast, keyboard navigation, clear focus states.

---

## 6) Technical Plan

### Proposed Stack (aligned to repo)
- **React + Vite + TypeScript** (consistent with existing frontend stack)
- **Tailwind + shadcn/ui** for consistent component system
- **TanStack Query** for API calls & caching
- **Clerk** for auth

### Data Contracts
- Use OpenAPI (`API-JSON.json`) as source of truth for endpoint mappings.
- Shared types for: Competition, Challenge, Team, Submission, LeaderboardEntry, Announcement, Notification, Certificate.
- All list endpoints should support pagination, search, and filter params where available in the spec.

### API Integration (examples)
- Competitions: `GET /api/v1/competitions`, `POST /api/v1/competitions/:id/register`.
- Challenges: `GET /api/v1/challenges?competitionId=...`.
- Teams: `POST /api/v1/teams`, `POST /api/v1/teams/join`.
- Submissions: `POST /api/v1/submissions`.

---

## 7) Deliverables (Initial Release)

- Landing + Auth + Platform UI
- Competition discovery + details
- Join flow (solo/team)
- Challenge list + detail + submission
- Leaderboard + announcements
- Certificates (request + verify)
- Responsive UI + basic error handling

---

## 8) Risks / Dependencies

- Clerk production keys required for live auth.
- CORS + domain allowlist for production.
- Rate-limits and competition state gating must be mirrored on UI.

---

## 9) New Client Platform Folder

**Proposed folder:** `/client-platform` (new)
- `src/pages`
- `src/components`
- `src/lib/api`
- `src/lib/auth`
- `src/types`
- `src/styles`

---

## 10) Next Step

- Confirm this plan and the task breakdown.
- After confirmation: implement in `/client-platform`.
