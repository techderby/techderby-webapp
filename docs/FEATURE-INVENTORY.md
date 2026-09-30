# Feature Inventory

This document summarizes implemented product capabilities based on current routes, APIs, and workflow files.

## 1) Public Website and Content Features

Implemented in `techderby-platform/frontend/src/router/routes.tsx` and CMS content APIs.

- Public content pages: Home, About, Programmes, Partners, Contact, policies, accessibility, safeguarding.
- Events:
  - Event listing and event detail routes
  - Event browsing/registration route (`/events/browse`)
  - Tech Derby Summit route (`/summit-2026`)
- Insights:
  - Listing (`/insights`)
  - Detail (`/insights/:slug`)
- Community pages:
  - Public member directory route (`/directory`)
  - Community page (`/community`)
  - Membership and get involved pages

## 2) Authentication and Profile Features

Implemented in frontend route definitions and CMS profile API.

- Frontend auth pages:
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/reset-password`
- JWT-based session handling on API calls in `techderby-platform/frontend/src/lib/api.ts`.
- Profile APIs in `techderby-platform/cms/src/api/profile`:
  - register user
  - forgot/reset password
  - get/update profile
  - avatar upload

## 3) Member Community Features

Implemented in CMS custom APIs and dashboard routes.

- Protected dashboard area:
  - `/dashboard`
  - `/dashboard/profile`
  - `/dashboard/directory`
  - `/dashboard/connections`
  - `/dashboard/messages`
- Connection workflows:
  - send request
  - accept/reject request
  - remove connection
- Messaging workflows:
  - inbox view
  - conversation by user
  - send message
  - read tracking (`readAt`) on message retrieval
- Member directory API with visibility control:
  - public and non-admin users only see `isVisible=true` users
  - admin/super-admin can see all users

## 4) Mailing List and Event Notification Features

Implemented in CMS mailing list and event lifecycle handlers.

- Mailing list subscription endpoint (`POST /api/mailing-list-subscriptions`)
- CSV export endpoint with scoped API token auth (`GET /api/mailing-list-subscriptions/export`)
- Event publish lifecycle notification:
  - sends email to subscribers when event is first published
  - avoids duplicate sends using `mailingListNotifiedAt`

## 5) Form Notification Features

Implemented in `techderby-platform/cms/src/api/notify` and frontend pages.

- Backend email notification endpoint: `POST /api/notify`
- Frontend triggers for selected form submissions.
- Optional WhatsApp notification via CallMeBot from frontend utility:
  - `techderby-platform/frontend/src/lib/whatsapp.ts`

## 6) Operational Features

- Containerized local dev stack (`techderby-platform/docker-compose.yml`)
- Environment-specific image-based deployment compose files:
  - dev (`docker-compose.images.dev.yml`)
  - uat (`docker-compose.images.uat.yml`)
  - prod (`docker-compose.images.yml`)
- Reverse proxy and TLS via Caddy (`docker-compose.caddy.yml` + `docker/Caddyfile`)
