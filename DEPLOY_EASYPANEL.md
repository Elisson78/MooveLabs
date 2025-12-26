# 🚀 Guia de Deploy no Easypanel - MooveLabs

Este guia explica como fazer o deploy do projeto MooveLabs no Easypanel.

## 📋 Pré-requisitos

1. Conta no Easypanel
2. Repositório no GitHub (já configurado: `Elisson78/MooveLabs`)
3. Docker Hub ou Registry configurado
4. Secrets configurados no GitHub Actions

## 🔧 Configuração no Easypanel

### Opção 1: Deploy via Docker Image (Recomendado)

1. **Acesse o Easypanel** e crie um novo projeto

2. **Adicione o serviço do Site (Next.js)**:
   - Tipo: `Docker`
   - Image: `seu-usuario-docker/moovelabs-site:latest`
   - Port: `3000` (interno) → Mapear para `3001` (externo)
   - Variáveis de Ambiente:
     ```
     NODE_ENV=production
     NEXT_PUBLIC_API_URL=https://api.moovelabs.com
     NEXT_PUBLIC_DASHBOARD_URL=https://app.moovelabs.com
     ```

3. **Adicione o serviço do Backend (NestJS)**:
   - Tipo: `Docker`
   - Image: `seu-usuario-docker/moovelabs-backend:latest`
   - Port: `3002`
   - Variáveis de Ambiente:
     ```
     NODE_ENV=production
     DATABASE_URL=postgresql://user:password@postgres:5432/db_moovelabs
     JWT_SECRET=seu-jwt-secret-aqui
     JWT_REFRESH_SECRET=seu-refresh-secret-aqui
     JWT_EXPIRES_IN=15m
     JWT_REFRESH_EXPIRES_IN=7d
     BACKEND_PORT=3002
     N8N_HOST=http://n8n:5678
     N8N_API_KEY=sua-n8n-api-key
     ```

4. **Adicione o serviço do Dashboard (React)**:
   - Tipo: `Docker`
   - Image: `seu-usuario-docker/moovelabs-dashboard:latest`
   - Port: `80` (interno) → Mapear para `3003` (externo)
   - Variáveis de Ambiente:
     ```
     NODE_ENV=production
     VITE_API_URL=https://api.moovelabs.com
     ```

5. **Adicione o Banco de Dados PostgreSQL**:
   - Tipo: `PostgreSQL`
   - Versão: `16-alpine`
   - Variáveis:
     ```
     POSTGRES_USER=postgres
     POSTGRES_PASSWORD=sua-senha-segura
     POSTGRES_DB=db_moovelabs
     ```

### Opção 2: Deploy via GitHub (Build Automático)

1. **No Easypanel**, crie um novo serviço
2. **Tipo**: `GitHub`
3. **Repositório**: `Elisson78/MooveLabs`
4. **Branch**: `main`
5. **Dockerfile**: `./Dockerfile` (para o site)
6. **Context**: `.` (raiz do projeto)

## 🔄 Atualização Automática

O GitHub Actions está configurado para fazer build automático das imagens Docker quando há push na branch `main`:

- ✅ **Site**: `moovelabs-site:latest`
- ✅ **Backend**: `moovelabs-backend:latest`
- ✅ **Dashboard**: `moovelabs-dashboard:latest`

### Para atualizar no Easypanel:

1. Após o push no GitHub, aguarde o build do GitHub Actions
2. No Easypanel, vá ao serviço correspondente
3. Clique em **"Redeploy"** ou **"Pull latest image"**
4. O serviço será atualizado com a nova versão

## 🌐 Domínios e SSL

No Easypanel, configure:

- **Site**: `moovelabs.com` → Porta 3001
- **API**: `api.moovelabs.com` → Porta 3002
- **Dashboard**: `app.moovelabs.com` → Porta 3003

O Easypanel gerencia automaticamente o SSL via Let's Encrypt.

## 📝 Variáveis de Ambiente Importantes

Certifique-se de configurar todas as variáveis necessárias:

### Site (Next.js)
- `NEXT_PUBLIC_API_URL` - URL da API
- `NEXT_PUBLIC_DASHBOARD_URL` - URL do Dashboard

### Backend (NestJS)
- `DATABASE_URL` - String de conexão do PostgreSQL
- `JWT_SECRET` - Secret para tokens JWT
- `JWT_REFRESH_SECRET` - Secret para refresh tokens
- `N8N_API_KEY` - Chave da API do n8n (se usar)

### Dashboard (React)
- `VITE_API_URL` - URL da API

## 🔍 Verificação do Deploy

Após o deploy, verifique:

1. ✅ Site acessível em `https://moovelabs.com`
2. ✅ Páginas de Política de Privacidade: `https://moovelabs.com/politica-privacidade`
3. ✅ Páginas de Termos de Uso: `https://moovelabs.com/termos-uso`
4. ✅ Links no footer funcionando
5. ✅ API respondendo em `https://api.moovelabs.com`
6. ✅ Dashboard acessível em `https://app.moovelabs.com`

## 🐛 Troubleshooting

### Site não carrega
- Verifique se a porta está correta (3000 interno)
- Verifique os logs no Easypanel
- Confirme que o build do Docker foi bem-sucedido

### Erro de conexão com banco
- Verifique a `DATABASE_URL`
- Confirme que o serviço PostgreSQL está rodando
- Verifique as credenciais

### Imagens não atualizam
- Verifique se o GitHub Actions completou o build
- Force o pull da imagem no Easypanel
- Verifique se a tag `latest` foi atualizada no Docker Hub

## 📚 Recursos

- [Documentação Easypanel](https://easypanel.io/docs)
- [GitHub Actions Workflow](.github/workflows/docker-build.yml)
- [Docker Compose](docker-compose.yml)



