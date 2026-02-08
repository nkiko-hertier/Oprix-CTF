# Oprix CTF Client Platform

Modern client application for players to discover, join, and compete in Oprix CTF events.

## Setup

```bash
cd client-platform
npm install
```

Create `.env` from `.env.example` and set:

- `VITE_API_BASE_URL` (default: https://oprix-api.up.railway.app/api/v1)
- `VITE_CLERK_PUBLISHABLE_KEY`

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## App Map

Public routes:
- `/` landing
- `/competitions` and `/competitions/:id`
- `/leaderboard`
- `/certificates/verify`
- `/auth`

Authenticated routes:
- `/app` dashboard
- `/app/competitions`
- `/app/competitions/:id`
- `/app/competitions/:id/challenges`
- `/app/competitions/:id/challenges/:challengeId`
- `/app/competitions/:id/team`
- `/app/submissions`
- `/app/notifications`
- `/app/leaderboard`
- `/app/certificates`
- `/app/settings`
