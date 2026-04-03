# Agent Template

General-purpose template for AI agent → GitHub product pipelines.
Works for any org or client. Every new repo is generated from this template.

> **Human docs are here. Machine source of truth is in [`spec/`](./spec/).**

---

## Quick Start (Agent Workflow)

```
1. Read spec/GOAL.md FIRST — always
2. Read spec/ARCHITECTURE.md — understand the stack
3. Write code that meets spec/SUCCESS.md criteria
4. Push → CI validates spec → build → deploy
5. Read CI result; if failed re-read spec and fix
6. Never skip step 1
```

---

## Spec Directory (Source of Truth)

| File | Purpose |
|------|---------|
| [`spec/GOAL.md`](./spec/GOAL.md) | Goal + Definition of Done (agent reads first, always) |
| [`spec/SUCCESS.md`](./spec/SUCCESS.md) | Measurable pass/fail criteria CI checks against |
| [`spec/CONSTRAINTS.md`](./spec/CONSTRAINTS.md) | Hard rules agent cannot violate |
| [`spec/ARCHITECTURE.md`](./spec/ARCHITECTURE.md) | Exact stack, files, what each does |
| [`spec/STATUS.md`](./spec/STATUS.md) | Auto-updated by CI after every deploy |

CI enforces: **spec must pass before build, test, or deploy runs.**

---

## CI/CD Pipeline

```
validate-spec  ←── runs FIRST, fails everything if spec/ is broken
     ↓
security-scan
     ↓
lint-and-format
     ↓
unit-tests → integration-tests
     ↓
docker-build → docker-test
     ↓
deploy-to-pages  (public repos only — free plan limitation)
     ↓
notify (Telegram: ✅ pass / ❌ fail / 🔀 PR / 🐛 issue)
```

**Triggers:** Push to `master`/`main`, pull requests, issues opened.

---

## Free Plan Limitations (thatwonguy-agent org)

| Feature | Free Plan |
|---------|-----------|
| GitHub Pages | **Public repos only** |
| Org-level secrets | **Public repos only** — private repos use repo-level secrets |
| Actions minutes | 2,000 min/month (private) / unlimited (public) |
| Template repos | ✅ All plans |
| Creating repos from template | ✅ All plans |

**Implication:** If a repo is private, the deploy step skips automatically. Use public repos for GitHub Pages sites.

---

## Creating Repos from This Template

```http
POST https://api.github.com/repos/[ORG_NAME]/agent-template/generate
Authorization: Bearer <GH_TOKEN>
Content-Type: application/json

{
  "owner": "[ORG_NAME]",
  "name": "new-repo-name",
  "private": false,
  "include_all_branches": false
}
```

Mark this repo as a template in GitHub Settings → check "Template repository".

---

## Org-Level Secrets

Set in: `github.com/organizations/[ORG_NAME]/settings/secrets/actions`
Visibility: **All repositories**

| Secret | Purpose |
|--------|---------|
| `TELEGRAM_BOT_TOKEN` | Telegram bot token |
| `TELEGRAM_CHAT_ID` | Telegram chat ID |
| `STRIPE_KEY` | Stripe API key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase API key |
| `GMAIL_USER` | Gmail address |
| `GMAIL_APP_PASS` | Gmail app password |
| `POSTHOG_KEY` | PostHog API key |
| `POSTHOG_API_KEY` | PostHog API key |
| `GH_TOKEN` | GitHub PAT |

> **Note:** On the free plan, org secrets are only accessible by **public** repos.
> For private repos, set the same secrets at the repo level.

---

## Structure

```
.
├── spec/
│   ├── GOAL.md           ← agent reads first, always
│   ├── SUCCESS.md        ← CI checks these criteria
│   ├── CONSTRAINTS.md    ← hard rules CI enforces
│   ├── ARCHITECTURE.md   ← stack + required files list
│   └── STATUS.md         ← auto-updated by CI after deploy
├── .github/
│   └── workflows/
│       └── ci.yml        ← full pipeline (spec → build → deploy → notify)
├── scripts/
│   ├── validate-architecture.py  ← reads ARCHITECTURE.md, verifies files exist
│   ├── validate-constraints.py   ← checks for secrets, .env, node_modules, .gitignore
│   └── setup-org-secrets.js      ← helper to configure org secrets
├── .gitignore
└── README.md             ← you are here (human docs only)
```

---

## Git Identity

Set per deployment on the local agent machine:

```bash
git config --global user.name "[AGENT_NAME]"
git config --global user.email "[AGENT_EMAIL]"
```

---

*Generic agent template — adapt per org. See `spec/AGENT-INSTRUCTIONS.md`.*
