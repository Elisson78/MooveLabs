# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependências
RUN npm ci

# Gera Prisma Client
RUN npx prisma generate

# Copia código fonte
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copia apenas o necessário
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Expõe porta
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/api || exit 1

# Comando para iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]

