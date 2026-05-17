# External Integrations

This document lists key third-party and external platform integrations currently used in the repository.

## 1) Docker Hub

Purpose:

- stores deployable frontend and CMS images used by environment deployments

Where used:

- `.github/workflows/deploy-dev.yml`
- `.github/workflows/deploy-test.yml`
- `.github/workflows/deploy-prod.yml`

Notes:

- Actions build and push frontend and CMS images
- VPS deployments pull images by tag

## 2) GitHub Actions

Purpose:

- CI checks and automated deployments per branch

Where used:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy-dev.yml`
- `.github/workflows/deploy-test.yml`
- `.github/workflows/deploy-prod.yml`

Notes:

- deployment jobs use SSH and SCP GitHub Actions to execute remote deploys

## 3) VPS Host (SSH/SCP Deployment Target)

Purpose:

- runtime host for containers in dev, uat, and production

Where used:

- deploy workflow SSH/SCP steps

Notes:

- workflows transfer compose/Caddy files
- workflows write environment files from secret content
- workflows run Docker Compose pull/up remotely

## 4) Caddy and Let's Encrypt

Purpose:

- reverse proxy and automatic TLS certificate provisioning

Where used:

- `techderby-platform/docker-compose.caddy.yml`
- `techderby-platform/docker/Caddyfile`

Notes:

- routes domains to environment-specific frontend/CMS ports
- Caddy handles certificate issuance/renewal

## 5) PostgreSQL

Purpose:

- primary relational datastore for Strapi and custom community features

Where used:

- all compose files under `techderby-platform/`
- CMS database config and env variables

## 6) SMTP Email Provider

Purpose:

- sends transactional and internal emails from Strapi

Used for:

- event publish mailing list notifications
- password reset emails
- form notification emails

Where used:

- event lifecycle hook: `techderby-platform/cms/src/api/event/content-types/event/lifecycles.ts`
- notify controller: `techderby-platform/cms/src/api/notify/controllers/notify.ts`
- profile forgot-password controller: `techderby-platform/cms/src/api/profile/controllers/profile.ts`

## 7) CallMeBot WhatsApp API (Optional)

Purpose:

- sends lightweight WhatsApp notifications from frontend form flows

Where used:

- utility: `techderby-platform/frontend/src/lib/whatsapp.ts`
- consumed in pages such as Contact, Membership, and Accelerator Application

Notes:

- requires frontend build-time variable `VITE_CALLMEBOT_API_KEY`
- implementation is fire-and-forget to avoid blocking user flow

## 8) Strapi Users & Permissions Plugin

Purpose:

- auth and user role framework for API protection

Where used:

- profile/auth endpoints
- member directory visibility checks
- connection/messaging authorization checks
- scoped API token auth for CSV export route

## 9) Frontend/CMS API Contract

Purpose:

- typed HTTP client in frontend calls Strapi routes

Where used:

- client: `techderby-platform/frontend/src/lib/api.ts`
- route definitions: `techderby-platform/cms/src/api/**/routes/*.ts`

Key contract areas:

- content retrieval (events, posts, partners, programmes)
- auth/profile management
- community directory/connections/messages
- mailing list subscription and exports
- notify endpoint
