# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Argumento para API URL (usado no build do Vite)
ARG VITE_API_URL=https://api.moovelabs.com/api
ENV VITE_API_URL=$VITE_API_URL

# Copia package files
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia código fonte
COPY . .

# Build
RUN npm run build

# Production stage - serve com nginx
FROM nginx:alpine AS production

# Copia build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia config do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
