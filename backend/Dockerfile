###############################################
# Build stage
###############################################
# Usamos imagem Debian (não Alpine) para evitar problemas
# de compatibilidade do Prisma com libssl/glibc.
FROM node:20 AS builder

WORKDIR /app

# Dependências de sistema necessárias para Prisma (OpenSSL, etc.)
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

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

###############################################
# Production stage
###############################################
FROM node:20 AS production

WORKDIR /app

# Dependências de sistema necessárias para o Prisma em produção
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates wget && \
    rm -rf /var/lib/apt/lists/*

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

##############################
# Comando para iniciar
##############################
# Observação:
# - O Nest está configurado para compilar os arquivos dentro de "dist/src"
#   (veja "dist/src/main.js"), por isso apontamos explicitamente para esse caminho.
# - As migrations do Prisma NÃO são executadas automaticamente aqui. Elas devem
#   ser aplicadas via job/CI separado (por exemplo, usando "prisma migrate deploy").
CMD ["node", "dist/src/main.js"]

