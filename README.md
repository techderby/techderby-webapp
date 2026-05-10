# Tech Derby Webapp

Tech Derby's website and platform codebase. This repository currently contains:

1. A root React + Vite app used for the website UI and design-system-driven pages.
2. A full platform workspace in `techderby-platform/` (frontend + Strapi CMS + Docker stack).

## Repository Structure

```text
techderby-webapp/
|-- src/                         # Root website app source
|-- styles/                      # Root website styles and theme files
|-- guidelines/                  # Team guidelines (editable)
|-- techderby-platform/          # Full stack platform workspace
|   |-- frontend/                # Platform frontend (React + Vite + TS)
|   |-- cms/                     # Strapi CMS
|   |-- docker/                  # Reverse proxy and infra config
|   |-- docker-compose*.yml      # Local and environment deployment compose files
|   `-- README.md                # Detailed platform docs
|-- package.json                 # Root app scripts
`-- README.md                    # This file
```

## Prerequisites

- Node.js 20+ (Node 22 recommended)
- npm 10+
- Docker + Docker Compose plugin (required for full platform stack)
- Git

## Quick Start

### Option A: Run the root website app

```bash
npm install
npm run dev
```

Available root scripts:

- `npm run dev` - start local dev server
- `npm run build` - build production assets

### Option B: Run the full platform stack (frontend + CMS + DB)

```bash
cd techderby-platform
cp .env.example .env
docker compose up --build
```

See `techderby-platform/README.md` for platform-specific details.

## Environment and Deployments

Branch to environment mapping:

- `develop` -> https://dev.techderby.org
- `uat` -> https://test.techderby.org
- `main` -> https://techderby.org

Deployment for hosted environments is automated through GitHub Actions and Docker images.

## Contributing Guide

### 1) Set up your fork and local branch

```bash
git clone https://github.com/YOUR-USERNAME/techderby-webapp.git
cd techderby-webapp
git remote add upstream https://github.com/techderby/techderby-webapp.git
git fetch upstream
```

Create a branch from the active integration branch used by maintainers (typically `develop`):

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/short-description
```

### 2) Make changes in the correct project area

- Root website UI work: edit under `src/`, `styles/`, and related root files.
- Platform work: edit under `techderby-platform/frontend` or `techderby-platform/cms`.

### 3) Validate before opening a PR

Run whichever checks apply to your changes:

```bash
# Root app
npm run build

# Platform frontend
cd techderby-platform/frontend
npm install
npm run lint
npm run test
npm run build
```

If you changed CMS behavior, also verify the `techderby-platform` Docker stack boots successfully.

### 4) Commit and push

```bash
git add .
git commit -m "feat: clear summary of change"
git push origin feature/short-description
```

### 5) Open a Pull Request

- Open PR to the same integration branch you branched from (usually `develop`).
- Describe what changed, why, and how it was tested.
- Include screenshots for UI updates.
- Link relevant issues/tasks.

## Contributor Checklist

- Scope is focused and avoids unrelated refactors.
- Build/tests pass for affected areas.
- New env vars, scripts, or setup steps are documented.
- UI changes include responsive checks (desktop + mobile).
- PR description includes verification steps.

## Additional Docs

- Platform docs: `techderby-platform/README.md`
- Team notes: `guidelines/Guidelines.md`
