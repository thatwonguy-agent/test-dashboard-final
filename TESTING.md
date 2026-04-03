# Testing Guide

## Quick Start

```bash
# 1. Build and start
docker compose up --build -d

# 2. Wait for containers
sleep 10

# 3. Check status
docker compose ps

# 4. View logs
docker compose logs -f

# 5. Test backend
curl http://localhost:8080/api/health

# 6. Test login
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"demo123"}'

# 7. Access frontend
open http://localhost:3000

# 8. Cleanup when done
docker compose down -v
```

## Log Locations

### Backend Logs
```bash
# View live logs
docker compose logs -f backend

# Access log files inside container
docker exec amazing-dashboard-backend-1 cat /app/logs/server.log
docker exec amazing-dashboard-backend-1 cat /app/logs/errors.log
```

### Frontend Logs
```bash
docker compose logs -f frontend
```

## Test Checklist

### Backend Tests
- [ ] Health endpoint responds: `GET /api/health`
- [ ] Login works with admin/demo123
- [ ] JWT token returned on login
- [ ] Protected endpoints require auth
- [ ] Database initialized with seed data
- [ ] Logs written to /app/logs/

### Frontend Tests
- [ ] Page loads at http://localhost:3000
- [ ] Login form renders
- [ ] Can login with admin/demo123
- [ ] Dashboard displays after login
- [ ] Charts render correctly
- [ ] Dark/Light mode toggle works
- [ ] User list displays
- [ ] Activity log shows

### Integration Tests
- [ ] Frontend can call backend API
- [ ] CORS configured correctly
- [ ] JWT stored in localStorage
- [ ] Protected routes redirect to login

## Common Issues

### Frontend Not Loading
```bash
# Check if production build
docker compose logs frontend | grep "Compiled successfully"

# Rebuild
docker compose up --build frontend -d
```

### Backend Database Error
```bash
# Check data directory
docker exec amazing-dashboard-backend-1 ls -la /app/data/

# Check logs
docker compose logs backend | grep "Database"
```

### Login Fails
```bash
# Test API directly
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"demo123"}'

# Check backend logs
docker compose logs backend | grep "Login"
```

## Security Testing

### Check for Exposed Secrets
```bash
# Scan code for secrets
grep -r "password.*=.*['\"]" --include="*.js" . | grep -v node_modules
grep -r "api[_-]*key" --include="*.js" . | grep -v node_modules
grep -r "AKIA" . | grep -v node_modules
```

### Verify Environment Variables
```bash
# Check .gitignore
cat .gitignore | grep env

# Ensure no .env committed
ls -la | grep "\.env"
```

## Cleanup

```bash
# Stop containers
docker compose down

# Remove volumes (clears database)
docker compose down -v

# Remove images
docker rmi amazing-dashboard-backend amazing-dashboard-frontend

# Remove all
docker compose down -v --rmi all
```

## Resource Usage

```bash
# Check container resource usage
docker stats --no-stream amazing-dashboard-backend-1 amazing-dashboard-frontend-1

# Check disk usage
docker system df
```

## After Testing

**IMPORTANT:** Always clean up after testing on limited resource machines!

```bash
# Full cleanup
cd amazing-dashboard
docker compose down -v
docker system prune -f
```

## GitHub Actions

CI/CD pipeline runs automatically on:
- Push to master/main
- Pull requests

Tests include:
1. Security scan for exposed secrets
2. Backend syntax check
3. Frontend build
4. Docker build
5. Container health checks
6. Integration tests

View workflow runs: https://github.com/thatwonguy-agent/amazing-dashboard/actions
