import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { getCurrentTenantId, hasTenantContext } from '../../common/tenant/tenant.context';

// Modelos que NÃO precisam de tenant (tabelas globais)
const GLOBAL_MODELS = [
  'tenant',
  'plan',
  'automationTemplate',
  'session', // Se tiver
];

// Modelos que precisam de tenantId
const TENANT_MODELS = [
  'user',
  'subscription',
  'automationInstance',
  'automationExecution',
  'apiKey',
  'company',
  'contact',
  'deal',
  'pipeline',
  'pipelineStage',
  'activity',
  'note',
  'tag',
  'integrationWebhook',
  'eventLog',
  'passeio',
  'guia',
  'cliente',
  'agendamento',
  'historicoMensagem',
];

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['warn', 'error']
        : ['error'],
    });

    // Middleware para injetar tenantId automaticamente em queries
    this.$use(async (params, next) => {
      const model = params.model?.toLowerCase();
      
      // Se não é um modelo com tenant, prossegue normalmente
      if (!model || GLOBAL_MODELS.includes(model)) {
        return next(params);
      }

      // Verifica se é um modelo que precisa de tenant
      const needsTenant = TENANT_MODELS.some(
        (m) => m.toLowerCase() === model
      );

      if (!needsTenant) {
        return next(params);
      }

      // Se não há contexto de tenant, prossegue (pode ser uma operação de sistema)
      if (!hasTenantContext()) {
        console.warn(`⚠️ Query sem tenant context: ${params.model}.${params.action}`);
        return next(params);
      }

      const tenantId = getCurrentTenantId();

      // Injeta tenantId nas operações de leitura
      if (['findUnique', 'findFirst', 'findMany', 'count', 'aggregate', 'groupBy'].includes(params.action)) {
        params.args = params.args || {};
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
      }

      // Injeta tenantId nas operações de criação
      if (['create', 'createMany'].includes(params.action)) {
        if (params.action === 'create') {
          params.args.data = {
            ...params.args.data,
            tenantId,
          };
        } else if (params.action === 'createMany') {
          params.args.data = params.args.data.map((item: any) => ({
            ...item,
            tenantId,
          }));
        }
      }

      // Injeta tenantId nas operações de update
      if (['update', 'updateMany', 'upsert'].includes(params.action)) {
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
      }

      // Injeta tenantId nas operações de delete
      if (['delete', 'deleteMany'].includes(params.action)) {
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
      }

      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Executa uma query RAW com filtro de tenant
   * Útil para queries complexas
   */
  async $queryRawWithTenant<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Promise<T> {
    if (!hasTenantContext()) {
      throw new Error('Tenant context required for raw queries');
    }
    const tenantId = getCurrentTenantId();
    // Adiciona tenantId aos values
    return this.$queryRaw<T>(query, ...values, tenantId);
  }

  /**
   * Cria um cliente "scoped" para um tenant específico
   * Útil para migrations, jobs, scripts
   */
  forTenant(tenantId: string) {
    return {
      tenantId,
      // Retorna o prisma client normal, mas o middleware vai usar o tenantId do contexto
      // Para forçar um tenant específico, use runWithTenant()
    };
  }

  // Helper para limpar banco em testes
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase só pode ser usado em ambiente de teste');
    }
    
    // Ordem importante por causa das foreign keys
    await this.eventLog.deleteMany();
    await this.integrationWebhook.deleteMany();
    await this.note.deleteMany();
    await this.activity.deleteMany();
    await this.deal.deleteMany();
    await this.pipelineStage.deleteMany();
    await this.pipeline.deleteMany();
    await this.contact.deleteMany();
    await this.company.deleteMany();
    await this.tag.deleteMany();
    await this.historicoMensagem.deleteMany();
    await this.agendamento.deleteMany();
    await this.guia.deleteMany();
    await this.passeio.deleteMany();
    await this.cliente.deleteMany();
    await this.automationExecution.deleteMany();
    await this.automationInstance.deleteMany();
    await this.automationTemplate.deleteMany();
    await this.apiKey.deleteMany();
    await this.subscription.deleteMany();
    await this.user.deleteMany();
    await this.tenant.deleteMany();
    await this.plan.deleteMany();
  }
}
