# TechDerby

This is the Tech Derby community platform — a full-stack web application for Tech Derby, driving tech innovation in Derby, UK.

## What's in this repo

| Folder | Purpose |
|--------|---------|
| `techderby-platform/` | **Main platform** — React frontend, Strapi CMS, PostgreSQL, Docker |
| `src/` | Design-system prototype (Figma import reference only) |

## Quick start

See [`techderby-platform/README.md`](techderby-platform/README.md) for full setup and deployment instructions.

```bash
cd techderby-platform
cp .env.example .env
docker compose up --build
```

## CI/CD

Automated deployments via GitHub Actions:

| Branch | Deploys to |
|--------|------------|
| `develop` | https://dev.techderby.org |
| `uat` | https://test.techderby.org |
| `main` | https://techderby.org |

## Contributing

Fork this repo, branch off `develop`, make your changes, and open a Pull Request back to `develop`.
See [`techderby-platform/README.md`](techderby-platform/README.md) for the full contributing workflow.
