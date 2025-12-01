import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Site Next.js
      'http://localhost:3001',  // Site Docker
      'http://localhost:3003',  // Dashboard
      'https://moovelabs.com',
      'https://app.moovelabs.com',
    ],
    credentials: true,
  });
  
  // Validation pipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Erro se propriedades extras
      transform: true,           // Transforma tipos automaticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('MooveLabs API')
    .setDescription('API do SaaS de Automações MooveLabs')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação')
    .addTag('tenants', 'Gestão de Tenants')
    .addTag('users', 'Gestão de Usuários')
    .addTag('automations', 'Automações')
    .addTag('plans', 'Planos e Assinaturas')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Start server
  const port = process.env.BACKEND_PORT || 3002;
  await app.listen(port);
  
  console.log(`
🚀 MooveLabs Backend running!
📍 API: http://localhost:${port}/api
📚 Docs: http://localhost:${port}/api/docs
  `);
}

bootstrap();

