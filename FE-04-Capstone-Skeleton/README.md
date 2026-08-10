# FE-04 — Capstone Skeleton

## 1. Assignment Purpose
The purpose of FE-04 is to create a clean, minimal, production-ready Next.js capstone skeleton for FlyRank Frontend AI Engineering. It establishes the core architecture, routing, design tokens, and health checks, serving as the deployed foundation for future feature expansion in upcoming capstone phases.

## 2. Technologies
- **Next.js 15 (App Router)**: Server Components by default, client components for interactive state
- **TypeScript**: Strict typing across components, routes, and data models
- **Tailwind CSS v4**: Utility-first responsive styling with custom CSS variables
- **Lucide React**: Lightweight vector icon set
- **ESLint**: Next.js core web vitals configuration

## 3. Project Structure
```
FE-04-Capstone-Skeleton/
├── app/
│   ├── layout.tsx       # Root layout with responsive navigation & footer
│   ├── page.tsx         # Home / Capstone Skeleton landing page
│   ├── globals.css      # Design tokens & Tailwind CSS configuration
│   ├── health/
│   │   └── page.tsx     # Health inspection UI (fetches /api/health)
│   └── api/
│       └── health/
│           └── route.ts # Health check JSON API endpoint
├── components/
│   └── Navigation.tsx   # Accessible responsive navigation header
├── lib/
│   └── health.ts        # Shared health check business logic and types
├── public/              # Static assets
├── .env.example         # Non-sensitive example environment configuration
├── .gitignore           # Git ignore rules for node_modules, builds, and local envs
├── next.config.ts       # Next.js framework configuration
├── package.json         # Self-contained project dependencies and scripts
├── postcss.config.mjs   # PostCSS configuration for Tailwind CSS
├── tsconfig.json        # TypeScript configuration with path aliases (@/*)
└── README.md            # Comprehensive project documentation
```

## 4. Routes
- `/`: Home landing page communicating FlyRank Frontend AI Engineering, FE-04 status, and Phase: Foundations.
- `/health`: Health status UI page that dynamically fetches and displays health data from `/api/health`.
- `/api/health`: JSON endpoint returning `{ status, service, timestamp, environment, uptime }`.

## 5. Local Setup
Navigate to the project directory and install dependencies:
```bash
cd FE-04-Capstone-Skeleton
npm install
```

## 6. Environment Variable Setup
Copy `.env.example` to `.env.local` for local customization:
```bash
cp .env.example .env.local
```
No sensitive API keys or credentials are required for the capstone skeleton.

## 7. Development Command
Run the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 8. Lint Command
Run ESLint and Next.js static checks:
```bash
npm run lint
```

## 9. Production Build Command
Compile and build the production artifact:
```bash
npm run build
```
To run the production server after building:
```bash
npm run start
```

## 10. Deployment Target
Vercel

## 11. Preview Deployment Workflow
Preview builds are generated automatically upon push to pull requests or preview branches. Each preview build compiles with `npm run build` and runs health checks against `/api/health`.

## 12. Health-check Explanation
The `/api/health` route invokes `getHealthStatus()` in `lib/health.ts` to return current runtime metrics (service identity, operational status, ISO timestamp, environment, and uptime). The `/health` client page fetches this endpoint dynamically via `fetch('/api/health')` with cache-busting headers, displaying the status badge, formatted payload, and raw JSON response.
