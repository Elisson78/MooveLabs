# Prompt pronto para o Cursor — SaaS Multi-Tenant de Automações (MooveLabs + n8n)

## Você é um engenheiro de software sênior especializado em:

- SaaS B2B multi-tenant
- Node.js / TypeScript
- PostgreSQL / Prisma
- n8n como "motor" de automações (self-hosted)
- Arquitetura limpa e escalável
- Boas práticas para MVP rápido, mas pronto para crescer

## Contexto do produto

Quero construir um MVP de um SaaS multi-tenant de automações, usando o n8n como motor de execução dos workflows.

O SaaS será um produto da MooveLabs (moovelabs.com), que hoje oferece:

- Desenvolvimento de apps
- Agentes de IA 24h
- Automações empresariais

Este SaaS será a forma produto dessas automações, permitindo que empresas assinem planos e usem automações pré-configuradas (templates) ou personalizadas.

## Objetivo geral

Criar a primeira versão funcional (MVP) de um SaaS com:

- **Multi-tenant** (empresas / workspaces separados)
- **Gestão de usuários** (owner, admin, member)
- **Autenticação** (e.g. Email + Password + Magic Link / OAuth se fizer sentido)
- **Integração com n8n self-hosted** como motor de automações:
  - Criar/ativar/desativar workflows por tenant
  - Disparar execuções via API / Webhook
  - Guardar logs/situação da automação no nosso banco
- **Área logada** com:
  - Dashboard geral de uso
  - Gestão de automações (lista, criar, ativar/desativar)
  - Gestão de conexões (API keys / webhooks / credenciais externas se necessário)
  - Gestão de plano/limites (chamadas/mês, número de workflows, etc.)
- **Sistema de planos / billing** (pode ser pensado inicialmente para Stripe, mas não precisa integrar tudo no primeiro commit – só deixar a estrutura preparada).

Foco total em MVP funcional, com código limpo e fácil de evoluir no Cursor.

## Tecnologias preferidas

Sugira, mas por padrão considere:

### Backend:
- Node.js + TypeScript
- Framework sugerido: NestJS ou Express com arquitetura modular bem organizada
- ORM: Prisma com PostgreSQL
- Banco de dados: PostgreSQL (já pensando em multi-tenant)

### Frontend:
- React + Vite + TypeScript
- TailwindCSS
- UI simples e moderna (podemos usar shadcn/ui se quiser)

### Infraestrutura:
- Projeto será desenvolvido e versionado em Git
- Deploy provável via Docker (por enquanto basta estruturar o projeto para ser dockerizável, não precisa escrever todos os manifests se não for necessário no MVP).

## Multi-tenant – como deve funcionar

Quero que você pense a arquitetura já multi-tenant:

- **Entidade principal**: Tenant (empresa / cliente)
- Cada tenant pode ter:
  - Vários usuários
  - Vários workflows/automations
  - Settings próprios (webhooks, tokens, integrações externas)
  - Limites de plano (número de execuções/mês, número de workflows ativos, etc.)

Sugira a melhor estratégia entre:

- "Tenant column" em todas as tabelas (scoped por tenant_id)
- Ou esquemas separados por tenant (se você julgar exagerado para o MVP, explique e escolha a opção mais simples).

## Integração com n8n

Quero usar o n8n como motor (engine). Você deve:

Definir uma camada de serviço no backend que:

- Comunique-se com a API do n8n (HTTP) para criar/atualizar/ativar/desativar workflows.
- Trabalhe com a ideia de templates de workflows:
  - Um template "base" salvo no nosso sistema (JSON do workflow do n8n)
  - Quando um tenant ativa uma automação baseada em um template, o backend cria uma cópia desse workflow no n8n, vinculada ao tenant.

Prever:

- Webhooks de retorno do n8n para o nosso backend (para logs, status de execução, erros, etc.).
- Autenticação segura entre nosso backend e o n8n (API key/token).

Modelar entidades como:

- `AutomationTemplate`
- `AutomationInstance` (workflow do tenant)
- `AutomationExecution` (log básico, status, timestamps, etc.)

## Camada de planos (usando o que já existe no site)

No site MooveLabs já há uma lógica de serviços e planos. Para o SaaS:

Criar entidade `Plan` com campos como:

- nome
- descrição
- preço mensal
- limite de execuções/mês
- limite de workflows ativos

Entidade `Subscription` ligando Tenant a Plan.

Para o MVP:

- Não precisa implementar cobrança real ainda, mas:
- Deve existir lógica de checagem de limites.
- Se exceder limites, bloquear novas execuções ou avisar via status.

## UX / UI básica do painel

No frontend React, criar pelo menos:

### Tela de login/registro

### Onboarding simples:
- criar empresa (tenant)
- primeiro usuário = owner

### Dashboard:
- Número de execuções no mês
- Automations ativas
- Status do plano e consumo (e.g. "Você usou 30 de 1000 execuções neste mês")

### Página de Automações:
- Listar automations do tenant
- Botão "Criar automação a partir de template"
- Ver/editar configurações básicas (nome, descrição, se está ativa, webhooks)

### Página de Templates (apenas visualização, inicial):
- Mostrar templates disponíveis (por enquanto fixos, hardcoded ou seed)

### Página de Configurações do Workspace/Tenant:
- Dados da empresa
- Plano atual
- Configurações de API/webhooks

## Estilo de código e organização

- Usar TypeScript estrito.
- Comentários claros nas partes mais importantes (especialmente integração com n8n).
- Pastas e módulos bem organizados (ex: modules/tenants, modules/automations, modules/auth, etc.).
- Arquitetura pensada para que seja fácil:
  - Adicionar novos tipos de automações.
  - Adicionar novas integrações de terceiros no futuro.

## O que você deve fazer agora

### 1. Definir arquitetura geral:

- Desenhar (em texto) o diagrama das principais entidades (Tenant, User, Plan, Subscription, AutomationTemplate, AutomationInstance, AutomationExecution).
- Explicar a estratégia de multi-tenant escolhida.
- Propor a estrutura de pastas para backend e frontend.

### 2. Gerar os esquemas Prisma iniciais (ou equivalente) para o banco de dados.

### 3. Gerar o esqueleto do backend (NestJS ou Express + TS) com:

- Rotas básicas de auth
- CRUD inicial de tenants
- Endpoints básicos de automations ligados à camada de serviço do n8n (mock se necessário).

### 4. Gerar o esqueleto do frontend (React + Vite + Tailwind) com:

- Rotas/Telas principais descritas acima
- Layout base (sidebar/topbar, etc.).

### 5. Entregar tudo com foco em MVP funcional, pronto para eu abrir no Cursor e continuar refinando em passos seguintes.

## Instruções para geração de código

**Sempre que for gerar código:**

1. Comece pela estrutura.
2. Mantenha tudo claro e organizado.
3. **Antes de escrever o código, explique rapidamente o que vai fazer em cada arquivo/pasta, para eu entender e conseguir pedir ajustes.**


