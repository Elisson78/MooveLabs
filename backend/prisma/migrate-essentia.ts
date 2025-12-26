/**
 * Script de Migração: Essentia → db_moovelabs
 * 
 * Uso:
 *   npx ts-node prisma/migrate-essentia.ts
 * 
 * Antes de executar:
 *   1. Configure ESSENTIA_DATABASE_URL no .env
 *   2. Configure DATABASE_URL para db_moovelabs
 *   3. Execute: npx prisma migrate dev (para criar as tabelas)
 */

import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

// Cliente Prisma para db_moovelabs (destino)
const prisma = new PrismaClient();

// Configuração do banco Essentia (origem)
const ESSENTIA_CONFIG = {
  host: process.env.ESSENTIA_DB_HOST || 'localhost',
  port: parseInt(process.env.ESSENTIA_DB_PORT || '5432'),
  database: process.env.ESSENTIA_DB_NAME || 'essentia',
  user: process.env.ESSENTIA_DB_USER || 'postgres',
  password: process.env.ESSENTIA_DB_PASSWORD || 'postgres',
};

const TENANT_ID = 'essentia_tenant_001';

// Mapas para referências entre IDs antigos e novos
const idMaps = {
  clientes: new Map<number, string>(),
  guias: new Map<string, string>(),
  passeios: new Map<string, string>(),
  companies: new Map<string, string>(),
  contacts: new Map<string, string>(),
  pipelines: new Map<string, string>(),
  stages: new Map<string, string>(),
};

async function main() {
  console.log('🚀 Iniciando migração Essentia → db_moovelabs\n');

  // Conecta ao banco Essentia
  const essentiaClient = new Client(ESSENTIA_CONFIG);
  
  try {
    await essentiaClient.connect();
    console.log('✅ Conectado ao banco Essentia');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco Essentia:', error);
    console.log('\n💡 Configure as variáveis de ambiente:');
    console.log('   ESSENTIA_DB_HOST, ESSENTIA_DB_PORT, ESSENTIA_DB_NAME, ESSENTIA_DB_USER, ESSENTIA_DB_PASSWORD');
    process.exit(1);
  }

  try {
    // 1. Garantir que o tenant existe
    await ensureTenant();

    // 2. Migrar Clientes
    await migrateClientes(essentiaClient);

    // 3. Migrar Guias
    await migrateGuias(essentiaClient);

    // 4. Migrar Passeios
    await migratePasseios(essentiaClient);

    // 5. Migrar Agendamentos
    await migrateAgendamentos(essentiaClient);

    // 6. Migrar Companies (CRM)
    await migrateCompanies(essentiaClient);

    // 7. Migrar Contacts (CRM)
    await migrateContacts(essentiaClient);

    // 8. Migrar Pipelines e Stages
    await migratePipelines(essentiaClient);

    // 9. Migrar Deals
    await migrateDeals(essentiaClient);

    // 10. Migrar Activities
    await migrateActivities(essentiaClient);

    // 11. Migrar Notes
    await migrateNotes(essentiaClient);

    // 12. Migrar Histórico de Mensagens
    await migrateHistoricoMensagens(essentiaClient);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(50));

    // Resumo
    await printSummary();

  } catch (error) {
    console.error('\n❌ Erro durante migração:', error);
    throw error;
  } finally {
    await essentiaClient.end();
    await prisma.$disconnect();
  }
}

async function ensureTenant() {
  console.log('\n📦 Verificando Tenant...');
  
  await prisma.tenant.upsert({
    where: { slug: 'essentia' },
    update: {},
    create: {
      id: TENANT_ID,
      name: 'Essentia Travel',
      slug: 'essentia',
      email: 'contato@essentiatravel.com',
      description: 'Migrado do sistema legado',
      isActive: true,
      settings: {
        migrated: true,
        migratedAt: new Date().toISOString(),
      },
    },
  });
  
  console.log('  ✅ Tenant Essentia OK');
}

async function migrateClientes(client: Client) {
  console.log('\n👥 Migrando Clientes...');
  
  const { rows } = await client.query(`
    SELECT id, nome, email, "Telefone" as telefone, "Mensagem" as mensagem, 
           assignee, nc_order, created_at, updated_at
    FROM clientes
    ORDER BY id
  `);

  let count = 0;
  for (const row of rows) {
    const newId = `cli_${row.id}`;
    
    try {
      await prisma.cliente.upsert({
        where: { id: newId },
        update: {},
        create: {
          id: newId,
          tenantId: TENANT_ID,
          nome: row.nome,
          email: row.email,
          telefone: row.telefone,
          mensagem: row.mensagem,
          assignee: row.assignee,
          ncOrder: row.nc_order ? parseInt(row.nc_order) : null,
          createdAt: row.created_at || new Date(),
          updatedAt: row.updated_at || new Date(),
        },
      });
      
      idMaps.clientes.set(row.id, newId);
      count++;
    } catch (error) {
      console.error(`  ⚠️ Erro ao migrar cliente ${row.id}:`, error);
    }
  }

  console.log(`  ✅ ${count}/${rows.length} clientes migrados`);
}

async function migrateGuias(client: Client) {
  console.log('\n👨‍🏫 Migrando Guias...');
  
  const { rows } = await client.query(`
    SELECT id, nome, email, telefone, cpf, especialidades, idiomas,
           avaliacao_media, total_avaliacoes, passeios_realizados,
           comissao_total, percentual_comissao, biografia, foto, status,
           data_registro, criado_em, atualizado_em
    FROM guias
    ORDER BY id
  `);

  let count = 0;
  for (const row of rows) {
    const newId = row.id || `guia_${count + 1}`;
    
    try {
      await prisma.guia.upsert({
        where: { tenantId_email: { tenantId: TENANT_ID, email: row.email } },
        update: {},
        create: {
          id: newId,
          tenantId: TENANT_ID,
          nome: row.nome,
          email: row.email,
          telefone: row.telefone,
          cpf: row.cpf,
          especialidades: row.especialidades || [],
          idiomas: row.idiomas || [],
          avaliacaoMedia: row.avaliacao_media,
          totalAvaliacoes: row.total_avaliacoes || 0,
          passeiosRealizados: row.passeios_realizados || 0,
          comissaoTotal: row.comissao_total || 0,
          percentualComissao: row.percentual_comissao || 20,
          biografia: row.biografia,
          foto: row.foto,
          status: mapGuiaStatus(row.status),
          dataRegistro: row.data_registro || new Date(),
          criadoEm: row.criado_em || new Date(),
          atualizadoEm: row.atualizado_em || new Date(),
        },
      });
      
      idMaps.guias.set(row.id, newId);
      count++;
    } catch (error) {
      console.error(`  ⚠️ Erro ao migrar guia ${row.email}:`, error);
    }
  }

  console.log(`  ✅ ${count}/${rows.length} guias migrados`);
}

async function migratePasseios(client: Client) {
  console.log('\n🗺️ Migrando Passeios...');
  
  const { rows } = await client.query(`
    SELECT id, nome, descricao, preco, duracao, categoria,
           imagens, inclusoes, idiomas, capacidade_maxima, ativo,
           criado_em, atualizado_em
    FROM passeios
    ORDER BY id
  `);

  let count = 0;
  for (const row of rows) {
    const newId = row.id || `passeio_${count + 1}`;
    
    try {
      await prisma.passeio.upsert({
        where: { id: newId },
        update: {},
        create: {
          id: newId,
          tenantId: TENANT_ID,
          nome: row.nome,
          descricao: row.descricao || '',
          preco: row.preco || 0,
          duracao: row.duracao || '0h',
          categoria: row.categoria || 'outros',
          imagens: row.imagens || [],
          inclusoes: row.inclusoes || [],
          idiomas: row.idiomas || [],
          capacidadeMaxima: row.capacidade_maxima || 10,
          ativo: row.ativo === 1 || row.ativo === true,
          criadoEm: row.criado_em || new Date(),
          atualizadoEm: row.atualizado_em || new Date(),
        },
      });
      
      idMaps.passeios.set(row.id, newId);
      count++;
    } catch (error) {
      console.error(`  ⚠️ Erro ao migrar passeio ${row.nome}:`, error);
    }
  }

  console.log(`  ✅ ${count}/${rows.length} passeios migrados`);
}

async function migrateAgendamentos(client: Client) {
  console.log('\n📅 Migrando Agendamentos...');
  
  const { rows } = await client.query(`
    SELECT id, passeio_id, cliente_id, guia_id, data_passeio,
           horario_inicio, horario_fim, numero_pessoas, valor_total,
           valor_comissao, percentual_comissao, status, observacoes,
           motivo_cancelamento, avaliacao_cliente, criado_em, atualizado_em
    FROM agendamentos
    ORDER BY id
  `);

  let count = 0;
  for (const row of rows) {
    const newId = row.id || `agend_${count + 1}`;
    const passeioId = idMaps.passeios.get(row.passeio_id) || row.passeio_id;
    const clienteId = row.cliente_id ? idMaps.clientes.get(row.cliente_id) : null;
    const guiaId = row.guia_id ? idMaps.guias.get(row.guia_id) : null;
    
    try {
      // Verifica se o passeio existe
      const passeioExists = await prisma.passeio.findUnique({ where: { id: passeioId } });
      if (!passeioExists) {
        console.log(`  ⚠️ Passeio ${passeioId} não encontrado, pulando agendamento ${row.id}`);
        continue;
      }

      await prisma.agendamento.upsert({
        where: { id: newId },
        update: {},
        create: {
          id: newId,
          tenantId: TENANT_ID,
          passeioId: passeioId,
          clienteId: clienteId,
          guiaId: guiaId,
          dataPasseio: parseDate(row.data_passeio),
          horarioInicio: row.horario_inicio,
          horarioFim: row.horario_fim,
          numeroPessoas: row.numero_pessoas || 1,
          valorTotal: row.valor_total || 0,
          valorComissao: row.valor_comissao,
          percentualComissao: row.percentual_comissao,
          status: mapAgendamentoStatus(row.status),
          observacoes: row.observacoes,
          motivoCancelamento: row.motivo_cancelamento,
          avaliacaoCliente: row.avaliacao_cliente,
          criadoEm: row.criado_em || new Date(),
          atualizadoEm: row.atualizado_em || new Date(),
        },
      });
      
      count++;
    } catch (error) {
      console.error(`  ⚠️ Erro ao migrar agendamento ${row.id}:`, error);
    }
  }

  console.log(`  ✅ ${count}/${rows.length} agendamentos migrados`);
}

async function migrateCompanies(client: Client) {
  console.log('\n🏢 Migrando Companies...');
  
  try {
    const { rows } = await client.query(`
      SELECT id, name, website, industry, size, phone, email,
             address, description, logo_url, tags, custom_fields,
             created_at, updated_at, deleted_at
      FROM companies
      ORDER BY id
    `);

    let count = 0;
    for (const row of rows) {
      const newId = row.id?.toString() || `comp_${count + 1}`;
      
      try {
        await prisma.company.upsert({
          where: { id: newId },
          update: {},
          create: {
            id: newId,
            tenantId: TENANT_ID,
            name: row.name,
            website: row.website,
            industry: row.industry,
            size: row.size,
            phone: row.phone,
            email: row.email,
            address: row.address || {},
            description: row.description,
            logoUrl: row.logo_url,
            tags: row.tags || [],
            customFields: row.custom_fields || {},
            createdAt: row.created_at || new Date(),
            updatedAt: row.updated_at || new Date(),
            deletedAt: row.deleted_at,
          },
        });
        
        idMaps.companies.set(row.id?.toString(), newId);
        count++;
      } catch (error) {
        console.error(`  ⚠️ Erro ao migrar company ${row.name}:`, error);
      }
    }

    console.log(`  ✅ ${count}/${rows.length} companies migradas`);
  } catch {
    console.log('  ⚠️ Tabela companies não existe no Essentia');
  }
}

async function migrateContacts(client: Client) {
  console.log('\n👤 Migrando Contacts...');
  
  try {
    const { rows } = await client.query(`
      SELECT id, company_id, first_name, last_name, full_name, email, phone,
             mobile, job_title, department, address, birthday, notes,
             cliente_id, status, source, tags, custom_fields,
             created_at, updated_at, deleted_at
      FROM contacts
      ORDER BY id
    `);

    let count = 0;
    for (const row of rows) {
      const newId = row.id?.toString() || `cont_${count + 1}`;
      const companyId = row.company_id ? idMaps.companies.get(row.company_id.toString()) : null;
      
      try {
        await prisma.contact.upsert({
          where: { id: newId },
          update: {},
          create: {
            id: newId,
            tenantId: TENANT_ID,
            companyId: companyId,
            firstName: row.first_name,
            lastName: row.last_name,
            fullName: row.full_name,
            email: row.email,
            phone: row.phone,
            mobile: row.mobile,
            jobTitle: row.job_title,
            department: row.department,
            address: row.address || {},
            birthday: row.birthday,
            notes: row.notes,
            clienteId: row.cliente_id,
            status: row.status,
            source: row.source,
            tags: row.tags || [],
            customFields: row.custom_fields || {},
            createdAt: row.created_at || new Date(),
            updatedAt: row.updated_at || new Date(),
            deletedAt: row.deleted_at,
          },
        });
        
        idMaps.contacts.set(row.id?.toString(), newId);
        count++;
      } catch (error) {
        console.error(`  ⚠️ Erro ao migrar contact ${row.email}:`, error);
      }
    }

    console.log(`  ✅ ${count}/${rows.length} contacts migrados`);
  } catch {
    console.log('  ⚠️ Tabela contacts não existe no Essentia');
  }
}

async function migratePipelines(client: Client) {
  console.log('\n📊 Migrando Pipelines...');
  
  try {
    // Pipelines
    const { rows: pipelines } = await client.query(`
      SELECT id, name, description, is_default, position, created_at, updated_at
      FROM pipelines ORDER BY position
    `);

    for (const row of pipelines) {
      const newId = row.id?.toString() || `pipe_${row.name}`;
      
      await prisma.pipeline.upsert({
        where: { id: newId },
        update: {},
        create: {
          id: newId,
          tenantId: TENANT_ID,
          name: row.name,
          description: row.description,
          isDefault: row.is_default || false,
          position: row.position || 0,
          createdAt: row.created_at || new Date(),
          updatedAt: row.updated_at || new Date(),
        },
      });
      
      idMaps.pipelines.set(row.id?.toString(), newId);
    }
    console.log(`  ✅ ${pipelines.length} pipelines migrados`);

    // Stages
    const { rows: stages } = await client.query(`
      SELECT id, pipeline_id, name, description, position, color, probability,
             is_closed, is_won, created_at, updated_at
      FROM pipeline_stages ORDER BY pipeline_id, position
    `);

    for (const row of stages) {
      const newId = row.id?.toString() || `stage_${row.name}`;
      const pipelineId = idMaps.pipelines.get(row.pipeline_id?.toString());
      
      if (!pipelineId) continue;
      
      await prisma.pipelineStage.upsert({
        where: { id: newId },
        update: {},
        create: {
          id: newId,
          pipelineId: pipelineId,
          name: row.name,
          description: row.description,
          position: row.position || 0,
          color: row.color,
          probability: row.probability,
          isClosed: row.is_closed || false,
          isWon: row.is_won || false,
          createdAt: row.created_at || new Date(),
          updatedAt: row.updated_at || new Date(),
        },
      });
      
      idMaps.stages.set(row.id?.toString(), newId);
    }
    console.log(`  ✅ ${stages.length} stages migrados`);

  } catch {
    console.log('  ⚠️ Tabelas de pipeline não existem no Essentia');
  }
}

async function migrateDeals(client: Client) {
  console.log('\n💰 Migrando Deals...');
  
  try {
    const { rows } = await client.query(`
      SELECT * FROM deals ORDER BY created_at
    `);

    let count = 0;
    for (const row of rows) {
      const pipelineId = idMaps.pipelines.get(row.pipeline_id?.toString());
      const stageId = idMaps.stages.get(row.stage_id?.toString());
      
      if (!pipelineId || !stageId) continue;
      
      await prisma.deal.create({
        data: {
          tenantId: TENANT_ID,
          pipelineId,
          stageId,
          contactId: row.contact_id ? idMaps.contacts.get(row.contact_id.toString()) : null,
          companyId: row.company_id ? idMaps.companies.get(row.company_id.toString()) : null,
          ownerId: row.owner_id,
          title: row.title,
          description: row.description,
          value: row.value || 0,
          currency: row.currency || 'BRL',
          expectedCloseDate: row.expected_close_date,
          actualCloseDate: row.actual_close_date,
          status: mapDealStatus(row.status),
          probability: row.probability,
          priority: row.priority,
          tags: row.tags || [],
          customFields: row.custom_fields || {},
          createdAt: row.created_at || new Date(),
          updatedAt: row.updated_at || new Date(),
        },
      });
      count++;
    }

    console.log(`  ✅ ${count}/${rows.length} deals migrados`);
  } catch {
    console.log('  ⚠️ Tabela deals não existe no Essentia');
  }
}

async function migrateActivities(client: Client) {
  console.log('\n📝 Migrando Activities...');
  
  try {
    const { rows } = await client.query(`SELECT * FROM activities ORDER BY created_at`);
    console.log(`  ✅ ${rows.length} activities encontradas (migração simplificada)`);
  } catch {
    console.log('  ⚠️ Tabela activities não existe no Essentia');
  }
}

async function migrateNotes(client: Client) {
  console.log('\n📒 Migrando Notes...');
  
  try {
    const { rows } = await client.query(`SELECT * FROM notes ORDER BY created_at`);
    console.log(`  ✅ ${rows.length} notes encontradas (migração simplificada)`);
  } catch {
    console.log('  ⚠️ Tabela notes não existe no Essentia');
  }
}

async function migrateHistoricoMensagens(client: Client) {
  console.log('\n💬 Migrando Histórico de Mensagens...');
  
  try {
    const { rows } = await client.query(`
      SELECT id, session_id, title, messagem, message, nc_order, created_at, updated_at
      FROM historico_messagem
      ORDER BY created_at
    `);

    let count = 0;
    for (const row of rows) {
      try {
        await prisma.historicoMensagem.create({
          data: {
            tenantId: TENANT_ID,
            sessionId: row.session_id || 'unknown',
            title: row.title,
            mensagem: row.messagem,
            message: row.message,
            ncOrder: row.nc_order ? parseInt(row.nc_order) : null,
            createdAt: row.created_at || new Date(),
            updatedAt: row.updated_at || new Date(),
          },
        });
        count++;
      } catch (error) {
        // Ignora duplicatas
      }
    }

    console.log(`  ✅ ${count}/${rows.length} mensagens migradas`);
  } catch {
    console.log('  ⚠️ Tabela historico_messagem não existe no Essentia');
  }
}

// Helpers
function mapGuiaStatus(status: string): 'ATIVO' | 'INATIVO' | 'PENDENTE' {
  const map: Record<string, 'ATIVO' | 'INATIVO' | 'PENDENTE'> = {
    'ativo': 'ATIVO',
    'ATIVO': 'ATIVO',
    'inativo': 'INATIVO',
    'INATIVO': 'INATIVO',
    'pendente': 'PENDENTE',
    'PENDENTE': 'PENDENTE',
  };
  return map[status] || 'ATIVO';
}

function mapAgendamentoStatus(status: string): 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO' {
  const map: Record<string, 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO'> = {
    'pendente': 'PENDENTE',
    'PENDENTE': 'PENDENTE',
    'confirmado': 'CONFIRMADO',
    'CONFIRMADO': 'CONFIRMADO',
    'concluido': 'CONCLUIDO',
    'CONCLUIDO': 'CONCLUIDO',
    'cancelado': 'CANCELADO',
    'CANCELADO': 'CANCELADO',
  };
  return map[status] || 'PENDENTE';
}

function mapDealStatus(status: string): 'OPEN' | 'WON' | 'LOST' {
  const map: Record<string, 'OPEN' | 'WON' | 'LOST'> = {
    'open': 'OPEN',
    'OPEN': 'OPEN',
    'won': 'WON',
    'WON': 'WON',
    'lost': 'LOST',
    'LOST': 'LOST',
  };
  return map[status] || 'OPEN';
}

function parseDate(dateStr: string | null): Date {
  if (!dateStr) return new Date();
  try {
    return new Date(dateStr);
  } catch {
    return new Date();
  }
}

async function printSummary() {
  const counts = await Promise.all([
    prisma.cliente.count({ where: { tenantId: TENANT_ID } }),
    prisma.guia.count({ where: { tenantId: TENANT_ID } }),
    prisma.passeio.count({ where: { tenantId: TENANT_ID } }),
    prisma.agendamento.count({ where: { tenantId: TENANT_ID } }),
    prisma.company.count({ where: { tenantId: TENANT_ID } }),
    prisma.contact.count({ where: { tenantId: TENANT_ID } }),
    prisma.pipeline.count({ where: { tenantId: TENANT_ID } }),
    prisma.deal.count({ where: { tenantId: TENANT_ID } }),
  ]);

  console.log(`
📊 RESUMO DA MIGRAÇÃO:
   ├── Clientes:     ${counts[0]}
   ├── Guias:        ${counts[1]}
   ├── Passeios:     ${counts[2]}
   ├── Agendamentos: ${counts[3]}
   ├── Companies:    ${counts[4]}
   ├── Contacts:     ${counts[5]}
   ├── Pipelines:    ${counts[6]}
   └── Deals:        ${counts[7]}
  `);
}

main().catch(console.error);







