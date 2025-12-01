import { Controller, Post, Body, Headers, Logger, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { PlansService } from '../plans/plans.service';

interface N8nWebhookPayload {
  executionId: string;
  workflowId: string;
  status: 'success' | 'error' | 'running';
  startedAt?: string;
  finishedAt?: string;
  error?: string;
  data?: any;
}

/**
 * Controller para receber webhooks do n8n
 * 
 * O n8n pode ser configurado para enviar notificações
 * quando execuções terminam (sucesso ou erro)
 */
@ApiTags('n8n-webhook')
@Controller('webhooks/n8n')
export class N8nWebhookController {
  private readonly logger = new Logger(N8nWebhookController.name);

  constructor(
    private prisma: PrismaService,
    private plansService: PlansService,
  ) {}

  /**
   * Recebe webhook de execução do n8n
   */
  @Post('execution')
  @HttpCode(200)
  @ApiExcludeEndpoint() // Não mostrar na documentação pública
  async handleExecution(
    @Body() payload: N8nWebhookPayload,
    @Headers('x-n8n-signature') signature: string,
  ) {
    this.logger.log(`Webhook recebido: ${payload.executionId} - ${payload.status}`);

    // TODO: Validar assinatura do webhook para segurança

    // Busca a automação pelo workflowId do n8n
    const automation = await this.prisma.automationInstance.findFirst({
      where: { n8nWorkflowId: payload.workflowId },
    });

    if (!automation) {
      this.logger.warn(`Automação não encontrada para workflow: ${payload.workflowId}`);
      return { received: true, processed: false };
    }

    // Mapeia status do n8n para nosso enum
    const statusMap: Record<string, 'RUNNING' | 'SUCCESS' | 'ERROR'> = {
      running: 'RUNNING',
      success: 'SUCCESS',
      error: 'ERROR',
    };

    // Cria ou atualiza registro de execução
    const execution = await this.prisma.automationExecution.upsert({
      where: { n8nExecutionId: payload.executionId },
      create: {
        n8nExecutionId: payload.executionId,
        tenantId: automation.tenantId,
        automationInstanceId: automation.id,
        status: statusMap[payload.status] || 'RUNNING',
        inputData: payload.data,
        startedAt: payload.startedAt ? new Date(payload.startedAt) : new Date(),
      },
      update: {
        status: statusMap[payload.status] || 'RUNNING',
        finishedAt: payload.finishedAt ? new Date(payload.finishedAt) : undefined,
        outputData: payload.data,
        errorMessage: payload.error,
        durationMs: payload.startedAt && payload.finishedAt
          ? new Date(payload.finishedAt).getTime() - new Date(payload.startedAt).getTime()
          : undefined,
      },
    });

    // Se a execução foi bem sucedida, incrementa contador
    if (payload.status === 'success') {
      await this.plansService.incrementExecutions(automation.tenantId);

      // Atualiza stats da automação
      await this.prisma.automationInstance.update({
        where: { id: automation.id },
        data: {
          executionCount: { increment: 1 },
          lastExecutedAt: new Date(),
        },
      });
    }

    // Se houve erro, incrementa contador de erros
    if (payload.status === 'error') {
      await this.prisma.automationInstance.update({
        where: { id: automation.id },
        data: { errorCount: { increment: 1 } },
      });
    }

    return { received: true, processed: true, executionId: execution.id };
  }
}

