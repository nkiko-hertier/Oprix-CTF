# Oprix CTF Platform - Complete Project Documentation

A production-ready SaaS platform for hosting Capture The Flag competitions. This monorepo contains four main components: a NestJS backend, an admin panel, a public-facing frontend, and a React dashboard.

---

## 📁 Project Structure Overview

```
Oprix-CTF/
├── backend/              # NestJS API server
├── admin-pannel/         # Admin dashboard (Express + React)
├── react-dashboard/      # Public CTF dashboard (Vite + React)
└── README.md            # This file
```

---

## 🎯 The Four Main Folders

### 1. **Backend** (`/backend`)

**Purpose:** Core API server for the CTF platform

**Technology Stack:**
- **Framework:** NestJS 11.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 14+ with Prisma ORM
- **Authentication:** Clerk + JWT
- **Real-time:** Socket.io WebSocket
- **Caching:** In-memory (Redis optional)
- **Background Jobs:** Bull with Redis

**Key Features:**
- SaaS multi-tenancy (SuperAdmin → Admin → User hierarchy)
- Real-time leaderboards with caching
- Flag submission engine with rate limiting
- Team management with captain-based system
- Competition lifecycle management (Draft → Registration → Active → Completed)
- WebSocket live updates and notifications
- Background job processing
- Kubernetes-ready health checks
- Complete audit logging
- Secure file management

**Project Structure:**
```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # SuperAdmin seeding
│   └── migrations/        # Database migrations
├── src/
│   ├── common/            # Shared utilities, guards, decorators
│   ├── modules/           # Core modules (auth, users, competitions, etc.)
│   ├── config/            # Configuration
│   └── main.ts            # Application entry
├── k8s/                   # Kubernetes deployment files
├── .env                   # Environment variables
└── package.json
```

**Getting Started:**
```bash
cd backend
npm install
npm run start:dev
```

**Available Scripts:**
```bash
npm run start:dev              # Start with hot-reload
npm run build                  # Build for production
npm run prisma:migrate         # Run database migrations
npm run prisma:seed            # Seed SuperAdmin account
npm run test                   # Run tests
```

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `CLERK_FRONTEND_API` - Clerk authentication endpoint
- `CLERK_SECRET_KEY` - Clerk secret key
- `JWT_SECRET` - JWT signing secret
- `REDIS_HOST` / `REDIS_PORT` - Redis connection details

**Default Credentials (after seeding):**
- Email: `superadmin@oprix-ctf.com`
- Password: Set via `SUPERADMIN_PASSWORD` env variable

**API Documentation:** Available at `http://localhost:3000/api/docs` (Swagger/OpenAPI)

---

### 2. **Admin Panel** (`/admin-pannel`)

**Purpose:** Administrative dashboard for managing CTF competitions, users, and platform content

**Technology Stack:**
- **Backend:** Express.js with TypeScript
- **Frontend:** React 18 + TypeScript + Vite
- **Authentication:** Clerk
- **Database:** Neon (serverless PostgreSQL) with Drizzle ORM
- **UI Components:** shadcn/ui, Radix UI
- **Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query)
- **Forms:** React Hook Form with Zod validation

**Key Features:**
- Full CTF competition management
- User and team administration
- Challenge creation and management
- Announcement system
- Learning materials management
- Audit logging and activity tracking
- Certificate generation
- Leaderboard management
- Real-time notifications
- Submission monitoring

**Project Structure:**
```
admin-pannel/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── dialogs/       # Modal dialogs for CRUD operations
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities (auth, providers, schemas)
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── app.ts             # Express setup
│   ├── db.ts              # Database configuration
│   ├── routes.ts          # API routes
│   ├── schema.ts          # Database schema (shared)
│   └── seed.ts            # Database seeding
├── shared/
│   └── schema.ts          # Shared database schema
├── .env                   # Environment variables
└── package.json
```

**Getting Started:**

**Option 1: Development Server**
```bash
cd admin-pannel
npm install
npm run dev
```
This starts both the Express backend on port 3001 and the React frontend on port 5173.

**Option 2: Production Build**
```bash
npm run build
npm start
```

**Available Scripts:**
```bash
npm run dev                # Start development servers
npm run build              # Build for production
npm run db:push            # Push schema changes to database
```

**Environment Variables Required:**
- `NEON_DATABASE_URL` - Neon serverless PostgreSQL connection
- `CLERK_SECRET_KEY` - Clerk authentication secret
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key (frontend)

**Key Admin Features:**
- Dashboard with statistics and quick actions
- User management and role assignment
- Team creation and management
- Challenge CRUD operations
- Competition lifecycle management
- Announcement broadcasting
- Learning materials upload and management
- Certificate issuance and tracking
- Audit log review and filtering
- Real-time activity monitoring

---

### 3. **React Dashboard** (`/react-dashboard`)

**Purpose:** Public-facing CTF competition dashboard for players to view and participate in challenges

**Technology Stack:**
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui, Radix UI, Material-UI
- **Authentication:** Clerk
- **HTTP Client:** Axios
- **Routing:** React Router DOM 7
- **State Management:** React Hook Form
- **Validation:** Zod
- **Animations:** GSAP, Motion, AOS
- **Utilities:** React Markdown, Highlight.js, HTML-to-Image, QR Code

**Key Features:**
- User-friendly competition browsing
- Challenge submission interface
- Real-time leaderboard viewing
- Team collaboration tools
- Submission history tracking
- Progress indicators
- Responsive design for mobile and desktop
- Error boundary with graceful error handling
- Standardized loading states
- Markdown-rendered challenge descriptions
- QR code generation for team invitations

**Project Structure:**
```
react-dashboard/
├── src/
│   ├── components/       # Reusable UI components
│   ├── territories/      # Page components
│   ├── lib/             # Utilities and API client
│   ├── config/          # Configuration files
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main app component
├── public/              # Static assets
├── .env.example         # Example environment variables
└── package.json
```

**Getting Started:**
```bash
cd react-dashboard
npm install
npm run dev
```
The app will be available at `http://localhost:5173`

**Available Scripts:**
```bash
npm run dev                # Start development server
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint              # Lint code
```

**Environment Variables Required:**
```env
VITE_API_BASE_URL=https://oprix-api.up.railway.app/api/v1/
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
NODE_ENV=development
```

**Key Player Features:**
- Challenge browser with difficulty levels
- Real-time flag submission
- Instant feedback on submissions
- Personal and team leaderboards
- Challenge progress tracking
- Submission history
- Team management interface
- Notifications for competition updates

---

## 🔄 How They Work Together

```
┌─────────────────────────────────────────────────────┐
│           Player/Admin Access                        │
└──────────────────┬──────────────────┬────────────────┘
                   │                  │
        ┌──────────▼────────┐  ┌─────▼──────────────┐
        │ React Dashboard   │  │  Admin Panel       │
        │ (react-dashboard) │  │  (admin-pannel)    │
        │ - Public CTF UI   │  │  - Admin UI        │
        │ - Player Actions  │  │  - Management      │
        └────────┬──────────┘  └─────┬──────────────┘
                 │                   │
                 └─────────┬─────────┘
                           │
                  ┌────────▼─────────┐
                  │ Backend (NestJS) │
                  │ - API Server     │
                  │ - Business Logic │
                  │ - Database Ops   │
                  └────────┬─────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼──────┐  ┌─────▼──────┐  ┌─────▼──────┐
    │ PostgreSQL │  │   Redis    │  │ Clerk Auth │
    │ (Neon)     │  │ (Caching)  │  │            │
    └────────────┘  └────────────┘  └────────────┘
```

---

## 🚀 Deployment

### Backend (NestJS)
- **Current Deployment:** Railway (`https://oprix-api.up.railway.app`)
- **Container:** Docker (NestJS application)
- **Database:** PostgreSQL on Railway
- **Caching:** Redis on Railway

### Admin Panel
- Can be deployed on Vercel, Railway, or any Node.js hosting
- Environment-specific `.env` configuration required

### React Dashboard
- Can be deployed on Vercel, Netlify, or any static host
- Requires environment variables prefixed with `VITE_`

---

## 📋 Key Database Tables

**Backend (Prisma Schema):**
- Users (with role-based access)
- Competitions
- Challenges
- Submissions
- Teams
- Leaderboards
- Notifications
- Audit Logs
- Certificates
- Learning Materials

**Admin Panel (Drizzle Schema):**
- Mirrors backend schema for admin operations
- Additional tables for admin-specific data

---

## 🔐 Authentication Flow

1. **User Registration/Login** → Clerk handles authentication
2. **JWT Token** → Backend issues JWT after Clerk verification
3. **API Requests** → All requests include JWT token
4. **Role-Based Access** → Backend verifies user role for each operation
5. **Session Management** → Express sessions for admin operations

---

## 📊 Development Workflow

1. **Backend Changes** → Update Prisma schema, create migration, run migrations
2. **Admin Panel Changes** → Update Express routes and React components
3. **Dashboard Changes** → Update React components and API calls
4. **Testing** → Each component has its own test suite
5. **Deployment** → Push to GitHub, CI/CD pipelines handle deployment

---

## 🛠️ Common Commands

### All Services
```bash
# Install dependencies
npm install (in each directory)

# Development
npm run dev

# Production build
npm run build

# Production start
npm start
```

### Backend Specific
```bash
# Database migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Database studio (view data)
npm run prisma:studio
```

### Admin Panel Specific
```bash
# Push database schema changes
npm run db:push

# Push with backup
npm run db:push -- --backup
```

---

## 📚 Additional Resources

- **Backend Documentation:** See `backend/README.md`
- **React Dashboard README:** See `react-dashboard/README.md`
- **API Documentation:** Available at deployed backend `/api/v1/docs`

---

## 🎓 Technology Summary

| Component | Language | Framework | Database | Deployment |
|-----------|----------|-----------|----------|-----------|
| **Backend** | TypeScript | NestJS | PostgreSQL | Railway |
| **Admin Panel** | TypeScript | Express + React | Neon | Vercel/Railway |
| **Dashboard** | TypeScript | React + Vite | PostgreSQL | Vercel/Netlify |

---

## 📄 License

MIT License - All components are open source and free to use and modify.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Last Updated:** February 2026  
**Project Status:** Production-Ready  
**Maintainers:** Oprix CTF Team
