# Tech Derby CMS

Strapi v5 backend for Tech Derby.

## Content APIs

| Endpoint | Description |
|----------|-------------|
| `GET /api/posts` | Wire / blog posts |
| `GET /api/events` | Events (Tech Derby + community) |
| `GET /api/partners` | Partner organisations |
| `GET /api/programmes` | Programmes |
| `GET /api/members` | Member directory |
| `GET /api/speakers` | Speaker profiles |
| `POST /api/mailing-list-subscriptions` | Subscribe to mailing list |
| `GET /api/mailing-list-subscriptions/export` | CSV export (token-protected) |

### Event model extras
- `eventSource`: `tech-derby` or `other`
- `agendaItems`: JSON array
- `speakerCards`: JSON array
- `mailingListNotifiedAt`: datetime — prevents duplicate publish emails

## Local setup

Run via Docker from the platform root (recommended):

```bash
cd techderby-platform
docker compose up --build
```

Or run standalone:

```bash
cd cms
npm install
npm run develop
```

Strapi admin: http://localhost:1337/admin

## Environment variables

For local development, variables are inherited from the root `.env` via Docker Compose.
For standalone, create `cms/.env` (see root `.env.example` for all required keys).

## Public permissions

`cms/src/index.ts` bootstraps Strapi on startup to grant the Public role `find` and `findOne` on `api::post.post`, so the Wire page works without authentication.
```

## Permissions and Tokens

### Public role

Enable in `Settings > Users & Permissions > Roles > Public`:
- `find` and `findOne` for Events, Partners, Insights, Programmes
- `create` for Mailing List Subscriptions

### API token for CSV export

Create in `Settings > API Tokens` with scope:
- `api::mailing-list-subscription.mailing-list-subscription.exportCsv`

Example export command:

```bash
curl -L "http://localhost:1337/api/mailing-list-subscriptions/export" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -o mailing-list-subscriptions.csv
```

For full platform context, see `techderby-platform/README.md`.
