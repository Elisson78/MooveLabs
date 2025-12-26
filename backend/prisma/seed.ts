import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============================================
  // 1. PLANOS
  // ============================================
  console.log('📋 Criando Planos...');
  
  const plans = [
    {
      id: 'plan_starter',
      name: 'Starter',
      slug: 'starter',
      description: 'Para pequenos negócios começando com automação.',
      priceMonthly: 47.00,
      priceCurrency: 'CHF',
      maxWorkflows: 5,
      maxExecutionsPerMonth: 1000,
      maxUsers: 2,
      features: [
        'Até 5 workflows',
        'CRM básico',
        'Chat integrado',
        'Suporte por email',
      ],
      isActive: true,
      isPublic: true,
    },
    {
      id: 'plan_professional',
      name: 'Professional',
      slug: 'professional',
      description: 'Para equipes que precisam de automações reais.',
      priceMonthly: 147.00,
      priceCurrency: 'CHF',
      maxWorkflows: 15,
      maxExecutionsPerMonth: 5000,
      maxUsers: 5,
      features: [
        'Até 15 workflows',
        'CRM completo',
        'Webhooks',
        'IA integrada',
        'Suporte prioritário',
      ],
      isActive: true,
      isPublic: true,
    },
    {
      id: 'plan_business',
      name: 'Business',
      slug: 'business',
      description: 'Para empresas que dependem de automações.',
      priceMonthly: 297.00,
      priceCurrency: 'CHF',
      maxWorkflows: 50,
      maxExecutionsPerMonth: 25000,
      maxUsers: 15,
      features: [
        'Até 50 workflows',
        'CRM completo + API',
        'Webhooks ilimitados',
        'IA personalizada',
        'Módulo Turismo',
        'Suporte premium',
      ],
      isActive: true,
      isPublic: true,
    },
    {
      id: 'plan_enterprise',
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Solução customizada para grandes empresas.',
      priceMonthly: 597.00,
      priceCurrency: 'CHF',
      maxWorkflows: -1, // Ilimitado
      maxExecutionsPerMonth: -1,
      maxUsers: -1,
      features: [
        'Workflows ilimitados',
        'CRM personalizado',
        'API dedicada',
        'Suporte dedicado 24/7',
        'SLA garantido',
      ],
      isActive: true,
      isPublic: false,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: { ...plan, id: undefined },
      create: plan,
    });
    console.log(`  ✅ Plano "${plan.name}"`);
  }

  // ============================================
  // 2. TENANT ESSENTIA (Primeiro cliente)
  // ============================================
  console.log('\n🏢 Criando Tenant Essentia...');

  const essentiaTenant = await prisma.tenant.upsert({
    where: { slug: 'essentia' },
    update: {},
    create: {
      id: 'essentia_tenant_001',
      name: 'Essentia Travel',
      slug: 'essentia',
      email: 'contato@essentiatravel.com',
      description: 'Agência de turismo na Itália - Primeiro cliente MooveLabs',
      logo: null,
      settings: {
        theme: 'default',
        language: 'pt-BR',
        timezone: 'Europe/Rome',
        currency: 'EUR',
        modules: {
          crm: true,
          turismo: true,
          automations: true,
          chat: true,
        },
      },
      isActive: true,
    },
  });
  console.log(`  ✅ Tenant "${essentiaTenant.name}" (${essentiaTenant.id})`);

  // ============================================
  // 3. SUBSCRIPTION ESSENTIA
  // ============================================
  console.log('\n💳 Criando Subscription...');

  const businessPlan = await prisma.plan.findUnique({ where: { slug: 'business' } });
  
  if (businessPlan) {
    await prisma.subscription.upsert({
      where: { tenantId: essentiaTenant.id },
      update: {},
      create: {
        id: 'sub_essentia_001',
        tenantId: essentiaTenant.id,
        planId: businessPlan.id,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 ano
        executionsUsed: 0,
      },
    });
    console.log(`  ✅ Subscription Business para Essentia`);
  }

  // ============================================
  // 4. USUÁRIO ADMIN ESSENTIA
  // ============================================
  console.log('\n👤 Criando Usuário Admin...');

  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@essentiatravel.com' },
    update: {},
    create: {
      id: 'user_essentia_admin',
      email: 'admin@essentiatravel.com',
      password: hashedPassword,
      name: 'Admin Essentia',
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
      tenantId: essentiaTenant.id,
    },
  });
  console.log(`  ✅ Admin "${adminUser.email}" (senha: Admin@123)`);

  // ============================================
  // 5. PIPELINE PADRÃO
  // ============================================
  console.log('\n📊 Criando Pipeline de Vendas...');

  const pipeline = await prisma.pipeline.upsert({
    where: { id: 'pipe_essentia_default' },
    update: {},
    create: {
      id: 'pipe_essentia_default',
      tenantId: essentiaTenant.id,
      name: 'Pipeline de Vendas',
      description: 'Pipeline padrão para leads e reservas',
      isDefault: true,
      position: 0,
    },
  });
  console.log(`  ✅ Pipeline "${pipeline.name}"`);

  // Stages do Pipeline
  const stages = [
    { id: 'stage_lead', name: 'Novo Lead', position: 0, color: '#6366F1', probability: 10, isClosed: false, isWon: false },
    { id: 'stage_contact', name: 'Primeiro Contato', position: 1, color: '#8B5CF6', probability: 25, isClosed: false, isWon: false },
    { id: 'stage_qualified', name: 'Qualificado', position: 2, color: '#A855F7', probability: 50, isClosed: false, isWon: false },
    { id: 'stage_proposal', name: 'Proposta Enviada', position: 3, color: '#D946EF', probability: 75, isClosed: false, isWon: false },
    { id: 'stage_negotiation', name: 'Negociação', position: 4, color: '#EC4899', probability: 90, isClosed: false, isWon: false },
    { id: 'stage_won', name: 'Ganho', position: 5, color: '#22C55E', probability: 100, isClosed: true, isWon: true },
    { id: 'stage_lost', name: 'Perdido', position: 6, color: '#EF4444', probability: 0, isClosed: true, isWon: false },
  ];

  for (const stage of stages) {
    await prisma.pipelineStage.upsert({
      where: { id: stage.id },
      update: {},
      create: {
        ...stage,
        pipelineId: pipeline.id,
      },
    });
  }
  console.log(`  ✅ ${stages.length} etapas criadas`);

  // ============================================
  // 6. TAGS PADRÃO
  // ============================================
  console.log('\n🏷️ Criando Tags...');

  const tags = [
    { name: 'VIP', color: '#F59E0B' },
    { name: 'Urgente', color: '#EF4444' },
    { name: 'WhatsApp', color: '#22C55E' },
    { name: 'Email', color: '#3B82F6' },
    { name: 'Retorno', color: '#8B5CF6' },
    { name: 'Florença', color: '#EC4899' },
    { name: 'Roma', color: '#F97316' },
    { name: 'Veneza', color: '#06B6D4' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { tenantId_name: { tenantId: essentiaTenant.id, name: tag.name } },
      update: {},
      create: {
        tenantId: essentiaTenant.id,
        ...tag,
      },
    });
  }
  console.log(`  ✅ ${tags.length} tags criadas`);

  // ============================================
  // 7. TEMPLATES DE AUTOMAÇÃO
  // ============================================
  console.log('\n🤖 Criando Templates de Automação...');

  const templates = [
    {
      name: 'Captura de Leads WhatsApp',
      slug: 'lead-capture-whatsapp',
      description: 'Recebe mensagens do WhatsApp e cria leads automaticamente.',
      category: 'marketing',
      icon: '📱',
      requiredInputs: [
        { key: 'whatsappToken', label: 'Token do WhatsApp Business', type: 'password' },
      ],
      workflowJson: { nodes: [], connections: {} },
      isActive: true,
      isPublic: true,
    },
    {
      name: 'Notificação de Reserva',
      slug: 'booking-notification',
      description: 'Envia notificação quando uma nova reserva é criada.',
      category: 'turismo',
      icon: '🎫',
      requiredInputs: [
        { key: 'emailTo', label: 'Email de notificação', type: 'email' },
      ],
      workflowJson: { nodes: [], connections: {} },
      isActive: true,
      isPublic: true,
    },
    {
      name: 'Follow-up Automático',
      slug: 'auto-followup',
      description: 'Envia mensagem de follow-up após X dias sem resposta.',
      category: 'sales',
      icon: '⏰',
      requiredInputs: [
        { key: 'daysDelay', label: 'Dias para follow-up', type: 'number' },
        { key: 'message', label: 'Mensagem', type: 'textarea' },
      ],
      workflowJson: { nodes: [], connections: {} },
      isActive: true,
      isPublic: true,
    },
  ];

  for (const template of templates) {
    await prisma.automationTemplate.upsert({
      where: { slug: template.slug },
      update: {},
      create: template,
    });
    console.log(`  ✅ Template "${template.name}"`);
  }

  // ============================================
  // 8. DADOS DE EXEMPLO (Turismo)
  // ============================================
  console.log('\n🗺️ Criando Passeios de Exemplo...');

  const passeios = [
    {
      id: 'passeio_florenca_arte',
      nome: 'Florença: Arte e História',
      descricao: 'Tour guiado pelos principais museus e igrejas de Florença, incluindo Uffizi e Duomo.',
      preco: 150.00,
      duracao: '4h',
      categoria: 'cultural',
      imagens: ['https://example.com/florenca1.jpg'],
      inclusoes: ['Guia em português', 'Ingressos', 'Água'],
      idiomas: ['pt', 'en', 'it'],
      capacidadeMaxima: 12,
      ativo: true,
    },
    {
      id: 'passeio_toscana_vinhos',
      nome: 'Toscana: Rota dos Vinhos',
      descricao: 'Visita a vinícolas tradicionais com degustação de vinhos e produtos locais.',
      preco: 220.00,
      duracao: '6h',
      categoria: 'gastronomico',
      imagens: ['https://example.com/toscana1.jpg'],
      inclusoes: ['Transporte', 'Guia', 'Degustação', 'Almoço'],
      idiomas: ['pt', 'en'],
      capacidadeMaxima: 8,
      ativo: true,
    },
    {
      id: 'passeio_roma_vaticano',
      nome: 'Roma: Vaticano VIP',
      descricao: 'Acesso prioritário ao Vaticano, Capela Sistina e Basílica de São Pedro.',
      preco: 180.00,
      duracao: '3h',
      categoria: 'cultural',
      imagens: ['https://example.com/vaticano1.jpg'],
      inclusoes: ['Guia especializado', 'Ingresso sem fila', 'Fones de ouvido'],
      idiomas: ['pt', 'en', 'es'],
      capacidadeMaxima: 15,
      ativo: true,
    },
  ];

  for (const passeio of passeios) {
    await prisma.passeio.upsert({
      where: { id: passeio.id },
      update: {},
      create: {
        ...passeio,
        tenantId: essentiaTenant.id,
      },
    });
    console.log(`  ✅ Passeio "${passeio.nome}"`);
  }

  // ============================================
  // 9. GUIA DE EXEMPLO
  // ============================================
  console.log('\n👨‍🏫 Criando Guia de Exemplo...');

  await prisma.guia.upsert({
    where: { tenantId_email: { tenantId: essentiaTenant.id, email: 'marco@essentiatravel.com' } },
    update: {},
    create: {
      tenantId: essentiaTenant.id,
      nome: 'Marco Rossi',
      email: 'marco@essentiatravel.com',
      telefone: '+39 333 1234567',
      biografia: 'Guia licenciado com 10 anos de experiência em Florença e Toscana.',
      especialidades: ['Arte Renascentista', 'História Medieval', 'Gastronomia'],
      idiomas: ['pt', 'en', 'it', 'es'],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 127,
      passeiosRealizados: 342,
      percentualComissao: 25.00,
      status: 'ATIVO',
    },
  });
  console.log(`  ✅ Guia "Marco Rossi"`);

  // ============================================
  // RESUMO FINAL
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('🎉 SEED COMPLETO!');
  console.log('='.repeat(50));
  console.log(`
📊 Resumo:
   • ${plans.length} Planos
   • 1 Tenant (Essentia Travel)
   • 1 Usuário Admin
   • 1 Pipeline com ${stages.length} etapas
   • ${tags.length} Tags
   • ${templates.length} Templates de Automação
   • ${passeios.length} Passeios de exemplo
   • 1 Guia

🔑 Credenciais de acesso:
   Email: admin@essentiatravel.com
   Senha: Admin@123
   Tenant: essentia
`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
