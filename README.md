# 🚀 MooveLabs SaaS - Plataforma de Automações

SaaS multi-tenant de automações empresariais usando **n8n** como motor de execução.

![MooveLabs](https://moovelabs.com/og-image.jpg)

## 📋 Índice

- [Sobre](#sobre)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executando](#executando)
- [Deploy](#deploy)
- [API Endpoints](#api-endpoints)

## 🎯 Sobre

MooveLabs é uma plataforma SaaS que permite empresas utilizarem automações pré-configuradas (templates) ou personalizadas, com:

- ✅ **Multi-tenant** - Empresas isoladas com seus próprios dados
- ✅ **RBAC** - Roles: Owner, Admin, Member
- ✅ **n8n Integration** - Motor de automações profissional
- ✅ **Billing Ready** - Estrutura preparada para Stripe
- ✅ **Dashboard Moderno** - React + Tailwind + shadcn/ui

## 🏗️ Arquitetura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Site Next.js  │     │  Dashboard React │     │   n8n Engine    │
│   (porta 3000)  │     │   (porta 3003)   │     │  (porta 5678)   │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Backend NestJS        │
                    │     (porta 3002)        │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   PostgreSQL Database   │
                    │     (porta 5432)        │
                    └─────────────────────────┘
```

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|------------|
| **Site** | Next.js 16, React 19, Tailwind v4, Framer Motion |
| **Dashboard** | React 18, Vite 5, Tailwind 3, shadcn/ui, Zustand |
| **Backend** | NestJS 10, TypeScript, Prisma 5, JWT |
| **Database** | PostgreSQL 16 |
| **Automações** | n8n Self-hosted |
| **Deploy** | Docker, EasyPanel |

## 📁 Estrutura do Projeto

```
moovelabs-site/
├── src/                    # Site Next.js (landing page)
│   └── app/
│       ├── page.tsx        # Homepage
│       └── layout.tsx      # Layout principal
│
├── backend/                # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma   # Modelo de dados
│   │   └── seed.ts         # Seed inicial
│   └── src/
│       └── modules/
│           ├── auth/       # Autenticação JWT
│           ├── tenants/    # Gestão de empresas
│           ├── users/      # Gestão de usuários
│           ├── automations/# Automações + Templates
│           ├── plans/      # Planos e assinaturas
│           └── n8n/        # Integração n8n
│
├── dashboard/              # Painel Admin React
│   └── src/
│       ├── pages/          # Páginas (auth, dashboard, etc)
│       ├── components/     # Componentes UI
│       ├── stores/         # Zustand stores
│       └── lib/            # Utils e API client
│
├── docker-compose.yml      # Orquestração
└── .env.example            # Template de variáveis
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 20+
- PostgreSQL 16+
- n8n (self-hosted)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/moovelabs-saas.git
cd moovelabs-saas
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### 3. Instale as dependências

```bash
# Site
npm install

# Backend
cd backend && npm install

# Dashboard
cd ../dashboard && npm install
```

### 4. Configure o banco de dados

```bash
cd backend

# Gera o Prisma Client
npx prisma generate

# Sincroniza o schema com o banco
npx prisma db push

# Popula dados iniciais
npx ts-node prisma/seed.ts
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL do PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret para tokens JWT | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Secret para refresh tokens | `your-refresh-secret` |
| `N8N_HOST` | URL do n8n | `https://n8n.exemplo.com` |
| `N8N_API_KEY` | API Key do n8n | `eyJhbG...` |
| `VITE_API_URL` | URL da API para o dashboard | `http://localhost:3002` |

## ▶️ Executando

### Desenvolvimento

```bash
# Terminal 1 - Site (porta 3000)
npm run dev

# Terminal 2 - Backend (porta 3002)
cd backend && npm run dev

# Terminal 3 - Dashboard (porta 3003)
cd dashboard && npm run dev
```

### URLs

| Serviço | URL |
|---------|-----|
| Site | http://localhost:3000 |
| Dashboard | http://localhost:3003 |
| API | http://localhost:3002/api |
| Swagger Docs | http://localhost:3002/api/docs |

## 🐳 Deploy

### Docker Compose

```bash
docker-compose up -d
```

### EasyPanel

1. Crie um novo projeto no EasyPanel
2. Configure as variáveis de ambiente
3. Faça deploy do backend, dashboard e site separadamente
4. Configure os domínios

## 📡 API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Criar conta + empresa |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Renovar token |
| POST | `/api/auth/logout` | Logout |

### Tenants

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tenants/me` | Dados do tenant |
| GET | `/api/tenants/me/stats` | Estatísticas |
| PATCH | `/api/tenants/me` | Atualizar tenant |

### Automações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/automations` | Listar automações |
| POST | `/api/automations` | Criar automação |
| POST | `/api/automations/:id/activate` | Ativar |
| POST | `/api/automations/:id/deactivate` | Desativar |
| DELETE | `/api/automations/:id` | Remover |

### Templates

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/templates` | Listar templates |
| GET | `/api/templates/:id` | Detalhes do template |

### Planos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/plans` | Listar planos |
| GET | `/api/plans/subscription` | Assinatura atual |

## 📄 Licença

Proprietary - MooveLabs © 2024

---

Desenvolvido com ❤️ por [MooveLabs](https://moovelabs.com)
