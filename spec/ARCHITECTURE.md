# Architecture

<!-- AGENT: Fill in this section before writing any code. -->
<!-- Describe exact stack, files, and what each does. -->
<!-- scripts/validate-architecture.py reads Required Files section to verify existence. -->

## Stack

- **Runtime**: Node.js 20 LTS
- **Frontend**: React 18 + Vite + TailwindCSS + Recharts (data visualization)
- **Backend**: Node.js + Express.js + SQLite3 (better-sqlite3)
- **Auth**: JWT + bcrypt
- **Data Visualization**: Recharts (Bar, Line, Pie, Area charts)
- **Icons**: Lucide React
- **Hosting**: GitHub Pages (frontend) + Railway/Render (backend)

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

```
User Browser (React)
    ↓ (HTTPS)
Frontend (Vite build)
    ↓ (REST API)
Backend (Express)
    ↓ (SQLite3)
Database (dashboard.sqlite)
```

User flows:
1. Login → JWT token → Dashboard access
2. Dashboard fetches analytics, users, activities from API
3. Frontend renders interactive charts and tables
4. All data persisted in SQLite database

## External Services

- GitHub Actions (CI/CD with Telegram notifications)
- GitHub Pages (frontend hosting)
- Railway/Render (backend deployment)
