# Multi-stage Dockerfile for Coolify MCP Server
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for TypeScript build)
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcpserver -u 1001

# Set working directory
WORKDIR /app

# Copy built application and dependencies from builder stage
COPY --from=builder --chown=mcpserver:nodejs /app/build ./build
COPY --from=builder --chown=mcpserver:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mcpserver:nodejs /app/package*.json ./

# Switch to non-root user
USER mcpserver

# Expose the port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:8000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default to HTTP server (can be overridden)
CMD ["node", "build/server-http.js"]