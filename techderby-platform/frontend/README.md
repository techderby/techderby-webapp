# Tech Derby Frontend

Public-facing React app for Tech Derby, built with React + Vite + TypeScript + Tailwind CSS.

## Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About |
| `/events` | Events (Tech Derby + community, upcoming/past) |
| `/events/:slug` | Event detail |
| `/programmes` | Programmes |
| `/programmes/tech-star-women` | TechStar Women |
| `/programmes/tech-derby-accelerator` | Pre-seed Accelerator |
| `/membership` | Membership interest |
| `/partners` | Partners |
| `/wire` | Blog / Wire posts |
| `/wire/:slug` | Post detail |
| `/contact` | Contact |
| `/directory` | Member directory |
| `/get-involved` | Get involved |
| `/login` | Login |

All pages are lazy-loaded for route-level code splitting.

## Local setup

Run via Docker from the platform root (recommended):

```bash
cd techderby-platform
docker compose up --build
```

Or run standalone:

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:1337
npm install
npm run dev
```

App runs on http://localhost:3000.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run test     # run Vitest tests
npm run lint     # ESLint
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Strapi base URL (e.g. `http://localhost:1337`) |
| `VITE_CALLMEBOT_API_KEY` | WhatsApp notification key (optional) |

In production, `VITE_API_URL` and `VITE_CALLMEBOT_API_KEY` are baked in at Docker build time via `--build-arg`.

For full platform setup, see [`techderby-platform/README.md`](../README.md).
