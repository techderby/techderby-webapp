# Tech Derby Platform

Full-stack web platform for Tech Derby — a community driving tech innovation in Derby, UK.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| CMS / API | Strapi v5 |
| Database | PostgreSQL 16 |
| Reverse proxy | Caddy (auto HTTPS) |
| Containers | Docker + Docker Compose |

## Repository Structure

```text
techderby-platform/
├── frontend/               # React app
├── cms/                    # Strapi CMS
├── docker/                 # Caddyfile + nginx config
├── docker-compose.yml      # Local development
├── docker-compose.images.yml       # Production deploy (image-based)
├── docker-compose.images.dev.yml   # Dev server deploy (image-based)
├── docker-compose.images.uat.yml   # UAT server deploy (image-based)
├── docker-compose.caddy.yml        # Caddy reverse proxy (shared)
├── .env.example            # Local dev env template
├── .env.dev.example        # Dev server env template
├── .env.test.example       # UAT server env template
└── .env.prod.example       # Production server env template
```

Sub-project docs:
- Frontend: [`frontend/README.md`](frontend/README.md)
- CMS: [`cms/README.md`](cms/README.md)

---

## Local Development

### 1. Clone and set up environment

```bash
git clone https://github.com/techderby/techderby-webapp.git
cd techderby-webapp/techderby-platform
cp .env.example .env
```

### 2. Start all services

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Strapi Admin | http://localhost:1337/admin |
| PostgreSQL | localhost:5432 |

### 3. Run frontend without Docker

```bash
cd frontend
cp .env.example .env    # set VITE_API_URL=http://localhost:1337
npm install
npm run dev
```

### Adding frontend dependencies

The frontend container bind-mounts `./frontend` and runs `npm install` at startup, so `package.json` is always the source of truth. After adding a new dependency, simply restart the service:

```bash
# from techderby-platform/
docker compose up -d frontend
```

No `--build` or volume cleanup required. (The poster generator at `/create-poster` ships with `@huggingface/transformers` for in-browser AI background removal — added via this workflow.)

---

## CI/CD Pipeline

Deployment is fully automated via GitHub Actions using pre-built Docker Hub images (no source code on the server).

### Branch → Environment mapping

| Branch | Environment | URL |
|--------|-------------|-----|
| `develop` | Dev | https://dev.techderby.org |
| `uat` | UAT | https://test.techderby.org |
| `main` | Production | https://techderby.org |

### How it works

1. Push to a branch → GitHub Actions builds Docker images and pushes to Docker Hub
2. Actions SSHs into the server, writes the env file, and runs `docker compose pull && up -d`
3. No source code is ever cloned onto the server

### Required GitHub secrets

**Repository-level:**
- `DOCKERHUB_USERNAME` — Docker Hub username
- `DOCKERHUB_TOKEN` — Docker Hub access token
- `VITE_CALLMEBOT_API_KEY` — WhatsApp notification API key

**Per environment** (`dev` / `uat` / `prod`):
- `SERVER_HOST` — VPS IP address
- `SERVER_USER` — SSH username (e.g. `root`)
- `SERVER_SSH_KEY` — Private SSH key
- `ENV_FILE_CONTENTS` — Full contents of the environment's `.env` file

---

## Server Setup (one-time)

```bash
# Install Docker
apt update && apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list
apt update && apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Firewall
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable

# Create working directory
mkdir -p /opt/techderby/techderby-platform/docker

# Log in to Docker Hub (one-time — credentials persist)
docker login -u YOUR_DOCKERHUB_USERNAME
```

Then manually copy `docker-compose.caddy.yml` and `docker/Caddyfile` to the server and start Caddy:

```bash
cd /opt/techderby/techderby-platform
docker compose -f docker-compose.caddy.yml up -d
```

---

## Contributing

See the [contributing guide](../CONTRIBUTING.md) if available, or follow this workflow:

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR-USERNAME/techderby-webapp.git
cd techderby-webapp/techderby-platform
git remote add upstream https://github.com/techderby/techderby-webapp.git

# Sync and branch:
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature

# After changes:
git push origin feature/your-feature
# Open a Pull Request → develop on GitHub
```

Merge chain: `feature/* → develop → uat → main`


## 6. API Integration

Axios client: `frontend/src/lib/api.ts`

Endpoints used:
- `GET /api/events`
- `GET /api/partners`
- `GET /api/insights`
- `GET /api/programmes`
- `POST /api/mailing-list-subscriptions`
- `GET /api/mailing-list-subscriptions/export` (token-protected CSV export)

React Query hooks:
- `frontend/src/hooks/use-content-query.ts`

## 7. Strapi Content Types

Defined under `cms/src/api/*/content-types/*/schema.ts`:
- Event
- Speaker
- Partner
- Programme
- Insight
- Member
- Mailing List Subscription

Event content type includes additional fields used by the current frontend:
- `eventSource` (`tech-derby` or `other`)
- `agendaItems` (JSON array)
- `speakerCards` (JSON array)
- `mailingListNotifiedAt` (internal send-tracking datetime)

After first boot:
1. Open `http://localhost:1337/admin`
2. Create admin user
3. Go to Settings > Users & Permissions > Roles > Public
4. Enable `find` and `findOne` for Events, Partners, Insights, Programmes
5. Enable `create` for Mailing List Subscriptions
6. Add sample content and publish entries

For CSV export with Content API token:
1. Go to Settings > API Tokens
2. Create a Custom token
3. Grant scope `api::mailing-list-subscription.mailing-list-subscription.exportCsv`
4. Export with:

```bash
curl -L "http://localhost:1337/api/mailing-list-subscriptions/export" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -o mailing-list-subscriptions.csv
```

## 8. Current Build Status

### About Page
- Full multi-section layout implemented (hero, mission/vision, values, what we do, governance, CTA)
- Content aligned to supplied copy pack
- Team section hidden by design for now

### Events Page
- Source segmentation: `Tech Derby` vs `Others`
- Timeline tabs: `Upcoming` and `Past`
- Conditional filter behavior:
  - `Tech Derby`: only timeline tabs apply
  - `Others`: timeline + theme/audience/format/search filters
- Search placeholder: `enter search keyword`

### Event Cards and Modal
- Card shows:
  - Title
  - Date and time
  - Venue
  - Tickets
  - Short summary
- `View Details` opens modal with backend-driven sections:
  - Event details
  - Agenda
  - Speakers
- Accessibility block is standard shared copy for all events

### Mailing List
- Frontend mailing list join form implemented on Events page
- Subscriptions saved to Strapi collection type
- CSV export endpoint implemented

### Event Publish Email Notification
- On first publish of an event, lifecycle hook emails all subscribers
- Uses SMTP settings from environment variables
- Prevents duplicate sends using `mailingListNotifiedAt`

## 9. Email Configuration (SMTP)

Set these variables in your active `.env`:

```dotenv
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@yourdomain.com
SMTP_PASS=your-password-or-app-password
SMTP_FROM="Tech Derby <you@yourdomain.com>"
PUBLIC_FRONTEND_URL=http://localhost:3000
```

Docker compose forwards these variables to the Strapi service.

## 10. Accessibility, SEO, Performance

- Accessibility:
  - semantic landmarks (`header`, `nav`, `main`, `footer`)
  - keyboard-visible focus styles
  - ARIA labels on key actions/forms
- SEO:
  - route-level metadata via `react-helmet-async` in `PageSeo`
  - OpenGraph title/description tags
- Performance:
  - page-level lazy loading in `frontend/src/router/routes.tsx`
  - React Query caching for API responses

## 11. Integration of Figma Components

The frontend includes Figma-style component modules in `frontend/src/components`:
- `Navbar`
- `Footer`
- `Hero`
- `EventCard`
- `PartnerCard`
- `MemberCard`
- `CTASection`

Reusable primitives in `frontend/src/components/ui`:
- `Button`
- `Card`
- `Input`
- `Badge`
- `Tag`
- `Section`
- `Container`

## 12. Next Steps Toward Deployment

When ready, add:
- CI pipeline for lint/test/build
- environment-specific Docker Compose overrides
- managed Postgres and Strapi media storage
