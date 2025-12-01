import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { PlansModule } from './modules/plans/plans.module';
import { N8nModule } from './modules/n8n/n8n.module';

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
})
export class AppModule {}

