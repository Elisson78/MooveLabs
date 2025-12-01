import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Busca tenant por ID
   */
  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        subscription: {
          include: { plan: true },
        },
        _count: {
          select: {
            users: true,
            automationInstances: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant não encontrado');
    }

    return tenant;
  }

  /**
   * Busca tenant por slug
   */
  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant não encontrado');
    }

    return tenant;
  }

  /**
   * Atualiza dados do tenant
   */
  async update(id: string, dto: UpdateTenantDto) {
    // Verifica se existe
    await this.findById(id);

    return this.prisma.tenant.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Retorna estatísticas do tenant
   */
  async getStats(tenantId: string) {
    const [
      usersCount,
      automationsCount,
      activeAutomationsCount,
      executionsThisMonth,
      subscription,
    ] = await Promise.all([
      this.prisma.user.count({ where: { tenantId } }),
      this.prisma.automationInstance.count({ where: { tenantId } }),
      this.prisma.automationInstance.count({ 
        where: { tenantId, status: 'ACTIVE' } 
      }),
      this.prisma.automationExecution.count({
        where: {
          tenantId,
          startedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.subscription.findUnique({
        where: { tenantId },
        include: { plan: true },
      }),
    ]);

    return {
      users: usersCount,
      automations: {
        total: automationsCount,
        active: activeAutomationsCount,
      },
      executions: {
        thisMonth: executionsThisMonth,
        limit: subscription?.plan.maxExecutionsPerMonth || 0,
        percentUsed: subscription?.plan.maxExecutionsPerMonth 
          ? Math.round((executionsThisMonth / subscription.plan.maxExecutionsPerMonth) * 100)
          : 0,
      },
      plan: subscription?.plan.name || 'Free',
      subscription: subscription ? {
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
      } : null,
    };
  }
}

