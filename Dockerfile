# Stage 1: Build
FROM node:18-alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Next.js telemetry disable
ENV NEXT_TELEMETRY_DISABLED 1

# Build the app
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built artifacts from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and engine to run migrations / access sqlite
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Ensure database file exists and is writable
RUN touch ./dev.db && chown nextjs:nodejs ./dev.db

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Note: server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
