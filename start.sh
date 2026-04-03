#!/bin/bash
# Amazing Dashboard - Docker Setup

set -e

echo "🚀 Starting Amazing Dashboard..."

# Build and run with Docker Compose
docker-compose up --build -d

echo "✅ Dashboard is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔐 Backend: http://localhost:8080"
echo ""
echo "🔑 Default login:"
echo "   Username: admin"
echo "   Password: demo123"
echo ""
echo "📊 Features:"
echo "   • Real-time analytics dashboard"
echo "   • Interactive charts and graphs"
echo "   • User management system"
echo "   • Data visualization"
echo "   • Responsive design"
echo "   • Dark/Light mode toggle"
echo ""
echo "🎨 Tech Stack:"
echo "   • React + TypeScript"
echo "   • Tailwind CSS"
echo "   • Recharts for data visualization"
echo "   • Express.js API"
echo "   • SQLite (local database)"
echo ""
echo "Press Ctrl+C to stop all services"
