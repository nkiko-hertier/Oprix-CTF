# CTF Platform - Frontend

React + TypeScript + Vite frontend for the CTF Platform.

## Environment Setup

### Required Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=https://oprix-api.up.railway.app/api/v1/

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Environment
NODE_ENV=development
```

### Environment Variables Explained

- **VITE_API_BASE_URL**: Base URL for the backend API. Defaults to Railway deployment if not set.
- **VITE_CLERK_PUBLISHABLE_KEY**: Clerk publishable key for authentication. Required for the app to function.
- **NODE_ENV**: Environment mode (`development` or `production`).

> **Note:** All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Getting Started

### Installation

```bash
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
# or
pnpm build
```

### Preview Production Build

```bash
npm run preview
# or
pnpm preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── territories/     # Page components
│   ├── lib/            # Utilities and API client
│   ├── config/         # Configuration files
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── .env.example        # Example environment variables
```

## Features

- ✅ Error boundary for graceful error handling
- ✅ Standardized loading states
- ✅ API client with automatic retry and error handling
- ✅ Clerk authentication integration
- ✅ Responsive design with Tailwind CSS

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```



Sure! Here’s a **step-by-step summary** of everything you did to get your app deployed on Railway, from creating `deploy.sh` to having the live API:

---

### **1. Prepare your deployment script (`deploy.sh`)**

* You created a shell script to automate starting containers and building images.

* Commands included:

  ```bash
  # Stop and remove previous containers
  podman stop oprix-ctf-postgres oprix-ctf-redis oprix-ctf-backend
  podman rm oprix-ctf-postgres oprix-ctf-redis oprix-ctf-backend

  # Start services
  podman run -d --name oprix-ctf-postgres postgres:15
  podman run -d --name oprix-ctf-redis redis:7-alpine

  # Build and run backend
  cd /path/to/backend
  podman build -t localhost/oprix-ctf-backend .
  podman run -d --name oprix-ctf-backend -p 3000:3000 localhost/oprix-ctf-backend
  ```

* This script handled **stopping old containers**, **starting new ones**, and **building/running the backend**.

---

### **2. Build multi-stage Docker image**

* You created a **Dockerfile** with **multi-stage builds** for production:

  * **Builder stage**: installs dependencies, runs `pnpm install`, generates Prisma client, builds the NestJS app.
  * **Production stage**: copies built app, installs runtime dependencies, sets up non-root user, exposes port, and sets `ENTRYPOINT` and `CMD`.
* Installed extra tools in the image: `dumb-init`, `openssl`.
* Created uploads folder and fixed permissions for `nestjs` user.
* Healthcheck added (though warned by Podman about OCI format).

---

### **3. Run `deploy.sh` locally**

* Executed `./deploy.sh`.
* Podman built images using cached layers when possible.
* Started PostgreSQL and Redis containers.
* Built backend image.
* Ran backend container; initially got errors due to:

  * **Port 3000 already in use** → resolved by stopping/removing existing containers.
  * **Container names already in use** → resolved by removing old containers first.
* Verified backend connected successfully to Redis and PostgreSQL:

  ```
  Redis connected successfully
  Database connection established
  Server listening on http://localhost:8080
  ```

---

### **4. Log in to GitHub Container Registry**

* Logged into GHCR via Podman:

  ```bash
  podman login ghcr.io
  ```
* Username: `nkiko-hertier`
* Password: GitHub personal access token (PAT) with `write:packages` scope.
* Login succeeded.

---

### **5. Tag images for GitHub Container Registry**

* Tagged local images for pushing:

  ```bash
  GITHUB_USER="nkiko-hertier"

  podman tag localhost/oprix-ctf-backend ghcr.io/$GITHUB_USER/oprix-ctf-backend:latest
  podman tag localhost/oprix-ctf-postgres ghcr.io/$GITHUB_USER/oprix-ctf-postgres:latest
  podman tag localhost/oprix-ctf-redis ghcr.io/$GITHUB_USER/oprix-ctf-redis:latest
  ```
* Note: Postgres and Redis images were not built locally as custom images; used official images → tagging failed for them. Backend tagging worked.

---

### **6. Push backend image to GHCR**

* Push image to registry:

  ```bash
  podman push ghcr.io/$GITHUB_USER/oprix-ctf-backend:latest
  ```
* GHCR accepted the image → ready for deployment.

---

### **7. Deploy to Railway**

* Connected Railway to GHCR image (`ghcr.io/nkiko-hertier/oprix-ctf-backend:latest`).
* Set environment variables for PostgreSQL and Redis.
* Started deployment:

  * Containers initialized.
  * Backend connected to database and Redis.
  * Logs showed successful startup:

    ```
    Redis connected successfully
    Database connection established
    Nest application successfully started
    Server listening on http://localhost:8080
    API available at http://localhost:8080/api/v1
    ```

---

### **8. Verify live deployment**

* Opened Swagger docs in browser:

  ```
  https://oprix-ctf.up.railway.app/api/v1/docs
  ```
* Confirmed routes were visible and working:

  * `/api/v1/health/detailed`
  * `/api/v1/health/ready`
  * `/api/v1/health/live`
* Backend is now live and fully functional.

---

✅ **Summary:**
You automated building and running your NestJS app with Podman, pushed the backend image to GitHub Container Registry, deployed it on Railway, and verified that Redis and Postgres connections were working and API routes accessible.

---

If you want, I can **also make a clean flowchart of this deployment process** that you can keep as a reference for future projects. This will make it visually easier to follow.

Do you want me to do that?
