# Multi-stage Dockerfile for Payment Service (With Prisma)

# Stage 1: Base image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# Stage 2: Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
COPY services/payment-service/package.json ./services/payment-service/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

# Stage 3: Build shared package
FROM base AS build-shared
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY packages/shared ./packages/shared
WORKDIR /app/packages/shared
RUN npm run build

# Stage 4: Generate Prisma Client
FROM base AS prisma
COPY --from=deps /app/node_modules ./node_modules
COPY services/payment-service/prisma ./services/payment-service/prisma
WORKDIR /app/services/payment-service
RUN npx prisma generate

# Stage 5: Build service
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build-shared /app/packages/shared ./packages/shared
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY services/payment-service ./services/payment-service
COPY tsconfig.json ./
WORKDIR /app/services/payment-service
RUN npm run build

# Stage 6: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9019

RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder --chown=appuser:nodejs /app/services/payment-service/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/services/payment-service/package.json ./
COPY --from=builder --chown=appuser:nodejs /app/services/payment-service/prisma ./prisma
COPY --from=deps --chown=appuser:nodejs /app/node_modules ./node_modules

USER appuser

EXPOSE 9019

CMD ["node", "dist/index.js"]
