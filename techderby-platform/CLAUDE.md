# Tech Derby Platform — CLAUDE.md

This file gives AI coding assistants the context needed to work effectively with this codebase.

---

## Project Overview

**Tech Derby** is a community organisation driving tech innovation in Derby, UK. This platform is the public-facing website and member portal at [techderby.org](https://techderby.org).

The platform serves:
- **Public visitors** — learning about events, programmes, community and getting involved
- **Members** — logging in to a dashboard, connecting with peers, managing their profile
- **Admins** — managing content via the Strapi CMS admin panel

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 6 + TypeScript + Tailwind CSS |
| CMS / API | Strapi v5 (Node.js) |
| Database | PostgreSQL 16 |
| Reverse proxy | Caddy (auto HTTPS in production) |
| Containers | Docker + Docker Compose |
| Deployment | GitHub Actions → Docker Hub → VPS |

---

## Repository Structure

```
techderby-platform/
├── frontend/               # React SPA
├── cms/                    # Strapi v5 headless CMS
├── docker/                 # Caddyfile + nginx config
├── docker-compose.yml      # Local development
├── docker-compose.images.yml       # Production
├── docker-compose.images.dev.yml   # Dev server
├── docker-compose.images.uat.yml   # UAT server
├── docker-compose.caddy.yml        # Caddy reverse proxy
└── CLAUDE.md
```

---

## Local Development

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Git

### Start all services

```bash
cd techderby-platform
cp .env.example .env
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend (Vite dev) | http://localhost:3000 |
| Strapi Admin | http://localhost:1337/admin |
| PostgreSQL | localhost:5432 |

> **Windows users:** `localhost` may resolve to IPv6 (`::1`) which Docker doesn't bind by default. Use `http://127.0.0.1:3000` if `localhost:3000` times out, or ensure `docker-compose.yml` binds both `127.0.0.1:3000:3000` and `[::1]:3000:3000`.

> **Hot reload:** Vite file watching doesn't work across Windows→Docker volumes via inotify. The `vite.config.ts` sets `server.watch.usePolling: true` to poll every 300ms — edits will hot-reload without restarting the container.

### Run frontend without Docker

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL=http://localhost:1337
npm install
npm run dev
```

---

## Frontend Architecture (`frontend/src/`)

### Key directories

```
src/
├── App.tsx                  # Root: AuthProvider + RouterProvider
├── main.tsx                 # Entry: React.StrictMode + HelmetProvider + QueryClientProvider
├── styles.css               # Tailwind + global CSS vars
├── router/
│   └── routes.tsx           # All routes (createBrowserRouter)
├── layouts/
│   ├── PublicLayout.tsx     # Navbar + Outlet + Footer
│   └── DashboardLayout.tsx  # Authenticated member shell
├── pages/                   # One file per route
├── components/              # Shared UI components
│   ├── ui/                  # Primitives (Button, Container, etc.)
│   └── figma/               # Figma-exported components
├── contexts/
│   └── AuthContext.tsx      # JWT auth state (login/register/logout/refresh)
├── hooks/
│   └── use-content-query.ts # TanStack Query hooks for all content types
├── services/
│   └── content-service.ts   # Axios fetch functions wrapped around apiClient
├── lib/
│   └── api.ts               # Axios instance + JWT interceptors + all API methods
└── types/
    ├── auth.ts              # AuthUser, LoginInput, RegisterInput, etc.
    └── content.ts           # Event, Partner, Programme, Post, etc.
```

### Routing

Routes are defined in `router/routes.tsx` using `createBrowserRouter`. All pages are lazy-loaded via `React.lazy` + `Suspense`.

Route groups:
- **Standalone auth** (`/login`, `/register`, `/forgot-password`, `/reset-password`) — no layout wrapper
- **Public** (`/`, `/about`, `/events`, `/summit-2026`, `/programmes/*`, etc.) — wrapped in `PublicLayout` (Navbar + Footer)
- **Dashboard** (`/dashboard/*`) — wrapped in `ProtectedRoute` + `DashboardLayout`

### Authentication

- JWT stored in `localStorage` (remember me) or `sessionStorage` (session only), under keys `td_jwt` and `td_user`
- `AuthContext` provides `login`, `register`, `logout`, `updateProfile`, `refreshUser`, `isAuthenticated`, `isLoading`
- `ProtectedRoute` redirects unauthenticated users to `/login` with `state.from` for post-login redirect
- Token is attached to every API request via the Axios request interceptor in `lib/api.ts`
- 401 responses clear storage and fire a `td:auth:expired` DOM event

### Styling conventions

- **Tailwind CSS** for component-level utility classes (most shared components)
- **Inline `style` props** for one-off or highly dynamic styling (used extensively on special pages like `TechDerbySummitPage.tsx`)
- **Do not mix** the two on the same element without good reason
- Tailwind custom colours: `primary` (#0c4a6e), `secondary` (#f97316), `surface` (#f8fafc)
- Dark theme pages (e.g. Summit page) use inline styles with the navy palette: `#0c1829`, `#0d2030`, `#0b2d3c`
- Cyan accent: `#06b6d4` / `#22d3ee`; Amber accent: `#f97316` / `#fb923c`
- Responsive typography uses `clamp()` — e.g. `fontSize: 'clamp(1.9rem, 4.8vw, 2.85rem)'`

### Data fetching

```ts
// In a component:
import { useEvents } from '../hooks/use-content-query';
const { data, isLoading, error } = useEvents();
```

Available hooks: `useEvents`, `usePartners`, `useInsights`, `useInsightBySlug`, `useProgrammes`

All hooks use TanStack Query v5 with a shared `QueryClient` from `main.tsx`.

---

## Pages Reference

| Route | File | Notes |
|---|---|---|
| `/` | `HomePage.tsx` | Landing page |
| `/about` | `AboutPage.tsx` | |
| `/events` | `EventsPage.tsx` | Fetches from Strapi |
| `/events/browse` | `EventRegistrationPage.tsx` | |
| `/events/:slug` | `EventDetailPage.tsx` | |
| `/summit-2026` | `TechDerbySummitPage.tsx` | **Standalone dark-theme page** — does not align with other page layouts |
| `/programmes` | `ProgrammesPage.tsx` | |
| `/programmes/pre-seed-accelerator` | `TechDerbyAcceleratorPage.tsx` | |
| `/programmes/tech-star-women` | `TechStarWomenPage.tsx` | |
| `/programmes/pre-seed-accelerator/apply` | `AcceleratorApplicationPage.tsx` | |
| `/membership` | `MembershipPage.tsx` | |
| `/get-involved` | `GetInvolvedPage.tsx` | |
| `/community` | `CommunityPage.tsx` | |
| `/partners` | `PartnersPage.tsx` | |
| `/wire` | `InsightsPage.tsx` | Blog/news feed |
| `/wire/:slug` | `InsightDetailPage.tsx` | |
| `/contact` | `ContactPage.tsx` | |
| `/login` | `LoginPage.tsx` | |
| `/register` | `RegisterPage.tsx` | |
| `/dashboard` | `DashboardHomePage.tsx` | Protected |
| `/dashboard/profile` | `ProfilePage.tsx` | Protected |

---

## Summit 2026 Page (`TechDerbySummitPage.tsx`)

This is a **fully custom, standalone dark-theme conference page** that intentionally has its own layout and does not follow the patterns of other public pages.

**Important:** This page wraps its own dark shell — the `PublicLayout` Navbar and Footer still render above/below it.

### Sections (in order)
1. **Hero** — Badge, H1, cyan subtitle, description, two pill buttons (Register → Eventbrite, Become a Partner → /contact), stat chips
2. **Conference Theme** — Full-bleed `acc2.jpg` background + overlay + amber glow, circular photo, glass card wrapper with theme/session/audience cards
3. **About the Summit** — Section label, H2, body card, 2×2 theme grid
4. **Agenda Preview** — Glow decorations, H2, timeline panel with 6 agenda rows
5. **Who Should Attend** — Two-column: left dark card with pill list, right cyan gradient "Conference Outcomes" card
6. **Speakers** — 3-column dark speaker cards with initials avatar
7. **Partners & Sponsors** — Split card: left body text + "Become a Partner" button, right two partner logos on white backgrounds
8. **Final CTA** — Cyan gradient card with H2, body text, Register (→ Eventbrite) + Partnership (→ /contact) buttons

### Register buttons
Both register buttons on this page link externally to:
```
https://www.eventbrite.co.uk/e/east-mids-tech-week-2026-tech-derby-summit-2026-tickets-1986190909477?aff=oddtdtcreator
```
They open in a new tab (`target="_blank" rel="noopener noreferrer"`).

### Partner logos
Located in `src/assets/images/partners/`:
- `partner1.png` — displayed with white background
- `partner2.svg` — displayed with white background
- `partner3.avif`, `partner4.png`, `university-of-derby.svg` — available

---

## CMS (Strapi v5)

Admin panel: `http://localhost:1337/admin`

### Content types

| API path | Purpose |
|---|---|
| `/api/events` | Events |
| `/api/partners?populate=logo` | Partners with logos |
| `/api/posts?populate=featuredImage` | Insights/blog posts |
| `/api/programmes` | Programmes |
| `/api/members` | Member directory |
| `/api/speakers` | Speaker profiles |
| `/api/mailing-list-subscriptions` | Email signups |

### Custom API endpoints (in `cms/src/api/`)
- `auth/register`, `auth/local` — registration and login
- `profile` — get/update authenticated user profile + avatar upload
- `member-directory` — public member listing
- `connections` — member connections
- `messages` — member-to-member messaging
- `notify` — notifications

### Database
PostgreSQL 16. Config in `cms/config/database.ts`. Credentials via environment variables (`DATABASE_HOST`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`).

---

## Environment Variables

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:1337
VITE_PROXY_TARGET=http://strapi:1337
```

### CMS (`cms/.env` or root `.env`)
```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=techderby
DATABASE_USERNAME=techderby
DATABASE_PASSWORD=techderby
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
```

---

## Deployment

### Branch → environment
| Branch | Environment | URL |
|---|---|---|
| `develop` | Dev | https://dev.techderby.org |
| `uat` | UAT | https://test.techderby.org |
| `main` | Production | https://techderby.org |

### Active branches
- `feature/tech-conference-page` — Summit 2026 page + infrastructure fixes (polling, IPv6 binding)

### Deploy flow
1. Push branch → GitHub Actions builds Docker images → pushes to Docker Hub
2. Actions SSH into VPS → `docker compose pull && docker compose up -d`
3. No source code is cloned onto the server

---

## Common Tasks

### Add a new public page
1. Create `frontend/src/pages/MyNewPage.tsx`
2. Add a lazy import in `router/routes.tsx`
3. Add the route inside the `/` `PublicLayout` children array

### Add a new Strapi content type
1. Use the Strapi admin UI to define the schema
2. Add the TypeScript interface to `frontend/src/types/content.ts`
3. Add a fetch function to `frontend/src/services/content-service.ts`
4. Add a query hook to `frontend/src/hooks/use-content-query.ts`

### Add a new partner logo to the Summit page
1. Place the image in `frontend/src/assets/images/partners/`
2. Import it in `TechDerbySummitPage.tsx` alongside the existing imports
3. Render it inside a white-background card in the Partners & Sponsors section

---

## Known Issues & Gotchas

- **Vite polling:** `usePolling: true` (300ms interval) is set in `frontend/vite.config.ts` to handle Windows→Docker volume changes. Do not remove this.
- **localhost IPv6:** `docker-compose.yml` binds port 3000 on both `127.0.0.1` and `[::1]` to handle Windows Chrome resolving `localhost` to IPv6.
- **Stale Vite cache:** If the page appears blank after a container restart, do a hard refresh (`Ctrl+Shift+R`) to clear the browser's cached pre-bundled modules.
- **Summit page layout:** `TechDerbySummitPage.tsx` uses `position: relative` + `overflow: hidden` on sections with absolute-positioned glow decorations. Adding `overflow: hidden` to a parent can clip child glows — check carefully.
- **Auth context null error:** `Cannot read properties of null (reading 'useContext')` at LoginPage is a stale Vite module cache issue. Hard refresh resolves it.
