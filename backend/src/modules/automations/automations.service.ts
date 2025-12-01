import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { N8nService } from '../n8n/n8n.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { AutomationStatus } from '@prisma/client';

@Injectable()
export class AutomationsService {
  constructor(
    private prisma: PrismaService,
    private n8nService: N8nService,
  ) {}

  // ============================================
  // TEMPLATES (públicos, disponíveis para todos)
  // ============================================

  /**
   * Lista todos os templates ativos
   */
  async findAllTemplates() {
    return this.prisma.automationTemplate.findMany({
      where: { isActive: true, isPublic: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        icon: true,
        requiredInputs: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Busca template por ID
   */
  async findTemplateById(id: string) {
    const template = await this.prisma.automationTemplate.findUnique({
      where: { id },
    });

    if (!template || !template.isActive) {
      throw new NotFoundException('Template não encontrado');
    }

    return template;
  }

  // ============================================
  // AUTOMATIONS (instâncias por tenant)
  // ============================================

  /**
   * Lista automações do tenant
   */
  async findAllByTenant(tenantId: string) {
    return this.prisma.automationInstance.findMany({
      where: { tenantId },
      include: {
        template: {
          select: { name: true, category: true, icon: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Busca automação por ID (validando tenant)
   */
  async findById(id: string, tenantId: string) {
    const automation = await this.prisma.automationInstance.findFirst({
      where: { id, tenantId },
      include: {
        template: true,
        _count: { select: { executions: true } },
      },
    });

    if (!automation) {
      throw new NotFoundException('Automação não encontrada');
    }

    return automation;
  }

  /**
   * Cria automação a partir de um template
   */
  async create(tenantId: string, dto: CreateAutomationDto) {
    // Verifica limite do plano
    await this.checkWorkflowLimit(tenantId);

    // Busca template se especificado
    let template = null;
    if (dto.templateId) {
      template = await this.findTemplateById(dto.templateId);
    }

    // Cria instância da automação
    const automation = await this.prisma.automationInstance.create({
      data: {
        name: dto.name,
        description: dto.description,
        tenantId,
        templateId: dto.templateId,
        config: dto.config || {},
        status: 'INACTIVE',
      },
      include: { template: true },
    });

    return automation;
  }

  /**
   * Atualiza automação
   */
  async update(id: string, tenantId: string, dto: UpdateAutomationDto) {
    const automation = await this.findById(id, tenantId);

    // Se estiver tentando ativar, verifica limites
    if (dto.status === 'ACTIVE' && automation.status !== 'ACTIVE') {
      await this.checkWorkflowLimit(tenantId, true);
    }

    return this.prisma.automationInstance.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Ativa automação (cria workflow no n8n se necessário)
   */
  async activate(id: string, tenantId: string) {
    const automation = await this.findById(id, tenantId);

    // Verifica limite
    await this.checkWorkflowLimit(tenantId, true);

    // Se tem template e não tem workflow no n8n, cria
    if (automation.template && !automation.n8nWorkflowId) {
      try {
        const n8nWorkflow = await this.n8nService.createWorkflowFromTemplate(
          automation.template,
          automation.config as object,
          `${automation.name} - ${tenantId}`,
        );

        await this.prisma.automationInstance.update({
          where: { id },
          data: {
            n8nWorkflowId: n8nWorkflow.id,
            n8nWebhookUrl: n8nWorkflow.webhookUrl,
          },
        });
      } catch (error) {
        throw new BadRequestException('Erro ao criar workflow no n8n: ' + (error as Error).message);
      }
    }

    // Ativa no n8n se tiver workflow
    if (automation.n8nWorkflowId) {
      await this.n8nService.activateWorkflow(automation.n8nWorkflowId);
    }

    return this.prisma.automationInstance.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  /**
   * Desativa automação
   */
  async deactivate(id: string, tenantId: string) {
    const automation = await this.findById(id, tenantId);

    // Desativa no n8n se tiver workflow
    if (automation.n8nWorkflowId) {
      await this.n8nService.deactivateWorkflow(automation.n8nWorkflowId);
    }

    return this.prisma.automationInstance.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }

  /**
   * Remove automação
   */
  async remove(id: string, tenantId: string) {
    const automation = await this.findById(id, tenantId);

    // Remove workflow do n8n se existir
    if (automation.n8nWorkflowId) {
      try {
        await this.n8nService.deleteWorkflow(automation.n8nWorkflowId);
      } catch {
        // Ignora erro se workflow não existir no n8n
      }
    }

    await this.prisma.automationInstance.delete({ where: { id } });

    return { message: 'Automação removida com sucesso' };
  }

  /**
   * Lista execuções da automação
   */
  async getExecutions(id: string, tenantId: string, limit = 50) {
    await this.findById(id, tenantId); // Valida acesso

    return this.prisma.automationExecution.findMany({
      where: { automationInstanceId: id },
      orderBy: { startedAt: 'desc' },
      take: limit,
    });
  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Verifica se tenant pode criar/ativar mais workflows
   */
  private async checkWorkflowLimit(tenantId: string, checkActive = false) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new ForbiddenException('Nenhuma assinatura encontrada');
    }

    if (checkActive) {
      const activeCount = await this.prisma.automationInstance.count({
        where: { tenantId, status: 'ACTIVE' },
      });

      if (activeCount >= subscription.plan.maxWorkflows) {
        throw new ForbiddenException(
          `Limite de ${subscription.plan.maxWorkflows} workflows ativos atingido. Faça upgrade do plano.`,
        );
      }
    }
  }
}

