# Tech Derby — Makefile
# Usage: make <target>  e.g.  make dev-up  or  make prod-deploy

.PHONY: help \
        dev-up dev-down dev-logs dev-restart \
        test-up test-down test-logs test-restart \
        prod-up prod-down prod-logs prod-restart \
        caddy-up caddy-down caddy-reload \
        setup-vps

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "Tech Derby — available make targets"
	@echo ""
	@echo "  Local development"
	@echo "    make local-up        Start local dev stack (docker-compose.yml)"
	@echo "    make local-down      Stop local dev stack"
	@echo ""
	@echo "  Dev environment  (dev.techderby.org)"
	@echo "    make dev-up          Build & start dev stack"
	@echo "    make dev-down        Stop dev stack"
	@echo "    make dev-logs        Tail dev logs"
	@echo "    make dev-restart     Rebuild & restart dev stack"
	@echo ""
	@echo "  Test environment  (test.techderby.org)"
	@echo "    make test-up         Build & start test stack"
	@echo "    make test-down       Stop test stack"
	@echo "    make test-logs       Tail test logs"
	@echo "    make test-restart    Rebuild & restart test stack"
	@echo ""
	@echo "  Production  (techderby.org)"
	@echo "    make prod-up         Build & start production stack"
	@echo "    make prod-down       Stop production stack"
	@echo "    make prod-logs       Tail production logs"
	@echo "    make prod-restart    Rebuild & restart production stack"
	@echo ""
	@echo "  Caddy"
	@echo "    make caddy-up        Start Caddy reverse proxy"
	@echo "    make caddy-down      Stop Caddy"
	@echo "    make caddy-reload    Reload Caddyfile without downtime"
	@echo ""
	@echo "  VPS"
	@echo "    make setup-vps       First-time VPS setup guide"
	@echo ""

# ── Local development ─────────────────────────────────────────────────────────
local-up:
	cd techderby-platform && docker compose up -d --build

local-down:
	cd techderby-platform && docker compose down

# ── Dev environment ───────────────────────────────────────────────────────────
dev-up:
	cd techderby-platform && \
	docker compose -f docker-compose.dev.yml --env-file .env.dev --project-name techderby-dev up -d --build

dev-down:
	cd techderby-platform && \
	docker compose -f docker-compose.dev.yml --project-name techderby-dev down

dev-logs:
	cd techderby-platform && \
	docker compose -f docker-compose.dev.yml --project-name techderby-dev logs -f

dev-restart:
	$(MAKE) dev-down
	$(MAKE) dev-up

# ── Test environment ──────────────────────────────────────────────────────────
test-up:
	cd techderby-platform && \
	docker compose -f docker-compose.test.yml --env-file .env.test --project-name techderby-test up -d --build

test-down:
	cd techderby-platform && \
	docker compose -f docker-compose.test.yml --project-name techderby-test down

test-logs:
	cd techderby-platform && \
	docker compose -f docker-compose.test.yml --project-name techderby-test logs -f

test-restart:
	$(MAKE) test-down
	$(MAKE) test-up

# ── Production ────────────────────────────────────────────────────────────────
prod-up:
	cd techderby-platform && \
	docker compose -f docker-compose.prod.yml --env-file .env.prod --project-name techderby-prod up -d --build

prod-down:
	cd techderby-platform && \
	docker compose -f docker-compose.prod.yml --project-name techderby-prod down

prod-logs:
	cd techderby-platform && \
	docker compose -f docker-compose.prod.yml --project-name techderby-prod logs -f

prod-restart:
	$(MAKE) prod-down
	$(MAKE) prod-up

# ── Caddy ─────────────────────────────────────────────────────────────────────
caddy-up:
	cd techderby-platform && docker compose -f docker-compose.caddy.yml up -d

caddy-down:
	cd techderby-platform && docker compose -f docker-compose.caddy.yml down

caddy-reload:
	docker exec techderby-caddy caddy reload --config /etc/caddy/Caddyfile

# ── VPS first-time setup ──────────────────────────────────────────────────────
setup-vps:
	@echo ""
	@echo "=== VPS First-Time Setup ==="
	@echo ""
	@echo "1. SSH into your Hetzner VPS and run:"
	@echo "     apt update && apt install -y docker.io docker-compose-plugin git make"
	@echo "     systemctl enable --now docker"
	@echo ""
	@echo "2. Clone the repo:"
	@echo "     git clone git@github.com:<your-org>/techderby.git /opt/techderby"
	@echo "     cd /opt/techderby"
	@echo ""
	@echo "3. Create environment files (never commit these):"
	@echo "     cp techderby-platform/.env.dev.example  techderby-platform/.env.dev"
	@echo "     cp techderby-platform/.env.test.example techderby-platform/.env.test"
	@echo "     cp techderby-platform/.env.prod.example techderby-platform/.env.prod"
	@echo "     # Edit each file and replace all CHANGE_ME values"
	@echo ""
	@echo "4. Point DNS A records to this server IP:"
	@echo "     techderby.org        →  <VPS IP>"
	@echo "     www.techderby.org    →  <VPS IP>"
	@echo "     cms.techderby.org    →  <VPS IP>"
	@echo "     test.techderby.org   →  <VPS IP>"
	@echo "     cms-test.techderby.org → <VPS IP>"
	@echo "     dev.techderby.org    →  <VPS IP>"
	@echo "     cms-dev.techderby.org  → <VPS IP>"
	@echo ""
	@echo "5. Start Caddy first:"
	@echo "     make caddy-up"
	@echo ""
	@echo "6. Start each environment:"
	@echo "     make dev-up"
	@echo "     make test-up"
	@echo "     make prod-up"
	@echo ""
	@echo "7. Add GitHub secrets (Settings → Secrets → Actions):"
	@echo "     VPS_HOST       → <VPS IP>"
	@echo "     VPS_USER       → ubuntu (or root)"
	@echo "     VPS_SSH_KEY    → contents of ~/.ssh/id_ed25519 (private key)"
	@echo "     VPS_PORT       → 22"
	@echo ""
	@echo "Branch → environment mapping:"
	@echo "     develop  →  dev.techderby.org"
	@echo "     staging  →  test.techderby.org"
	@echo "     main     →  techderby.org"
	@echo ""
