# CI/CD and Release Strategy

This document describes the current CI and deployment implementation in `.github/workflows`.

## 1) Workflow Inventory

- `ci.yml`:
  - runs on push and pull request to all branches
  - frontend checks: install, type-check, lint, test
  - CMS check: install and build
- `deploy-dev.yml`:
  - builds and deploys dev environment
- `deploy-test.yml`:
  - builds and deploys UAT environment
- `deploy-prod.yml`:
  - builds and deploys production environment

## 2) CI Strategy

Current CI is verification-focused:

- Frontend quality gate:
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm test`
- CMS build gate:
  - installs dependencies on Linux runner
  - runs `npm run build` for Strapi

This catches frontend regressions and confirms backend buildability before release branches are promoted.

## 3) Deployment Strategy

Deployments are image-based and server-pull driven.

1. GitHub Actions checks out code.
2. Frontend and CMS images are built with Docker and pushed to Docker Hub.
3. Workflow copies compose/Caddy files to VPS.
4. Workflow writes environment file from GitHub secret payload.
5. VPS runs compose pull and compose up against environment-specific compose files.
6. Old images are pruned.

Key property: server does not need a full repository clone for each deployment.

## 4) Branch-to-Deployment Mapping (Current Workflow Triggers)

- `dev` branch -> `deploy-dev.yml` -> dev environment
- `uat` branch -> `deploy-test.yml` -> test/UAT environment
- `main` branch -> `deploy-prod.yml` -> production

Note:
Some earlier docs referenced `develop`; current workflow trigger is `dev` for development deployment.

## 5) Container/Image Tagging Convention

- Dev images tagged with `dev-<short_sha>` plus `dev-latest`
- UAT images tagged with `uat-<short_sha>` plus `uat-latest`
- Production images tagged with `<short_sha>` plus `latest`

## 6) Secrets and Environment Inputs

Deployment uses GitHub secrets for:

- Docker Hub auth
- target server connection (host/user/key)
- runtime env file contents
- frontend build arg for CallMeBot API key

Avoid putting sensitive values in committed files. Store and rotate secrets via GitHub repository/environment secrets.

## 7) Release Flow

Current release cadence expectation:

1. Merge features to dev
2. Validate in dev deployment
3. Promote to uat
4. Validate UAT
5. Promote to main for production

## 8) Rollback Options

Recommended operational rollback pattern:

- redeploy previous known-good image tag via env file `IMAGE_TAG`
- run compose up for target environment
- verify health endpoints and UI smoke checks

Because images are immutable and tagged by commit SHA, rollback can be fast if previous tags are retained.
