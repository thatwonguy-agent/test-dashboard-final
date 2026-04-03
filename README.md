# 🚀 Test Dashboard

A stunning, fully-functional analytics dashboard built with modern technologies. Experience the future of data visualization.

![Status](https://img.shields.io/badge/Status-Production-ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node](https://img.shields.io/badge/Node.js-20.0.0-green)
![Docker](https://img.shields.io/badge/Docker-Latest-blue)
![CI/CD](https://github.com/thatwonguy-agent/test-dashboard-final/actions/workflows/ci.yml/badge.svg)

## ✨ Features

- 🎨 **Glass Morphism UI** - Modern, translucent design with gradient effects
- 📊 **Real-time Analytics** - Interactive charts with live data updates
- 🔐 **JWT Authentication** - Secure login with token-based auth
- 👥 **User Management** - Full CRUD operations for user accounts
- 📤 **Export to CSV** - Download analytics data (NEW!)
- 🌙 **Dark/Light Mode** - Toggle between themes instantly
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 🐳 **Docker Ready** - One-command deployment with docker-compose
- 🔄 **CI/CD Pipeline** - Automated testing and deployment

## 🛠️ Tech Stack

### Frontend
- React 18.2.0
- Tailwind CSS
- Recharts (data visualization)
- Axios (HTTP client)
- React Router

### Backend
- Node.js 20
- Express.js
- better-sqlite3 (SQLite database)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)

### Infrastructure
- Docker + Docker Compose
- GitHub Actions (CI/CD)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### 1. Clone the Repository

```bash
git clone https://github.com/thatwonguy-agent/test-dashboard.git
cd test-dashboard
```

### 2. Run with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the Dashboard

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080

### 4. Login

**Default Credentials:**
- Username: `admin`
- Password: `demo123`

## 📁 Project Structure

```
test-dashboard/
├── backend/              # Node.js Express API
│   ├── server.js        # Main application
│   ├── package.json     # Dependencies
│   └── Dockerfile       # Backend container
├── frontend/            # React SPA
│   ├── src/            # React components
│   ├── public/         # Static assets
│   ├── package.json    # Dependencies
│   └── Dockerfile      # Frontend container
├── spec/               # Project specifications
│   ├── GOAL.md         # Project goal
│   ├── SUCCESS.md      # Success metrics
│   ├── CONSTRAINTS.md  # Technical constraints
│   ├── ARCHITECTURE.md # System architecture
│   └── STATUS.md       # Auto-updated by CI
├── scripts/            # Utility scripts
│   ├── validate-architecture.js
│   └── validate-constraints.js
├── docker-compose.yml  # Service orchestration
├── .github/            # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml      # CI/CD pipeline
└── README.md          # This file
```

## 🧪 Testing

### Local Testing

```bash
# Backend
cd backend
npm install
npm test

# Frontend
cd frontend
npm install
npm run build
```

### Docker Testing

```bash
# Build and run
docker-compose build
docker-compose up

# Test health endpoints
curl http://localhost:8080/api/health
curl http://localhost:3000

# Cleanup
docker-compose down -v
```

## 🔒 Security

- ✅ No hardcoded secrets
- ✅ JWT_SECRET from environment variables
- ✅ .env files excluded from git
- ✅ Security scans in CI/CD
- ✅ Password hashing with bcryptjs

## 📊 Sample Data

The dashboard includes realistic sample data:
- **Total Users:** 1,247
- **Active Users:** 892
- **Revenue:** $45,678
- **Conversion Rate:** 3.2%
- **Page Views:** 89,234

## 🔄 CI/CD Pipeline

This repository uses a spec-driven development workflow:

1. **validate-spec** - Ensures spec/ directory is complete
2. **security-scan** - Scans for exposed secrets
3. **backend-tests** - Runs backend tests
4. **frontend-build** - Builds React app
5. **docker-build** - Tests Docker containers
6. **update-status** - Auto-updates spec/STATUS.md

**View CI/CD Status:** https://github.com/thatwonguy-agent/test-dashboard/actions

## 📝 Development Workflow

### 1. Read spec/GOAL.md First

Always start by reading the project goal before making changes.

### 2. Create Feature Branch

```bash
git checkout -b feature/description
```

### 3. Make Changes

Write code, update docs, ensure tests pass.

### 4. Push & Create PR

```bash
git push origin feature/description
gh pr create --base main --head feature/description
```

### 5. Wait for CI Feedback

- Check Gmail for CI pass/fail notifications
- If failed: read error, fix, push again
- If passed: merge the PR

### 6. Monitor spec/STATUS.md

CI automatically updates this file after successful deployments.

## 🐛 Troubleshooting

### Database Issues

```bash
# Reset database volume
docker-compose down -v
docker-compose up -d
```

### Build Failures

```bash
# Clean build
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Port Conflicts

```bash
# Check what's using ports
lsof -i :3000
lsof -i :8080

# Kill processes
kill -9 <PID>
```

## 📚 Documentation

- **GOAL.md** - Project objectives and success criteria
- **ARCHITECTURE.md** - System design and components
- **TESTING.md** - Comprehensive testing guide
- **CI-CD-SUMMARY.md** - Pipeline documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run validation scripts
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built by Omar Agent** - AI assistant on local sovereign stack 🎯

*Following spec-driven development workflow from agent-template*
