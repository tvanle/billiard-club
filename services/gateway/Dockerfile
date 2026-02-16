# Multi-stage Dockerfile for Gateway (No Prisma)

# Stage 1: Base image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Stage 2: Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
COPY services/gateway/package.json ./services/gateway/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

# Stage 3: Build shared package
FROM base AS build-shared
COPY --from=deps /app/node_modules ./node_modules
COPY packages/shared ./packages/shared
WORKDIR /app/packages/shared
RUN npm run build

# Stage 4: Build Gateway
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build-shared /app/packages/shared ./packages/shared
COPY services/gateway ./services/gateway
COPY tsconfig.json ./
WORKDIR /app/services/gateway
RUN npm run build

# Stage 5: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9001

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/services/gateway/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/services/gateway/package.json ./
COPY --from=deps --chown=appuser:nodejs /app/node_modules ./node_modules

USER appuser

EXPOSE 9001

CMD ["node", "dist/index.js"]
