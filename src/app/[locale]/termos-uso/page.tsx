'use client';

import React, { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, AlertTriangle, Shield, Users, Ban, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TermosUso({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  return (
    <main className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          {locale === 'pt' ? 'Voltar para a página inicial' : 'Retour à la page d\'accueil'}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <FileText size={40} className="text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-bold">Termos de Uso</h1>
          </div>

          <p className="text-gray-400 mb-8 text-lg">
            Última atualização: {new Date().toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Scale size={24} className="text-blue-500" />
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e utilizar os serviços da MooveLabs ("nós", "nosso" ou "empresa"), incluindo nosso site, aplicativos, plataformas de automação e serviços relacionados, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users size={24} className="text-blue-500" />
                2. Descrição dos Serviços
              </h2>
              <p className="mb-4">
                A MooveLabs oferece os seguintes serviços:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Desenvolvimento de aplicativos móveis e web</li>
                <li>Plataformas de automação de processos empresariais</li>
                <li>Agentes de inteligência artificial para atendimento ao cliente</li>
                <li>Desenvolvimento de sistemas CRM personalizados</li>
                <li>Hospedagem e infraestrutura de tecnologia</li>
                <li>Consultoria e suporte técnico</li>
              </ul>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">3. Cadastro e Conta de Usuário</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">3.1. Elegibilidade</h3>
                  <p>Você deve ter pelo menos 18 anos de idade e capacidade legal para celebrar contratos vinculativos para utilizar nossos serviços.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">3.2. Responsabilidades da Conta</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Você é responsável por manter a confidencialidade de suas credenciais de acesso</li>
                    <li>Você é responsável por todas as atividades que ocorrem em sua conta</li>
                    <li>Você deve notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
                    <li>Você deve fornecer informações precisas e atualizadas durante o cadastro</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Ban size={24} className="text-blue-500" />
                4. Uso Aceitável
              </h2>
              <p className="mb-4">Você concorda em NÃO:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utilizar nossos serviços para qualquer finalidade ilegal ou não autorizada</li>
                <li>Violar qualquer lei local, estadual, nacional ou internacional</li>
                <li>Transmitir vírus, malware ou qualquer código malicioso</li>
                <li>Tentar obter acesso não autorizado a nossos sistemas ou contas de outros usuários</li>
                <li>Interferir ou interromper a integridade ou desempenho de nossos serviços</li>
                <li>Copiar, modificar, distribuir ou criar trabalhos derivados de nossos serviços sem autorização</li>
                <li>Utilizar nossos serviços para enviar spam, phishing ou comunicações fraudulentas</li>
                <li>Violar direitos de propriedade intelectual de terceiros</li>
                <li>Coletar ou armazenar dados pessoais de outros usuários sem consentimento</li>
              </ul>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">5. Propriedade Intelectual</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">5.1. Nossos Direitos</h3>
                  <p>
                    Todos os direitos de propriedade intelectual relacionados aos nossos serviços, incluindo software, design, logotipos, marcas e conteúdo, são de propriedade da MooveLabs ou de nossos licenciadores.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">5.2. Seu Conteúdo</h3>
                  <p>
                    Você mantém todos os direitos sobre o conteúdo que você cria, envia ou armazena através de nossos serviços. Ao utilizar nossos serviços, você nos concede uma licença limitada, não exclusiva e mundial para usar, reproduzir e processar seu conteúdo apenas na medida necessária para fornecer os serviços.
                  </p>
                </div>
              </div>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">6. Pagamentos e Faturamento</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">6.1. Preços</h3>
                  <p>
                    Os preços de nossos serviços são exibidos em nossa plataforma e podem ser alterados a qualquer momento. Alterações de preço não afetarão planos já contratados durante o período de vigência do contrato.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">6.2. Pagamento</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Os pagamentos são processados através de métodos seguros de pagamento</li>
                    <li>Você é responsável por fornecer informações de pagamento precisas</li>
                    <li>Taxas podem ser aplicadas para transações internacionais</li>
                    <li>Pagamentos não reembolsáveis, salvo conforme especificado em contrato específico</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">6.3. Renovação e Cancelamento</h3>
                  <p>
                    Planos recorrentes são renovados automaticamente, a menos que você cancele antes do final do período de faturamento. Você pode cancelar sua assinatura a qualquer momento através das configurações da sua conta.
                  </p>
                </div>
              </div>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitação de Responsabilidade</h2>
              <p className="mb-4">
                NOSSOS SERVIÇOS SÃO FORNECIDOS "COMO ESTÃO" E "CONFORME DISPONÍVEIS". NA MÁXIMA EXTENSÃO PERMITIDA POR LEI, A MOOVELABS NÃO SE RESPONSABILIZA POR:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Danos diretos, indiretos, incidentais, especiais ou consequenciais</li>
                <li>Perda de dados, receitas, lucros ou oportunidades de negócio</li>
                <li>Interrupções ou indisponibilidade dos serviços</li>
                <li>Erros, bugs ou defeitos técnicos</li>
                <li>Ações de terceiros ou conteúdo de terceiros</li>
              </ul>
              <p className="mt-4">
                Nossa responsabilidade total não excederá o valor pago por você nos últimos 12 meses pelos serviços que deram origem à reivindicação.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield size={24} className="text-blue-500" />
                8. Indenização
              </h2>
              <p>
                Você concorda em indenizar, defender e isentar a MooveLabs, seus afiliados, diretores, funcionários e agentes de quaisquer reivindicações, danos, obrigações, perdas, responsabilidades, custos ou dívidas, e despesas (incluindo honorários advocatícios) decorrentes de seu uso dos serviços, violação destes Termos, ou violação de qualquer direito de terceiros.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">9. Modificações dos Serviços</h2>
              <p>
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto de nossos serviços a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis perante você ou terceiros por qualquer modificação, suspensão ou descontinuação dos serviços.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">10. Rescisão</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">10.1. Por Você</h3>
                  <p>Você pode encerrar sua conta a qualquer momento através das configurações da sua conta ou entrando em contato conosco.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">10.2. Por Nós</h3>
                  <p>
                    Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, se você violar estes Termos, usar nossos serviços de forma fraudulenta, ou por qualquer outro motivo que consideremos apropriado.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">10.3. Efeitos da Rescisão</h3>
                  <p>
                    Após a rescisão, seu direito de usar os serviços cessará imediatamente. Podemos excluir sua conta e dados após um período razoável, conforme nossa Política de Privacidade.
                  </p>
                </div>
              </div>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">11. Lei Aplicável e Jurisdição</h2>
              <p>
                Estes Termos são regidos pelas leis da Suíça. Qualquer disputa decorrente ou relacionada a estes Termos será submetida à jurisdição exclusiva dos tribunais competentes de Genève, Suíça.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={24} className="text-blue-500" />
                12. Disposições Gerais
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">12.1. Acordo Completo</h3>
                  <p>Estes Termos constituem o acordo completo entre você e a MooveLabs em relação ao uso dos serviços.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">12.2. Divisibilidade</h3>
                  <p>Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">12.3. Renúncia</h3>
                  <p>O fato de não exercermos qualquer direito previsto nestes Termos não constitui renúncia a tal direito.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">12.4. Alterações</h3>
                  <p>
                    Podemos modificar estes Termos a qualquer momento. Alterações significativas serão notificadas através de nossos serviços ou por e-mail. O uso continuado dos serviços após as alterações constitui aceitação dos novos termos.
                  </p>
                </div>
              </div>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">13. Contato</h2>
              <p className="mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="bg-black/50 p-4 rounded-lg">
                <p className="font-semibold text-white mb-2">MooveLabs</p>
                <p className="text-gray-400">Rue de Lyon 106, Genève, Suíça</p>
                <p className="text-gray-400 mt-2">
                  E-mail: <a href="mailto:contato@moovelabs.com" className="text-blue-400 hover:text-blue-300">contato@moovelabs.com</a>
                </p>
                <p className="text-gray-400">
                  WhatsApp: <a href="https://wa.me/41779661285" className="text-blue-400 hover:text-blue-300">+41 77 966 12 85</a>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              {locale === 'pt' ? 'Voltar para a página inicial' : 'Retour à la page d\'accueil'}
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
