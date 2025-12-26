-- ============================================
-- MIGRAÇÃO: Essentia → db_moovelabs (Multi-Tenant)
-- Data: 2025-04-12
-- Autor: MooveLabs Engineering
-- ============================================
-- 
-- IMPORTANTE: 
-- 1. Fazer BACKUP antes de executar
-- 2. Executar em ambiente de staging primeiro
-- 3. Este script assume conexão com db_moovelabs
-- ============================================

BEGIN;

-- ============================================
-- PASSO 1: Criar o Tenant "Essentia Travel"
-- ============================================

-- Gerar ID determinístico para poder referenciar depois
-- Usando formato CUID-like mas previsível para migração
INSERT INTO tenants (id, name, slug, email, description, settings, is_active, "createdAt", "updatedAt")
VALUES (
    'essentia_tenant_001',
    'Essentia Travel',
    'essentia',
    'contato@essentiatravel.com',
    'Primeira empresa migrada - Agência de turismo na Itália',
    '{"theme": "default", "language": "pt-BR", "timezone": "Europe/Rome"}',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    "updatedAt" = NOW();

-- Guardar o tenant_id para usar nas migrações
-- (Em produção, use uma variável ou parâmetro)
-- SET essentia_tenant_id = 'essentia_tenant_001';

-- ============================================
-- PASSO 2: Criar Plano e Subscription
-- ============================================

-- Plano Professional para Essentia
INSERT INTO plans (id, name, slug, description, "priceMonthly", "priceCurrency", "maxWorkflows", "maxExecutionsPerMonth", "maxUsers", features, "isActive", "isPublic", "createdAt", "updatedAt")
VALUES (
    'plan_professional',
    'Professional',
    'professional',
    'Plano profissional para agências',
    297.00,
    'CHF',
    25,
    10000,
    10,
    '["crm_full", "automations", "webhooks", "api_access", "priority_support"]',
    true,
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Subscription para Essentia
INSERT INTO subscriptions (id, "tenantId", "planId", status, "currentPeriodStart", "currentPeriodEnd", "executionsUsed", "createdAt", "updatedAt")
VALUES (
    'sub_essentia_001',
    'essentia_tenant_001',
    'plan_professional',
    'ACTIVE',
    NOW(),
    NOW() + INTERVAL '1 year',
    0,
    NOW(),
    NOW()
)
ON CONFLICT ("tenantId") DO NOTHING;

-- ============================================
-- PASSO 3: Migrar CLIENTES
-- Tabela origem: essentia.clientes
-- Tabela destino: db_moovelabs.clientes
-- ============================================

-- Criar tabela temporária para mapeamento de IDs
CREATE TEMP TABLE IF NOT EXISTS id_mapping_clientes (
    old_id INTEGER PRIMARY KEY,
    new_id VARCHAR(255)
);

-- Migrar clientes com tenant_id
INSERT INTO clientes (id, "tenantId", nome, email, telefone, mensagem, assignee, "ncOrder", "createdAt", "updatedAt")
SELECT 
    'cli_' || md5(random()::text || id::text) as id,
    'essentia_tenant_001' as "tenantId",
    nome,
    email,
    "Telefone" as telefone,
    "Mensagem" as mensagem,
    assignee,
    nc_order::integer as "ncOrder",
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, nome, email, "Telefone", "Mensagem", assignee, nc_order, created_at, updated_at FROM clientes'
) AS t(id integer, nome text, email text, "Telefone" text, "Mensagem" text, assignee text, nc_order numeric, created_at timestamp, updated_at timestamp);

-- Salvar mapeamento (para referências futuras)
-- INSERT INTO id_mapping_clientes (old_id, new_id) SELECT ...

-- ============================================
-- PASSO 4: Migrar GUIAS
-- ============================================

INSERT INTO guias (id, "tenantId", nome, email, telefone, cpf, especialidades, idiomas, "avaliacaoMedia", "totalAvaliacoes", "passeiosRealizados", "comissaoTotal", "percentualComissao", biografia, foto, status, "dataRegistro", "criadoEm", "atualizadoEm")
SELECT 
    COALESCE(id, 'guia_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    nome,
    email,
    telefone,
    cpf,
    COALESCE(especialidades, '[]')::jsonb as especialidades,
    COALESCE(idiomas, '[]')::jsonb as idiomas,
    avaliacao_media as "avaliacaoMedia",
    COALESCE(total_avaliacoes, 0) as "totalAvaliacoes",
    COALESCE(passeios_realizados, 0) as "passeiosRealizados",
    COALESCE(comissao_total, 0) as "comissaoTotal",
    COALESCE(percentual_comissao, 20) as "percentualComissao",
    biografia,
    foto,
    COALESCE(status, 'ATIVO')::"GuiaStatus" as status,
    COALESCE(data_registro, NOW()) as "dataRegistro",
    COALESCE(criado_em, NOW()) as "criadoEm",
    COALESCE(atualizado_em, NOW()) as "atualizadoEm"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, nome, email, telefone, cpf, especialidades, idiomas, avaliacao_media, total_avaliacoes, passeios_realizados, comissao_total, percentual_comissao, biografia, foto, status, data_registro, criado_em, atualizado_em FROM guias'
) AS t(id varchar, nome varchar, email varchar, telefone varchar, cpf varchar, especialidades jsonb, idiomas jsonb, avaliacao_media real, total_avaliacoes integer, passeios_realizados integer, comissao_total real, percentual_comissao real, biografia text, foto varchar, status varchar, data_registro timestamp, criado_em timestamp, atualizado_em timestamp);

-- ============================================
-- PASSO 5: Migrar PASSEIOS
-- ============================================

INSERT INTO passeios (id, "tenantId", nome, descricao, preco, duracao, categoria, imagens, inclusoes, idiomas, "capacidadeMaxima", ativo, "criadoEm", "atualizadoEm")
SELECT 
    COALESCE(id, 'passeio_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    nome,
    descricao,
    preco,
    duracao,
    categoria,
    COALESCE(imagens, '[]')::jsonb as imagens,
    COALESCE(inclusoes, '[]')::jsonb as inclusoes,
    COALESCE(idiomas, '[]')::jsonb as idiomas,
    COALESCE(capacidade_maxima, 10) as "capacidadeMaxima",
    COALESCE(ativo, 1) = 1 as ativo,
    COALESCE(criado_em, NOW()) as "criadoEm",
    COALESCE(atualizado_em, NOW()) as "atualizadoEm"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, nome, descricao, preco, duracao, categoria, imagens, inclusoes, idiomas, capacidade_maxima, ativo, criado_em, atualizado_em FROM passeios'
) AS t(id varchar, nome varchar, descricao text, preco real, duracao varchar, categoria varchar, imagens jsonb, inclusoes jsonb, idiomas jsonb, capacidade_maxima integer, ativo integer, criado_em timestamp, atualizado_em timestamp);

-- ============================================
-- PASSO 6: Migrar AGENDAMENTOS
-- ============================================

INSERT INTO agendamentos (id, "tenantId", "passeioId", "clienteId", "guiaId", "dataPasseio", "horarioInicio", "horarioFim", "numeroPessoas", "valorTotal", "valorComissao", "percentualComissao", status, observacoes, "motivoCancelamento", "avaliacaoCliente", "comentarioCliente", "criadoEm", "atualizadoEm")
SELECT 
    COALESCE(id, 'agend_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    passeio_id as "passeioId",
    -- Aqui precisa mapear cliente_id antigo para novo
    NULL as "clienteId", -- Será atualizado depois com mapeamento
    guia_id as "guiaId",
    data_passeio::date as "dataPasseio",
    horario_inicio as "horarioInicio",
    horario_fim as "horarioFim",
    numero_pessoas as "numeroPessoas",
    valor_total as "valorTotal",
    valor_comissao as "valorComissao",
    percentual_comissao as "percentualComissao",
    CASE status
        WHEN 'pendente' THEN 'PENDENTE'
        WHEN 'confirmado' THEN 'CONFIRMADO'
        WHEN 'concluido' THEN 'CONCLUIDO'
        WHEN 'cancelado' THEN 'CANCELADO'
        ELSE 'PENDENTE'
    END::"AgendamentoStatus" as status,
    observacoes,
    motivo_cancelamento as "motivoCancelamento",
    avaliacao_cliente as "avaliacaoCliente",
    NULL as "comentarioCliente", -- Era integer no original, agora é text
    COALESCE(criado_em, NOW()) as "criadoEm",
    COALESCE(atualizado_em, NOW()) as "atualizadoEm"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, passeio_id, cliente_id, guia_id, data_passeio, horario_inicio, horario_fim, numero_pessoas, valor_total, valor_comissao, percentual_comissao, status, observacoes, motivo_cancelamento, avaliacao_cliente, criado_em, atualizado_em FROM agendamentos'
) AS t(id varchar, passeio_id varchar, cliente_id integer, guia_id varchar, data_passeio varchar, horario_inicio varchar, horario_fim varchar, numero_pessoas integer, valor_total real, valor_comissao real, percentual_comissao real, status varchar, observacoes text, motivo_cancelamento text, avaliacao_cliente integer, criado_em timestamp, atualizado_em timestamp);

-- ============================================
-- PASSO 7: Migrar HISTÓRICO DE MENSAGENS
-- ============================================

INSERT INTO historico_mensagens (id, "tenantId", "sessionId", title, mensagem, message, "ncOrder", "createdAt", "updatedAt")
SELECT 
    'msg_' || md5(random()::text || id::text) as id,
    'essentia_tenant_001' as "tenantId",
    COALESCE(session_id, 'unknown') as "sessionId",
    title,
    messagem as mensagem,
    message::jsonb as message,
    nc_order::integer as "ncOrder",
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, session_id, title, messagem, message, nc_order, created_at, updated_at FROM historico_messagem'
) AS t(id integer, session_id text, title text, messagem text, message json, nc_order numeric, created_at timestamp, updated_at timestamp);

-- ============================================
-- PASSO 8: Migrar COMPANIES (CRM)
-- ============================================

INSERT INTO companies (id, "tenantId", name, website, industry, size, phone, email, address, description, "logoUrl", tags, "customFields", "createdAt", "updatedAt", "deletedAt")
SELECT 
    COALESCE(id::text, 'comp_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    name,
    website,
    industry,
    size,
    phone,
    email,
    COALESCE(address, '{}')::jsonb as address,
    description,
    logo_url as "logoUrl",
    COALESCE(tags, '[]')::jsonb as tags,
    COALESCE(custom_fields, '{}')::jsonb as "customFields",
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt",
    deleted_at as "deletedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, name, website, industry, size, phone, email, address, description, logo_url, tags, custom_fields, created_at, updated_at, deleted_at FROM companies'
) AS t(id uuid, name varchar, website varchar, industry varchar, size varchar, phone varchar, email varchar, address jsonb, description text, logo_url varchar, tags jsonb, custom_fields jsonb, created_at timestamp, updated_at timestamp, deleted_at timestamp);

-- ============================================
-- PASSO 9: Migrar CONTACTS (CRM)
-- ============================================

INSERT INTO contacts (id, "tenantId", "companyId", "firstName", "lastName", "fullName", email, phone, mobile, "jobTitle", department, address, birthday, notes, "clienteId", status, source, tags, "customFields", "createdAt", "updatedAt", "deletedAt")
SELECT 
    COALESCE(id::text, 'cont_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    company_id::text as "companyId",
    first_name as "firstName",
    last_name as "lastName",
    full_name as "fullName",
    email,
    phone,
    mobile,
    job_title as "jobTitle",
    department,
    COALESCE(address, '{}')::jsonb as address,
    birthday,
    notes,
    cliente_id as "clienteId",
    status,
    source,
    COALESCE(tags, '[]')::jsonb as tags,
    COALESCE(custom_fields, '{}')::jsonb as "customFields",
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt",
    deleted_at as "deletedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, company_id, first_name, last_name, full_name, email, phone, mobile, job_title, department, address, birthday, notes, cliente_id, status, source, tags, custom_fields, created_at, updated_at, deleted_at FROM contacts'
) AS t(id uuid, company_id uuid, first_name varchar, last_name varchar, full_name varchar, email varchar, phone varchar, mobile varchar, job_title varchar, department varchar, address jsonb, birthday date, notes text, cliente_id varchar, status varchar, source varchar, tags jsonb, custom_fields jsonb, created_at timestamp, updated_at timestamp, deleted_at timestamp);

-- ============================================
-- PASSO 10: Migrar PIPELINES
-- ============================================

INSERT INTO pipelines (id, "tenantId", name, description, "isDefault", position, "createdAt", "updatedAt")
SELECT 
    COALESCE(id::text, 'pipe_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    name,
    description,
    COALESCE(is_default, false) as "isDefault",
    COALESCE(position, 0) as position,
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, name, description, is_default, position, created_at, updated_at FROM pipelines'
) AS t(id uuid, name varchar, description text, is_default boolean, position integer, created_at timestamp, updated_at timestamp);

-- ============================================
-- PASSO 11: Migrar PIPELINE_STAGES
-- ============================================

INSERT INTO pipeline_stages (id, "pipelineId", name, description, position, color, probability, "isClosed", "isWon", "createdAt", "updatedAt")
SELECT 
    COALESCE(id::text, 'stage_' || md5(random()::text)) as id,
    pipeline_id::text as "pipelineId",
    name,
    description,
    COALESCE(position, 0) as position,
    color,
    probability,
    COALESCE(is_closed, false) as "isClosed",
    COALESCE(is_won, false) as "isWon",
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, pipeline_id, name, description, position, color, probability, is_closed, is_won, created_at, updated_at FROM pipeline_stages'
) AS t(id uuid, pipeline_id uuid, name varchar, description text, position integer, color varchar, probability integer, is_closed boolean, is_won boolean, created_at timestamp, updated_at timestamp);

-- ============================================
-- PASSO 12: Migrar DEALS
-- ============================================

INSERT INTO deals (id, "tenantId", "pipelineId", "stageId", "contactId", "companyId", "ownerId", title, description, value, currency, "expectedCloseDate", "actualCloseDate", status, probability, priority, tags, "customFields", "createdAt", "updatedAt", "deletedAt")
SELECT 
    COALESCE(id::text, 'deal_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    pipeline_id::text as "pipelineId",
    stage_id::text as "stageId",
    contact_id::text as "contactId",
    company_id::text as "companyId",
    owner_id as "ownerId",
    title,
    description,
    COALESCE(value, 0) as value,
    COALESCE(currency, 'BRL') as currency,
    expected_close_date as "expectedCloseDate",
    actual_close_date as "actualCloseDate",
    COALESCE(status, 'OPEN')::"DealStatus" as status,
    probability,
    priority,
    COALESCE(tags, '[]')::jsonb as tags,
    COALESCE(custom_fields, '{}')::jsonb as "customFields",
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt",
    deleted_at as "deletedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, pipeline_id, stage_id, contact_id, company_id, owner_id, title, description, value, currency, expected_close_date, actual_close_date, status, probability, priority, tags, custom_fields, created_at, updated_at, deleted_at FROM deals'
) AS t(id uuid, pipeline_id uuid, stage_id uuid, contact_id uuid, company_id uuid, owner_id varchar, title varchar, description text, value numeric, currency varchar, expected_close_date date, actual_close_date date, status varchar, probability integer, priority varchar, tags jsonb, custom_fields jsonb, created_at timestamp, updated_at timestamp, deleted_at timestamp);

-- ============================================
-- PASSO 13: Migrar ACTIVITIES
-- ============================================

INSERT INTO activities (id, "tenantId", "contactId", "companyId", "dealId", "ownerId", type, subject, description, "dueDate", "completedAt", "durationMinutes", status, priority, metadata, "createdAt", "updatedAt", "deletedAt")
SELECT 
    COALESCE(id::text, 'act_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    contact_id::text as "contactId",
    company_id::text as "companyId",
    deal_id::text as "dealId",
    owner_id as "ownerId",
    CASE type
        WHEN 'call' THEN 'CALL'
        WHEN 'email' THEN 'EMAIL'
        WHEN 'meeting' THEN 'MEETING'
        WHEN 'task' THEN 'TASK'
        WHEN 'note' THEN 'NOTE'
        ELSE 'OTHER'
    END::"ActivityType" as type,
    subject,
    description,
    due_date as "dueDate",
    completed_at as "completedAt",
    duration_minutes as "durationMinutes",
    CASE status
        WHEN 'pending' THEN 'PENDING'
        WHEN 'completed' THEN 'COMPLETED'
        WHEN 'canceled' THEN 'CANCELED'
        ELSE 'PENDING'
    END::"ActivityStatus" as status,
    CASE priority
        WHEN 'low' THEN 'LOW'
        WHEN 'medium' THEN 'MEDIUM'
        WHEN 'high' THEN 'HIGH'
        WHEN 'urgent' THEN 'URGENT'
        ELSE 'MEDIUM'
    END::"ActivityPriority" as priority,
    COALESCE(metadata, '{}')::jsonb as metadata,
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt",
    deleted_at as "deletedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, contact_id, company_id, deal_id, owner_id, type, subject, description, due_date, completed_at, duration_minutes, status, priority, metadata, created_at, updated_at, deleted_at FROM activities'
) AS t(id uuid, contact_id uuid, company_id uuid, deal_id uuid, owner_id varchar, type varchar, subject varchar, description text, due_date timestamp, completed_at timestamp, duration_minutes integer, status varchar, priority varchar, metadata jsonb, created_at timestamp, updated_at timestamp, deleted_at timestamp);

-- ============================================
-- PASSO 14: Migrar NOTES
-- ============================================

INSERT INTO notes (id, "tenantId", "contactId", "companyId", "dealId", "activityId", "authorId", title, content, "isPrivate", tags, "createdAt", "updatedAt", "deletedAt")
SELECT 
    COALESCE(id::text, 'note_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    contact_id::text as "contactId",
    company_id::text as "companyId",
    deal_id::text as "dealId",
    activity_id::text as "activityId",
    author_id as "authorId",
    title,
    content,
    COALESCE(is_private, false) as "isPrivate",
    COALESCE(tags, '[]')::jsonb as tags,
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt",
    deleted_at as "deletedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, contact_id, company_id, deal_id, activity_id, author_id, title, content, is_private, tags, created_at, updated_at, deleted_at FROM notes'
) AS t(id uuid, contact_id uuid, company_id uuid, deal_id uuid, activity_id uuid, author_id varchar, title varchar, content text, is_private boolean, tags jsonb, created_at timestamp, updated_at timestamp, deleted_at timestamp);

-- ============================================
-- PASSO 15: Migrar TAGS
-- ============================================

INSERT INTO tags (id, "tenantId", name, color, description, "createdAt", "updatedAt")
SELECT 
    COALESCE(id::text, 'tag_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    name,
    color,
    description,
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, name, color, description, created_at, updated_at FROM tags'
) AS t(id uuid, name varchar, color varchar, description text, created_at timestamp, updated_at timestamp)
ON CONFLICT ("tenantId", name) DO NOTHING;

-- ============================================
-- PASSO 16: Migrar INTEGRATION_WEBHOOKS
-- ============================================

INSERT INTO integration_webhooks (id, "tenantId", name, "eventType", "targetUrl", method, headers, "secretToken", "isActive", "retryCount", "timeoutSeconds", "createdAt", "updatedAt")
SELECT 
    COALESCE(id::text, 'webhook_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    name,
    event_type as "eventType",
    target_url as "targetUrl",
    COALESCE(method, 'POST') as method,
    COALESCE(headers, '{}')::jsonb as headers,
    secret_token as "secretToken",
    COALESCE(is_active, true) as "isActive",
    COALESCE(retry_count, 3) as "retryCount",
    COALESCE(timeout_seconds, 30) as "timeoutSeconds",
    COALESCE(created_at, NOW()) as "createdAt",
    COALESCE(updated_at, NOW()) as "updatedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, name, event_type, target_url, method, headers, secret_token, is_active, retry_count, timeout_seconds, created_at, updated_at FROM integration_webhooks'
) AS t(id uuid, name varchar, event_type varchar, target_url varchar, method varchar, headers jsonb, secret_token varchar, is_active boolean, retry_count integer, timeout_seconds integer, created_at timestamp, updated_at timestamp);

-- ============================================
-- PASSO 17: Migrar EVENTS_LOG
-- ============================================

INSERT INTO events_log (id, "tenantId", "eventType", "entityType", "entityId", action, "userId", changes, metadata, "webhookSent", "webhookAttempts", "webhookLastAttempt", "createdAt")
SELECT 
    COALESCE(id::text, 'evt_' || md5(random()::text)) as id,
    'essentia_tenant_001' as "tenantId",
    event_type as "eventType",
    entity_type as "entityType",
    entity_id::text as "entityId",
    action,
    user_id as "userId",
    changes::jsonb as changes,
    metadata::jsonb as metadata,
    COALESCE(webhook_sent, false) as "webhookSent",
    COALESCE(webhook_attempts, 0) as "webhookAttempts",
    webhook_last_attempt as "webhookLastAttempt",
    COALESCE(created_at, NOW()) as "createdAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT id, event_type, entity_type, entity_id, action, user_id, changes, metadata, webhook_sent, webhook_attempts, webhook_last_attempt, created_at FROM events_log'
) AS t(id uuid, event_type varchar, entity_type varchar, entity_id uuid, action varchar, user_id varchar, changes jsonb, metadata jsonb, webhook_sent boolean, webhook_attempts integer, webhook_last_attempt timestamp, created_at timestamp);

-- ============================================
-- PASSO 18: Migrar USERS (do organization_members)
-- ============================================

-- Nota: A tabela users do Essentia usa IDs do Clerk
-- Vamos migrar mantendo compatibilidade

INSERT INTO users (id, email, password, name, avatar, role, status, "tenantId", "refreshToken", "lastLoginAt", "createdAt", "updatedAt")
SELECT 
    u.id,
    u.email,
    COALESCE(u.password_hash, 'MIGRATED_USER_NEEDS_PASSWORD_RESET'),
    COALESCE(u.nome, u.first_name || ' ' || COALESCE(u.last_name, '')) as name,
    u.profile_image_url as avatar,
    CASE om.role
        WHEN 'owner' THEN 'OWNER'
        WHEN 'admin' THEN 'ADMIN'
        ELSE 'MEMBER'
    END::"UserRole" as role,
    'ACTIVE'::"UserStatus" as status,
    'essentia_tenant_001' as "tenantId",
    NULL as "refreshToken",
    u.updated_at as "lastLoginAt",
    COALESCE(u.created_at, NOW()) as "createdAt",
    COALESCE(u.updated_at, NOW()) as "updatedAt"
FROM dblink(
    'dbname=essentia host=localhost user=postgres password=YOUR_PASSWORD',
    'SELECT u.id, u.email, u.nome, u.first_name, u.last_name, u.profile_image_url, u.password_hash, u.created_at, u.updated_at, om.role 
     FROM users u 
     LEFT JOIN organization_members om ON u.id = om.user_id'
) AS t(id varchar, email varchar, nome varchar, first_name varchar, last_name varchar, profile_image_url varchar, password_hash text, created_at timestamp, updated_at timestamp, role varchar)
AS u(id, email, nome, first_name, last_name, profile_image_url, password_hash, created_at, updated_at)
CROSS JOIN LATERAL (SELECT role FROM unnest(ARRAY[t.role]) AS role LIMIT 1) om
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Contar registros migrados
SELECT 'tenants' as tabela, COUNT(*) as total FROM tenants WHERE id = 'essentia_tenant_001'
UNION ALL
SELECT 'clientes', COUNT(*) FROM clientes WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'guias', COUNT(*) FROM guias WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'passeios', COUNT(*) FROM passeios WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'agendamentos', COUNT(*) FROM agendamentos WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'companies', COUNT(*) FROM companies WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'contacts', COUNT(*) FROM contacts WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'deals', COUNT(*) FROM deals WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'pipelines', COUNT(*) FROM pipelines WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'activities', COUNT(*) FROM activities WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'notes', COUNT(*) FROM notes WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'tags', COUNT(*) FROM tags WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL
SELECT 'users', COUNT(*) FROM users WHERE "tenantId" = 'essentia_tenant_001';

COMMIT;

-- ============================================
-- ROLLBACK (caso necessário)
-- ============================================
-- BEGIN;
-- DELETE FROM events_log WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM integration_webhooks WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM notes WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM activities WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM deals WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM pipeline_stages WHERE "pipelineId" IN (SELECT id FROM pipelines WHERE "tenantId" = 'essentia_tenant_001');
-- DELETE FROM pipelines WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM contacts WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM companies WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM tags WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM historico_mensagens WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM agendamentos WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM guias WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM passeios WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM clientes WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM users WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM subscriptions WHERE "tenantId" = 'essentia_tenant_001';
-- DELETE FROM tenants WHERE id = 'essentia_tenant_001';
-- COMMIT;







