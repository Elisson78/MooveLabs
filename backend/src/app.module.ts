import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { PlansModule } from './modules/plans/plans.module';
import { N8nModule } from './modules/n8n/n8n.module';
import { TenantInterceptor, TenantGuard } from './common/tenant';

@Module({
  imports: [
    // Config module - carrega .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env', // Arquivo na raiz do projeto
    }),
    
    // Database
    PrismaModule,
    
    // Feature modules
    AuthModule,
    TenantsModule,
    UsersModule,
    AutomationsModule,
    PlansModule,
    N8nModule,
  ],
  providers: [
    // Global Interceptor - injeta tenant context em cada request
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
    // Global Guard - valida acesso ao tenant (após JwtAuthGuard)
    // Nota: Este guard só é ativado em rotas protegidas
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
  ],
})
export class AppModule {}

