import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // PLANOS
  // ============================================
  const plans = [
    {
      name: 'Start',
      slug: 'start',
      description: 'Para pequenos negócios que estão começando com automação.',
      priceMonthly: 49.00,
      priceCurrency: 'CHF',
      maxWorkflows: 5,
      maxExecutionsPerMonth: 500,
      maxUsers: 2,
      features: [
        'Hospedagem + VPS MooveLabs',
        'Banco PostgreSQL',
        'n8n com até 5 workflows',
        'Monitoramento básico',
        'SSL + segurança',
        '2 integrações (WhatsApp, Email, CRM simples)',
      ],
      isActive: true,
      isPublic: true,
    },
    {
      name: 'Professional',
      slug: 'professional',
      description: 'Para empresas que querem automações reais no dia a dia.',
      priceMonthly: 149.00,
      priceCurrency: 'CHF',
      maxWorkflows: 15,
      maxExecutionsPerMonth: 2000,
      maxUsers: 5,
      features: [
        'Tudo do Start',
        '15 workflows n8n',
        'IA integrada (Gemini/OpenAI)',
        'Integrações com CRM, ERP, sites e APIs',
        'Dashboards simples',
        'Banco dedicado',
        'Suporte profissional (até 10h/mês)',
      ],
      isActive: true,
      isPublic: true,
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Para empresas que dependem de automações e querem performance.',
      priceMonthly: 299.00,
      priceCurrency: 'CHF',
      maxWorkflows: 100,
      maxExecutionsPerMonth: 10000,
      maxUsers: 20,
      features: [
        'Workflows ilimitados',
        'IA com treinamento personalizado',
        'Monitoramento 24/7',
        'Banco dedicado + backups automáticos',
        'VPS otimizada',
        'Customizações avançadas',
        'Suporte premium (tempo prioritário)',
      ],
      isActive: true,
      isPublic: true,
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'CRM desenvolvido sob medida pela MooveLabs com IA integrada.',
      priceMonthly: 990.00,
      priceCurrency: 'CHF',
      maxWorkflows: 999,
      maxExecutionsPerMonth: 99999,
      maxUsers: 999,
      features: [
        'Desenvolvimento de CRM 100% personalizado',
        'Infraestrutura completa MooveLabs',
        'IA integrada ao CRM',
        'Painéis administrativos',
        'Usuários ilimitados',
        'Relatórios + módulos personalizados',
        'Integração com automações n8n',
        'Suporte premium dedicado',
        'Hospedagem + banco dedicado + segurança',
      ],
      isActive: true,
      isPublic: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
    console.log(`  ✅ Plano "${plan.name}" criado/atualizado`);
  }

  // ============================================
  // TEMPLATES DE AUTOMAÇÃO (exemplos)
  // ============================================
  const templates = [
    {
      name: 'Captura de Leads WhatsApp',
      slug: 'lead-capture-whatsapp',
      description: 'Recebe mensagens do WhatsApp e salva os leads em uma planilha Google Sheets.',
      category: 'marketing',
      icon: '📱',
      requiredInputs: [
        { key: 'whatsappToken', label: 'Token do WhatsApp Business', type: 'password' },
        { key: 'sheetId', label: 'ID da Planilha Google Sheets', type: 'text' },
      ],
      workflowJson: {
        // JSON simplificado do workflow n8n
        nodes: [
          {
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            parameters: { path: 'whatsapp-lead' },
            position: [250, 300],
          },
        ],
        connections: {},
      },
      isActive: true,
      isPublic: true,
    },
    {
      name: 'Notificação de Pedido',
      slug: 'order-notification',
      description: 'Envia notificação via email e WhatsApp quando um novo pedido é criado.',
      category: 'sales',
      icon: '🛒',
      requiredInputs: [
        { key: 'emailTo', label: 'Email de notificação', type: 'email' },
        { key: 'whatsappNumber', label: 'Número WhatsApp', type: 'phone' },
      ],
      workflowJson: {
        nodes: [
          {
            name: 'Webhook Pedido',
            type: 'n8n-nodes-base.webhook',
            parameters: { path: 'new-order' },
            position: [250, 300],
          },
        ],
        connections: {},
      },
      isActive: true,
      isPublic: true,
    },
    {
      name: 'Resposta Automática Email',
      slug: 'auto-reply-email',
      description: 'Responde automaticamente emails recebidos com mensagem personalizada.',
      category: 'support',
      icon: '✉️',
      requiredInputs: [
        { key: 'imapHost', label: 'Servidor IMAP', type: 'text' },
        { key: 'imapUser', label: 'Email', type: 'email' },
        { key: 'imapPassword', label: 'Senha', type: 'password' },
        { key: 'replyMessage', label: 'Mensagem de resposta', type: 'textarea' },
      ],
      workflowJson: {
        nodes: [
          {
            name: 'Email Trigger',
            type: 'n8n-nodes-base.emailReadImap',
            parameters: {},
            position: [250, 300],
          },
        ],
        connections: {},
      },
      isActive: true,
      isPublic: true,
    },
  ];

  for (const template of templates) {
    await prisma.automationTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
    console.log(`  ✅ Template "${template.name}" criado/atualizado`);
  }

  console.log('\n🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

