import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AutomationTemplate } from '@prisma/client';

interface N8nWorkflowResponse {
  id: string;
  name: string;
  active: boolean;
  webhookUrl?: string;
}

/**
 * Serviço de integração com n8n
 * 
 * Este serviço se comunica com a API do n8n para:
 * - Criar workflows a partir de templates
 * - Ativar/Desativar workflows
 * - Deletar workflows
 * - Buscar status de execuções
 */
@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  private readonly n8nHost: string;
  private readonly n8nApiKey: string;

  constructor(private configService: ConfigService) {
    this.n8nHost = this.configService.get<string>('N8N_HOST', 'http://localhost:5678');
    this.n8nApiKey = this.configService.get<string>('N8N_API_KEY', '');
  }

  /**
   * Headers padrão para requisições ao n8n
   */
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': this.n8nApiKey,
    };
  }

  /**
   * Cria um workflow no n8n a partir de um template
   */
  async createWorkflowFromTemplate(
    template: AutomationTemplate,
    config: object,
    name: string,
  ): Promise<N8nWorkflowResponse> {
    this.logger.log(`Criando workflow: ${name}`);

    // Obtém o JSON do workflow do template
    const workflowJson = template.workflowJson as any;

    // Substitui placeholders de configuração no workflow
    const customizedWorkflow = this.customizeWorkflow(workflowJson, config);

    // Cria o workflow no n8n
    const response = await fetch(`${this.n8nHost}/api/v1/workflows`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name,
        nodes: customizedWorkflow.nodes || [],
        connections: customizedWorkflow.connections || {},
        settings: customizedWorkflow.settings || {},
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Erro ao criar workflow: ${error}`);
      throw new Error(`Erro ao criar workflow no n8n: ${error}`);
    }

    const data = await response.json();
    
    // Extrai URL do webhook se houver
    const webhookNode = data.nodes?.find((n: any) => n.type === 'n8n-nodes-base.webhook');
    const webhookUrl = webhookNode 
      ? `${this.n8nHost}/webhook/${data.id}/${webhookNode.parameters?.path || ''}` 
      : undefined;

    return {
      id: data.id,
      name: data.name,
      active: data.active,
      webhookUrl,
    };
  }

  /**
   * Ativa um workflow no n8n
   */
  async activateWorkflow(workflowId: string): Promise<void> {
    this.logger.log(`Ativando workflow: ${workflowId}`);

    const response = await fetch(`${this.n8nHost}/api/v1/workflows/${workflowId}/activate`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Erro ao ativar workflow: ${error}`);
      throw new Error(`Erro ao ativar workflow: ${error}`);
    }
  }

  /**
   * Desativa um workflow no n8n
   */
  async deactivateWorkflow(workflowId: string): Promise<void> {
    this.logger.log(`Desativando workflow: ${workflowId}`);

    const response = await fetch(`${this.n8nHost}/api/v1/workflows/${workflowId}/deactivate`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Erro ao desativar workflow: ${error}`);
      throw new Error(`Erro ao desativar workflow: ${error}`);
    }
  }

  /**
   * Deleta um workflow no n8n
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    this.logger.log(`Deletando workflow: ${workflowId}`);

    const response = await fetch(`${this.n8nHost}/api/v1/workflows/${workflowId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Erro ao deletar workflow: ${error}`);
      throw new Error(`Erro ao deletar workflow: ${error}`);
    }
  }

  /**
   * Busca status de uma execução
   */
  async getExecution(executionId: string): Promise<any> {
    const response = await fetch(`${this.n8nHost}/api/v1/executions/${executionId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Execução não encontrada');
    }

    return response.json();
  }

  /**
   * Dispara uma execução manual de um workflow
   */
  async triggerWorkflow(workflowId: string, data?: object): Promise<any> {
    this.logger.log(`Disparando workflow: ${workflowId}`);

    const response = await fetch(`${this.n8nHost}/api/v1/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao executar workflow: ${error}`);
    }

    return response.json();
  }

  /**
   * Customiza workflow substituindo variáveis de configuração
   */
  private customizeWorkflow(workflow: any, config: object): any {
    // Converte para string para fazer substituições
    let workflowStr = JSON.stringify(workflow);

    // Substitui placeholders {{config.key}} pelos valores
    for (const [key, value] of Object.entries(config)) {
      const placeholder = `{{config.${key}}}`;
      workflowStr = workflowStr.split(placeholder).join(String(value));
    }

    return JSON.parse(workflowStr);
  }
}

