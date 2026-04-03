# Constraints

<!-- Hard rules. Agent cannot violate these. CI enforces them. -->
<!-- scripts/validate-constraints.py checks this file on every push. -->

## Security (Non-Negotiable)

- NO hardcoded secrets, API keys, tokens, or passwords in any file
- NO .env files committed to the repo
- NO node_modules/ committed to the repo
- NO AWS access keys (AKIA...) in any file
- NO GitHub tokens (ghp_...) in any file
- NO private keys (BEGIN PRIVATE KEY) in any file

## Repository Rules

- .gitignore MUST include: node_modules/, .env, .env.local, *.log, .DS_Store, dist/, build/
- All secrets MUST come from GitHub org-level secrets (or repo-level for private repos)
- spec/ directory MUST exist and be complete before any code is written

## Free Plan Limitations (GitHub Free Orgs)

- GitHub Pages: ONLY works for PUBLIC repositories — skip deploy step for private repos
- Org-level secrets: ONLY accessible by PUBLIC repositories
  → Private repos must use repo-level secrets instead
- GitHub Actions: 2,000 minutes/month for private repos (unlimited for public)
- Max 3 external collaborators on private repos

## Code Quality

- No external APIs beyond what is listed in spec/ARCHITECTURE.md
- No backwards-compatibility shims or feature flags unless required
- No over-engineering: minimum complexity for current task only

## Agent Workflow (Enforced by CI)

1. Read spec/GOAL.md FIRST — always
2. Plan code to meet the Goal
3. Write code
4. Push → CI validates spec → build → deploy
5. Read CI result; if failed re-read spec and fix deviation
6. Never skip step 1
