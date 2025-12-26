-- ============================================
-- MIGRAÇÃO SIMPLES: Essentia → db_moovelabs
-- Sem dblink - Execute manualmente em 2 etapas
-- ============================================
--
-- INSTRUÇÕES:
-- 1. Primeiro, exporte os dados do banco ESSENTIA (passo A)
-- 2. Depois, importe no banco db_moovelabs (passo B)
--
-- ============================================

-- ============================================
-- PASSO A: EXECUTAR NO BANCO ESSENTIA
-- Gera CSVs para exportação
-- ============================================

-- A.1 - Exportar CLIENTES
-- COPY (
--   SELECT 
--     'cli_' || md5(random()::text || id::text) as id,
--     'essentia_tenant_001' as tenant_id,
--     nome,
--     email,
--     "Telefone" as telefone,
--     "Mensagem" as mensagem,
--     assignee,
--     nc_order as nc_order,
--     COALESCE(created_at, NOW()) as created_at,
--     COALESCE(updated_at, NOW()) as updated_at
--   FROM clientes
-- ) TO '/tmp/clientes_export.csv' WITH CSV HEADER;

-- A.2 - Exportar GUIAS
-- COPY (
--   SELECT 
--     COALESCE(id, 'guia_' || md5(random()::text)) as id,
--     'essentia_tenant_001' as tenant_id,
--     nome, email, telefone, cpf,
--     COALESCE(especialidades::text, '[]') as especialidades,
--     COALESCE(idiomas::text, '[]') as idiomas,
--     avaliacao_media,
--     COALESCE(total_avaliacoes, 0) as total_avaliacoes,
--     COALESCE(passeios_realizados, 0) as passeios_realizados,
--     COALESCE(comissao_total, 0) as comissao_total,
--     COALESCE(percentual_comissao, 20) as percentual_comissao,
--     biografia, foto,
--     COALESCE(status, 'ATIVO') as status,
--     COALESCE(data_registro, NOW()) as data_registro,
--     COALESCE(criado_em, NOW()) as criado_em,
--     COALESCE(atualizado_em, NOW()) as atualizado_em
--   FROM guias
-- ) TO '/tmp/guias_export.csv' WITH CSV HEADER;

-- (Repita para outras tabelas...)

-- ============================================
-- PASSO B: EXECUTAR NO BANCO db_moovelabs
-- Importa os CSVs e/ou insere diretamente
-- ============================================

BEGIN;

-- ============================================
-- B.1 - GARANTIR TENANT ESSENTIA EXISTE
-- ============================================

INSERT INTO tenants (id, name, slug, email, description, settings, is_active, "createdAt", "updatedAt")
VALUES (
    'essentia_tenant_001',
    'Essentia Travel',
    'essentia',
    'contato@essentiatravel.com',
    'Agência de turismo na Itália - Migrado do sistema legado',
    '{"theme": "default", "language": "pt-BR", "timezone": "Europe/Rome", "modules": {"crm": true, "turismo": true}}',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- ============================================
-- B.2 - IMPORTAR CLIENTES (via CSV ou INSERT direto)
-- ============================================

-- Opção 1: Via CSV
-- COPY clientes (id, "tenantId", nome, email, telefone, mensagem, assignee, "ncOrder", "createdAt", "updatedAt")
-- FROM '/tmp/clientes_export.csv' WITH CSV HEADER;

-- Opção 2: INSERT direto (exemplo com dados fictícios)
-- Descomente e adapte com seus dados reais:

/*
INSERT INTO clientes (id, "tenantId", nome, email, telefone, mensagem, "createdAt", "updatedAt")
VALUES 
    ('cli_001', 'essentia_tenant_001', 'João Silva', 'joao@email.com', '+39 333 1111111', 'Interesse em tour Florença', NOW(), NOW()),
    ('cli_002', 'essentia_tenant_001', 'Maria Santos', 'maria@email.com', '+39 333 2222222', 'Quer fazer degustação vinhos', NOW(), NOW()),
    ('cli_003', 'essentia_tenant_001', 'Pedro Costa', 'pedro@email.com', '+39 333 3333333', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- B.3 - IMPORTAR GUIAS
-- ============================================

/*
INSERT INTO guias (id, "tenantId", nome, email, telefone, especialidades, idiomas, "avaliacaoMedia", status, "criadoEm", "atualizadoEm")
VALUES 
    ('guia_001', 'essentia_tenant_001', 'Marco Rossi', 'marco@guia.com', '+39 333 4444444', '["Arte", "História"]', '["pt", "en", "it"]', 4.8, 'ATIVO', NOW(), NOW()),
    ('guia_002', 'essentia_tenant_001', 'Lucia Bianchi', 'lucia@guia.com', '+39 333 5555555', '["Gastronomia", "Vinhos"]', '["pt", "it"]', 4.9, 'ATIVO', NOW(), NOW())
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- B.4 - IMPORTAR PASSEIOS
-- ============================================

/*
INSERT INTO passeios (id, "tenantId", nome, descricao, preco, duracao, categoria, imagens, ativo, "criadoEm", "atualizadoEm")
VALUES 
    ('passeio_001', 'essentia_tenant_001', 'Florença Clássica', 'Tour pelos principais pontos de Florença', 150.00, '4h', 'cultural', '[]', true, NOW(), NOW()),
    ('passeio_002', 'essentia_tenant_001', 'Toscana Vinhos', 'Degustação em vinícolas da Toscana', 220.00, '6h', 'gastronomico', '[]', true, NOW(), NOW())
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- B.5 - IMPORTAR AGENDAMENTOS
-- ============================================

/*
INSERT INTO agendamentos (id, "tenantId", "passeioId", "clienteId", "guiaId", "dataPasseio", "numeroPessoas", "valorTotal", status, "criadoEm", "atualizadoEm")
VALUES 
    ('agend_001', 'essentia_tenant_001', 'passeio_001', 'cli_001', 'guia_001', '2025-05-15', 2, 300.00, 'CONFIRMADO', NOW(), NOW()),
    ('agend_002', 'essentia_tenant_001', 'passeio_002', 'cli_002', 'guia_002', '2025-05-20', 4, 880.00, 'PENDENTE', NOW(), NOW())
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- B.6 - IMPORTAR COMPANIES (CRM)
-- ============================================

/*
INSERT INTO companies (id, "tenantId", name, email, phone, industry, "createdAt", "updatedAt")
VALUES 
    ('comp_001', 'essentia_tenant_001', 'Hotel Firenze', 'contato@hotelfirenze.it', '+39 055 1234567', 'Hotelaria', NOW(), NOW()),
    ('comp_002', 'essentia_tenant_001', 'Ristorante Toscano', 'info@toscano.it', '+39 055 7654321', 'Restaurante', NOW(), NOW())
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- B.7 - IMPORTAR CONTACTS (CRM)
-- ============================================

/*
INSERT INTO contacts (id, "tenantId", "companyId", "firstName", "lastName", email, phone, status, "createdAt", "updatedAt")
VALUES 
    ('cont_001', 'essentia_tenant_001', 'comp_001', 'Giuseppe', 'Verdi', 'giuseppe@hotelfirenze.it', '+39 333 6666666', 'customer', NOW(), NOW()),
    ('cont_002', 'essentia_tenant_001', 'comp_002', 'Anna', 'Magnani', 'anna@toscano.it', '+39 333 7777777', 'lead', NOW(), NOW())
ON CONFLICT DO NOTHING;
*/

-- ============================================
-- B.8 - PIPELINE E STAGES (se não existirem)
-- ============================================

INSERT INTO pipelines (id, "tenantId", name, description, "isDefault", position, "createdAt", "updatedAt")
VALUES ('pipe_essentia_001', 'essentia_tenant_001', 'Pipeline de Vendas', 'Pipeline padrão', true, 0, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO pipeline_stages (id, "pipelineId", name, position, color, probability, "isClosed", "isWon", "createdAt", "updatedAt")
VALUES 
    ('stage_001', 'pipe_essentia_001', 'Novo Lead', 0, '#6366F1', 10, false, false, NOW(), NOW()),
    ('stage_002', 'pipe_essentia_001', 'Em Contato', 1, '#8B5CF6', 30, false, false, NOW(), NOW()),
    ('stage_003', 'pipe_essentia_001', 'Qualificado', 2, '#A855F7', 50, false, false, NOW(), NOW()),
    ('stage_004', 'pipe_essentia_001', 'Proposta', 3, '#D946EF', 70, false, false, NOW(), NOW()),
    ('stage_005', 'pipe_essentia_001', 'Ganho', 4, '#22C55E', 100, true, true, NOW(), NOW()),
    ('stage_006', 'pipe_essentia_001', 'Perdido', 5, '#EF4444', 0, true, false, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICAÇÃO
-- ============================================

SELECT 'Migração concluída!' as status;

SELECT 
    'tenants' as tabela, 
    COUNT(*) as total 
FROM tenants 
WHERE id = 'essentia_tenant_001'

UNION ALL SELECT 'clientes', COUNT(*) FROM clientes WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL SELECT 'guias', COUNT(*) FROM guias WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL SELECT 'passeios', COUNT(*) FROM passeios WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL SELECT 'agendamentos', COUNT(*) FROM agendamentos WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL SELECT 'companies', COUNT(*) FROM companies WHERE "tenantId" = 'essentia_tenant_001'
UNION ALL SELECT 'contacts', COUNT(*) FROM contacts WHERE "tenantId" = 'essentia_tenant_001';

COMMIT;

-- ============================================
-- DICA: Script para gerar INSERTs a partir do essentia
-- Execute no banco essentia para gerar os comandos INSERT
-- ============================================

/*
-- Gerar INSERTs para clientes
SELECT 
    'INSERT INTO clientes (id, "tenantId", nome, email, telefone, mensagem, "createdAt", "updatedAt") VALUES (''' ||
    'cli_' || id || ''', ''essentia_tenant_001'', ' ||
    COALESCE('''' || REPLACE(nome, '''', '''''') || '''', 'NULL') || ', ' ||
    COALESCE('''' || email || '''', 'NULL') || ', ' ||
    COALESCE('''' || "Telefone" || '''', 'NULL') || ', ' ||
    COALESCE('''' || REPLACE("Mensagem", '''', '''''') || '''', 'NULL') || ', ' ||
    'NOW(), NOW());'
FROM clientes;
*/







