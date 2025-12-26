'use client';

import React, { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, FileText, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PoliticaPrivacidade({ params }: { params: Promise<{ locale: string }> }) {
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
            <Shield size={40} className="text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-bold">Política de Privacidade</h1>
          </div>

          <p className="text-gray-400 mb-8 text-lg">
            Última atualização: {new Date().toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lock size={24} className="text-blue-500" />
                1. Introdução
              </h2>
              <p>
                A MooveLabs ("nós", "nosso" ou "empresa") está comprometida em proteger a privacidade e segurança dos dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossos serviços, incluindo nosso site, aplicativos e plataformas de automação.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye size={24} className="text-blue-500" />
                2. Informações que Coletamos
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">2.1. Informações Fornecidas por Você</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Nome completo e informações de contato (e-mail, telefone)</li>
                    <li>Informações de cadastro e autenticação</li>
                    <li>Dados de pagamento e faturamento</li>
                    <li>Informações sobre sua empresa ou negócio</li>
                    <li>Comunicações e correspondências conosco</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">2.2. Informações Coletadas Automaticamente</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Dados de navegação e uso de nossos serviços</li>
                    <li>Endereço IP e informações do dispositivo</li>
                    <li>Cookies e tecnologias similares</li>
                    <li>Logs de sistema e registros de atividade</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={24} className="text-blue-500" />
                3. Como Utilizamos suas Informações
              </h2>
              <p className="mb-4">Utilizamos suas informações pessoais para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar transações e gerenciar sua conta</li>
                <li>Enviar comunicações importantes sobre nossos serviços</li>
                <li>Personalizar sua experiência e recomendar conteúdo relevante</li>
                <li>Detectar e prevenir fraudes, abusos e atividades ilegais</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Realizar análises e pesquisas para melhorar nossos produtos</li>
              </ul>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">4. Compartilhamento de Informações</h2>
              <p className="mb-4">Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Prestadores de serviços:</strong> Com empresas que nos auxiliam na operação de nossos serviços (hospedagem, processamento de pagamentos, análise de dados)</li>
                <li><strong>Obrigações legais:</strong> Quando exigido por lei, ordem judicial ou processo legal</li>
                <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos, propriedade ou segurança, ou de nossos usuários</li>
                <li><strong>Com seu consentimento:</strong> Em outras situações com seu consentimento explícito</li>
              </ul>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia, controles de acesso, monitoramento de segurança e treinamento regular de nossa equipe.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">6. Seus Direitos</h2>
              <p className="mb-4">Você tem os seguintes direitos em relação às suas informações pessoais:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acesso:</strong> Solicitar uma cópia das informações pessoais que mantemos sobre você</li>
                <li><strong>Retificação:</strong> Corrigir informações imprecisas ou incompletas</li>
                <li><strong>Exclusão:</strong> Solicitar a exclusão de suas informações pessoais</li>
                <li><strong>Portabilidade:</strong> Receber suas informações em formato estruturado e legível</li>
                <li><strong>Oposição:</strong> Opor-se ao processamento de suas informações pessoais</li>
                <li><strong>Revogação de consentimento:</strong> Retirar seu consentimento a qualquer momento</li>
              </ul>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">7. Cookies e Tecnologias Similares</h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso de nossos serviços e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">8. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">9. Transferências Internacionais</h2>
              <p>
                Suas informações podem be transferidas e processadas em países diferentes do seu país de residência. Garantimos que essas transferências sejam realizadas em conformidade com as leis de proteção de dados aplicáveis.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">10. Menores de Idade</h2>
              <p>
                Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores. Se tomarmos conhecimento de que coletamos informações de um menor, tomaremos medidas para excluir essas informações.
              </p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail size={24} className="text-blue-500" />
                11. Contato
              </h2>
              <p className="mb-4">
                Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao processamento de suas informações pessoais, entre em contato conosco:
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

            <section className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4">12. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas publicando a nova política em nosso site e atualizando a data de "Última atualização". Recomendamos que você revise esta política regularmente.
              </p>
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
