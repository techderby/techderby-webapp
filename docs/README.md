# Engineering Documentation Index

This folder is a technical onboarding pack for engineers collaborating on this repository.

## Documents

1. [Build & Handover Document](./BUILD-AND-HANDOVER.md) — start here for a full picture of what was built and how
2. [Feature Inventory](./FEATURE-INVENTORY.md)
3. [Architecture Overview](./ARCHITECTURE-OVERVIEW.md)
4. [CI/CD and Release Strategy](./CICD-AND-RELEASE.md)
5. [Git Branching Strategy](./GIT-BRANCHING-STRATEGY.md)
6. [External Integrations](./EXTERNAL-INTEGRATIONS.md)

## Quick Context

This repository currently includes two distinct code areas:

- Root app: `src/`, `styles/`, root `package.json` (website/design-system-facing app)
- Platform app: `techderby-platform/` (frontend + Strapi CMS + PostgreSQL + Docker deploy stack)

Most production deployment and API-backed functionality currently lives in `techderby-platform/`.
