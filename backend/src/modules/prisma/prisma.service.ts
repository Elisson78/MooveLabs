import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper para limpar banco em testes
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase só pode ser usado em ambiente de teste');
    }
    
    // Ordem importante por causa das foreign keys
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

