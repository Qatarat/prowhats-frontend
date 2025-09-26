FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source
COPY . .

# Build the Next.js app
RUN npm run build


FROM node:18-alpine AS runner

WORKDIR /app

# Copy package.json and lock file
COPY --from=builder /app/package*.json ./

# Copy built Next.js app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Copy optional next.config.* from builder if exists
RUN set -eux; \
    for f in next.config.*; do \
        if [ -f "/app/$f" ]; then \
            cp "/app/$f" ./; \
            fi; \
        done

COPY --from=builder /app/next.config.* ./

# Environment
ENV NODE_ENV=Production
ENV PORT=3001
ENV NEXT_PUBLIC_API_URL=https://stage-api-ihsan-ai.prowhats.com/api/v1

# Expose the port
EXPOSE 3001

# Start Next.js
CMD ["npm", "start"]
    