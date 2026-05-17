# Git Branching Strategy

This strategy aligns with the currently configured deployment workflows.

## 1) Active Long-Lived Branches

- `dev`: active development integration branch; auto-deploys to dev environment
- `uat`: pre-production validation branch; auto-deploys to test/UAT environment
- `main`: production branch; auto-deploys to production

## 2) Feature Branching Model

Create short-lived branches from `dev`:

- `feature/<short-topic>`
- `fix/<short-topic>`
- `chore/<short-topic>`

Example:

- `feature/member-directory-filters`

## 3) Promotion Path

1. feature/fix/chore -> dev
2. dev -> uat
3. uat -> main

This keeps risk progressively lower as changes move toward production.

## 4) Pull Request Standards

Each PR should include:

- clear problem statement and implementation summary
- test/validation notes
- screenshots or video for UI changes
- migration/config impact notes when applicable

## 5) Commit Message Convention

Use concise conventional-style messages:

- `feat: add members directory search`
- `fix: prevent duplicate event publish emails`
- `chore: update docker image tags`
- `docs: add architecture onboarding docs`

## 6) Hotfix Strategy

For urgent production fixes:

1. branch from `main` using `hotfix/<topic>`
2. open PR to `main`
3. after release, back-merge to `uat` and `dev` to prevent branch drift

## 7) Branch Protection Recommendations

Recommended safeguards in GitHub:

- require PR reviews for `dev`, `uat`, `main`
- require CI status checks before merge
- block direct pushes to protected branches
- optionally require approvals for `main` environment deployment

## 8) Naming and Ownership Guidance

- one feature per branch
- keep PR scope small and reviewable
- assign an owner/reviewer early for high-impact changes
