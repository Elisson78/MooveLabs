import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lista todos os planos públicos
   */
  async findAllPublic() {
    return this.prisma.plan.findMany({
      where: { isActive: true, isPublic: true },
      orderBy: { priceMonthly: 'asc' },
    });
  }

  /**
   * Busca plano por ID
   */
  async findById(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    return plan;
  }

  /**
   * Busca plano por slug
   */
  async findBySlug(slug: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { slug },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    return plan;
  }

  /**
   * Retorna assinatura do tenant
   */
  async getTenantSubscription(tenantId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    // Calcula uso atual
    const executionsThisMonth = await this.prisma.automationExecution.count({
      where: {
        tenantId,
        startedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const activeWorkflows = await this.prisma.automationInstance.count({
      where: { tenantId, status: 'ACTIVE' },
    });

    return {
      ...subscription,
      usage: {
        executions: {
          used: executionsThisMonth,
          limit: subscription.plan.maxExecutionsPerMonth,
          percentUsed: Math.round(
            (executionsThisMonth / subscription.plan.maxExecutionsPerMonth) * 100,
          ),
        },
        workflows: {
          active: activeWorkflows,
          limit: subscription.plan.maxWorkflows,
          percentUsed: Math.round(
            (activeWorkflows / subscription.plan.maxWorkflows) * 100,
          ),
        },
      },
    };
  }

  /**
   * Verifica se tenant pode executar mais automações
   */
  async canExecute(tenantId: string): Promise<{ allowed: boolean; reason?: string }> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!subscription) {
      return { allowed: false, reason: 'Nenhuma assinatura encontrada' };
    }

    if (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING') {
      return { allowed: false, reason: 'Assinatura inativa' };
    }

    // Verifica limite de execuções
    const executionsThisMonth = await this.prisma.automationExecution.count({
      where: {
        tenantId,
        startedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    if (executionsThisMonth >= subscription.plan.maxExecutionsPerMonth) {
      return {
        allowed: false,
        reason: `Limite de ${subscription.plan.maxExecutionsPerMonth} execuções/mês atingido`,
      };
    }

    return { allowed: true };
  }

  /**
   * Incrementa contador de execuções da assinatura
   */
  async incrementExecutions(tenantId: string) {
    await this.prisma.subscription.update({
      where: { tenantId },
      data: { executionsUsed: { increment: 1 } },
    });
  }
}

