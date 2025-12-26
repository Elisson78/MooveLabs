-- ============================================
-- SETUP: Criar Tenant Essentia no db_moovelabs
-- Execute PRIMEIRO antes de migrar dados
-- ============================================

-- 1. Criar o Tenant Essentia
INSERT INTO tenants (id, name, slug, email, description, settings, is_active, "createdAt", "updatedAt")
VALUES (
    'essentia_tenant_001',
    'Essentia Travel',
    'essentia',
    'contato@essentiatravel.com',
    'Agência de turismo na Itália - Primeira empresa do sistema',
    '{
        "theme": "default",
        "language": "pt-BR",
        "timezone": "Europe/Rome",
        "currency": "EUR",
        "modules": {
            "crm": true,
            "turismo": true,
            "automations": true,
            "chat": true
        }
    }',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 2. Criar Planos base
INSERT INTO plans (id, name, slug, description, "priceMonthly", "priceCurrency", "maxWorkflows", "maxExecutionsPerMonth", "maxUsers", features, "isActive", "isPublic", "createdAt", "updatedAt")
VALUES 
    ('plan_starter', 'Starter', 'starter', 'Para começar', 47.00, 'CHF', 5, 1000, 2, '["basic_crm", "chat"]', true, true, NOW(), NOW()),
    ('plan_professional', 'Professional', 'professional', 'Para equipes', 147.00, 'CHF', 15, 5000, 5, '["full_crm", "automations", "webhooks"]', true, true, NOW(), NOW()),
    ('plan_business', 'Business', 'business', 'Para empresas', 297.00, 'CHF', 50, 25000, 15, '["full_crm", "automations", "webhooks", "api_access", "priority_support"]', true, true, NOW(), NOW()),
    ('plan_enterprise', 'Enterprise', 'enterprise', 'Customizado', 597.00, 'CHF', -1, -1, -1, '["unlimited", "dedicated_support", "custom_integrations"]', true, false, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 3. Subscription para Essentia (Business)
INSERT INTO subscriptions (id, "tenantId", "planId", status, "currentPeriodStart", "currentPeriodEnd", "executionsUsed", "createdAt", "updatedAt")
VALUES (
    'sub_essentia_001',
    'essentia_tenant_001',
    'plan_business',
    'ACTIVE',
    NOW(),
    NOW() + INTERVAL '1 year',
    0,
    NOW(),
    NOW()
)
ON CONFLICT ("tenantId") DO UPDATE SET
    "planId" = EXCLUDED."planId",
    status = EXCLUDED.status,
    "updatedAt" = NOW();

-- 4. Pipeline padrão para CRM
INSERT INTO pipelines (id, "tenantId", name, description, "isDefault", position, "createdAt", "updatedAt")
VALUES (
    'pipe_essentia_default',
    'essentia_tenant_001',
    'Pipeline de Vendas',
    'Pipeline padrão para novos leads',
    true,
    0,
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- 5. Stages do Pipeline
INSERT INTO pipeline_stages (id, "pipelineId", name, description, position, color, probability, "isClosed", "isWon", "createdAt", "updatedAt")
VALUES 
    ('stage_lead', 'pipe_essentia_default', 'Novo Lead', 'Lead recém chegado', 0, '#6366F1', 10, false, false, NOW(), NOW()),
    ('stage_contact', 'pipe_essentia_default', 'Primeiro Contato', 'Contato realizado', 1, '#8B5CF6', 25, false, false, NOW(), NOW()),
    ('stage_qualified', 'pipe_essentia_default', 'Qualificado', 'Lead qualificado', 2, '#A855F7', 50, false, false, NOW(), NOW()),
    ('stage_proposal', 'pipe_essentia_default', 'Proposta Enviada', 'Aguardando resposta', 3, '#D946EF', 75, false, false, NOW(), NOW()),
    ('stage_negotiation', 'pipe_essentia_default', 'Negociação', 'Em negociação', 4, '#EC4899', 90, false, false, NOW(), NOW()),
    ('stage_won', 'pipe_essentia_default', 'Ganho', 'Deal fechado!', 5, '#22C55E', 100, true, true, NOW(), NOW()),
    ('stage_lost', 'pipe_essentia_default', 'Perdido', 'Não converteu', 6, '#EF4444', 0, true, false, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verificar criação
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    p.name as plan_name,
    s.status as subscription_status
FROM tenants t
LEFT JOIN subscriptions s ON t.id = s."tenantId"
LEFT JOIN plans p ON s."planId" = p.id
WHERE t.id = 'essentia_tenant_001';







