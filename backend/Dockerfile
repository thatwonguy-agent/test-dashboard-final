FROM node:20-alpine

WORKDIR /app

# Create directories for data and logs
RUN mkdir -p /app/data /app/logs

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Start
CMD ["node", "server.js"]
