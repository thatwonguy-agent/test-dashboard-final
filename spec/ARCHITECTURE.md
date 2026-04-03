# Architecture

<!-- AGENT: Fill in this section before writing any code. -->
<!-- Describe exact stack, files, and what each does. -->
<!-- scripts/validate-architecture.py reads Required Files section to verify existence. -->

## Stack

<!-- Example:
- Runtime: Node.js 20
- Frontend: Vanilla HTML/CSS/JS
- Backend: Express.js
- Database: Supabase (Postgres)
- Payments: Stripe
- Analytics: PostHog
- Notifications: Telegram bot
- Hosting: GitHub Pages (public repos only)
-->

[DEFINE YOUR STACK HERE]

## Required Files

<!-- Format: `path/to/file` — description -->
<!-- CI will verify each listed file exists -->

- `README.md` — human-facing docs
- `spec/GOAL.md` — source of truth
- `spec/SUCCESS.md` — pass/fail criteria
- `spec/CONSTRAINTS.md` — hard rules
- `spec/ARCHITECTURE.md` — this file
- `spec/STATUS.md` — auto-updated by CI
- `spec/AGENT-INSTRUCTIONS.md` — DGX→GitHub boundary rules and pre-push checklist
- `.github/workflows/ci.yml` — CI/CD pipeline
- `.gitignore` — ignore patterns

<!-- Add your project-specific files below: -->
<!-- - `index.html` — landing page -->
<!-- - `server.js` — Express backend -->
<!-- - `package.json` — dependencies -->

## Data Flow

<!-- Describe how data moves through the system -->

[DEFINE DATA FLOW HERE]

## External Services

<!-- List ONLY the services this repo is allowed to use -->
<!-- Any service not listed here is a constraint violation -->

- GitHub Actions (CI/CD)
- Telegram (notifications via TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
