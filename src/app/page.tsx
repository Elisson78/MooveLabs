'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Bot,
  Smartphone,
  Zap,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Globe,
  Menu,
  X,
  ChevronDown,
  Plane,
  Scale,
  Sparkles,
  Building,
  ShoppingBag,
  Cpu
} from 'lucide-react';

const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/41779661285"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
  >
    <MessageCircle size={32} />
  </motion.a>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold tracking-tighter text-white">
          Moove<span className="text-blue-500">Labs</span>
        </a>

        <div className="hidden md:flex items-center space-x-6">
          <a href="#services" className="text-gray-300 hover:text-white transition-colors">Serviços</a>
          <a href="#automations" className="text-gray-300 hover:text-white transition-colors">Automações</a>
          <a href="#plans" className="text-gray-300 hover:text-white transition-colors">Planos</a>
          <a href="#projects" className="text-gray-300 hover:text-white transition-colors">Projetos</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testemunhos</a>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/20">
            <a 
              href="https://app.moovelabs.com/login" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Entrar
            </a>
            <a 
              href="https://app.moovelabs.com/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition-colors font-medium"
            >
              Criar Conta
            </a>
          </div>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10"
        >
          <div className="flex flex-col p-6 space-y-4">
            <a href="#services" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Serviços</a>
            <a href="#automations" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Automações</a>
            <a href="#plans" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Planos</a>
            <a href="#projects" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Projetos</a>
            <a href="#testimonials" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Testemunhos</a>
            
            {/* Auth Buttons Mobile */}
            <div className="pt-4 mt-4 border-t border-white/10 flex flex-col space-y-3">
              <a 
                href="https://app.moovelabs.com/login" 
                className="text-center py-2 text-gray-300 hover:text-white font-medium"
              >
                Entrar
              </a>
              <a 
                href="https://app.moovelabs.com/register" 
                className="text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
              >
                Criar Conta Grátis
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Inovação através de <br />
            <span className="text-gradient">Inteligência Artificial</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Criamos apps, automações e agentes de atendimento 24h que transformam o seu negócio.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="https://wa.me/41779661285" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2">
              Começar Agora <ArrowRight size={20} />
            </a>
            <a href="#projects" className="glass-card px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all">
              Ver Projetos
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div style={{ y: y1 }} className="absolute top-1/4 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl -z-10" />
      <motion.div style={{ y: y2 }} className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -z-10" />

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      icon: <Smartphone size={40} className="text-blue-400" />,
      title: "Desenvolvimento de Apps",
      description: "Aplicativos modernos e intuitivos para iOS e Android, construídos com as tecnologias mais recentes."
    },
    {
      icon: <Bot size={40} className="text-purple-400" />,
      title: "Agentes de IA 24h",
      description: "Atendimento ao cliente automatizado e inteligente que nunca dorme, aumentando suas vendas."
    },
    {
      icon: <Zap size={40} className="text-yellow-400" />,
      title: "Automações",
      description: "Otimize processos repetitivos e ganhe tempo com nossas soluções de automação empresarial."
    }
  ];

  return (
    <section id="services" className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Nossas Soluções</h2>
          <p className="text-gray-400 text-lg">Tecnologia de ponta para impulsionar seus resultados</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-8 hover:bg-white/10 transition-colors group"
            >
              <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      name: "Essence de la Vie",
      url: "https://www.essence-delavie.ch/",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      category: "E-commerce"
    },
    {
      name: "Devi24",
      url: "https://devi24.ch/",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      category: "Serviços"
    },
    {
      name: "Event Connect",
      url: "https://event-connect.ch/",
      image: "https://images.unsplash.com/photo-1505373877741-e17439bf2717?auto=format&fit=crop&w=800&q=80",
      category: "Eventos"
    }
  ];

  return (
    <section id="projects" className="py-24 bg-neutral-900/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Projetos Recentes</h2>
          <p className="text-gray-400 text-lg">Conheça alguns de nossos trabalhos e parceiros</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl aspect-video"
            >
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors z-10" />
              <img
                src={project.image}
                alt={project.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black to-transparent">
                <p className="text-blue-400 text-sm font-semibold mb-1">{project.category}</p>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  <Globe size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "CEO, TechStart",
      content: "A MooveLabs transformou completamente nosso atendimento. O agente de IA é impressionante!",
      rating: 5
    },
    {
      name: "Jean P.",
      role: "Diretor, EventosPro",
      content: "Profissionalismo e qualidade técnica excepcionais. O app ficou exatamente como imaginamos.",
      rating: 5
    },
    {
      name: "Marie L.",
      role: "Fundadora, BeautyShop",
      content: "As automações implementadas nos pouparam horas de trabalho manual. Recomendo muito!",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">O que dizem nossos clientes</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-8 border-t-4 border-blue-500"
            >
              <div className="flex mb-4 text-yellow-400">
                {[...Array(t.rating)].map((_, i) => <Zap key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-gray-300 mb-6 italic">"{t.content}"</p>
              <div>
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-neutral-900 py-12 border-t border-white/10">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-2">MooveLabs</h3>
          <p className="text-gray-400">Transformando o futuro com IA.</p>
          <p className="text-gray-400 mt-2">Rue de Lyon 106, Genève</p>
        </div>

        <div className="flex gap-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 text-gray-400 text-sm">
          <a href="/politica-privacidade" className="hover:text-white transition-colors">Política de Privacidade</a>
          <span className="hidden md:inline">•</span>
          <a href="/termos-uso" className="hover:text-white transition-colors">Termos de Uso</a>
        </div>
        <div className="mt-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} MooveLabs. Todos os direitos reservados.
        </div>
      </div>
    </div>
  </footer>
);

const Automations = () => {
  const industries = [
    {
      icon: <Plane size={32} className="text-sky-400" />,
      title: "Turismo & Viagens",
      description: "Agentes de viagens 24/7, roteiros personalizados automáticos e gestão de reservas integrada ao WhatsApp.",
      color: "from-sky-500/20 to-blue-600/5"
    },
    {
      icon: <Scale size={32} className="text-amber-400" />,
      title: "Advocacia & Jurídico",
      description: "Triagem inteligente de clientes, automação de contratos, gestão de prazos e atualizações processuais.",
      color: "from-amber-500/20 to-orange-600/5"
    },
    {
      icon: <Sparkles size={32} className="text-pink-400" />,
      title: "Estética & Saúde",
      description: "Agendamento automático, lembretes de sessões, ficha de anamnese digital e fidelização de pacientes.",
      color: "from-pink-500/20 to-rose-600/5"
    },
    {
      icon: <Building size={32} className="text-emerald-400" />,
      title: "Imobiliária",
      description: "Qualificação de leads em tempo real, agendamento de visitas e envio automático de imóveis compatíveis.",
      color: "from-emerald-500/20 to-green-600/5"
    },
    {
      icon: <ShoppingBag size={32} className="text-violet-400" />,
      title: "E-commerce & Varejo",
      description: "Recuperação de carrinho, suporte a pedidos, rastreio automático e recomendações de produtos via IA.",
      color: "from-violet-500/20 to-purple-600/5"
    },
    {
      icon: <Cpu size={32} className="text-cyan-400" />,
      title: "Sua Indústria",
      description: "Desenvolvemos fluxos n8n e agentes sob medida para a realidade do seu negócio, seja ele qual for.",
      color: "from-cyan-500/20 to-teal-600/5"
    }
  ];

  return (
    <section id="automations" className="py-24 bg-neutral-900 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Automações & Agentes Exclusivos</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Potencialize seu negócio com fluxos inteligentes criados no <span className="text-orange-500 font-semibold">n8n</span> e Agentes de IA especializados.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative p-8 rounded-2xl border border-white/5 bg-gradient-to-br ${item.color} hover:border-white/10 transition-all hover:-translate-y-1`}
            >
              <div className="mb-6 p-3 bg-black/20 rounded-xl w-fit backdrop-blur-sm border border-white/5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a href="https://wa.me/41779661285" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full transition-all hover:scale-105">
            <Zap size={20} className="text-yellow-400" />
            Descobrir automação para meu negócio
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Plans = () => {
  const plans = [
    {
      name: "Start",
      subtitle: "Automação Essencial",
      description: "Para pequenos negócios que estão começando com automação.",
      price: "CHF 49–79",
      period: "/mês",
      features: [
        "Hospedagem + VPS MooveLabs",
        "Banco PostgreSQL",
        "n8n com até 5 workflows",
        "Monitoramento básico",
        "SSL + segurança",
        "2 integrações (WhatsApp, Email, CRM simples)"
      ],
      idealFor: "Empresas que querem automatizar tarefas simples e reduzir custos.",
      buttonText: "Quero começar",
      highlight: false
    },
    {
      name: "Professional",
      subtitle: "Automação Inteligente",
      description: "Para empresas que querem automações reais no dia a dia.",
      price: "CHF 149–199",
      period: "/mês",
      features: [
        "Tudo do Start",
        "15 workflows n8n",
        "IA integrada (Gemini/OpenAI)",
        "Integrações com CRM, ERP, sites e APIs",
        "Dashboards simples",
        "Banco dedicado",
        "Suporte profissional (até 10h/mês)"
      ],
      idealFor: "Negócios em crescimento.",
      buttonText: "Escolher Professional",
      highlight: true,
      badge: "Mais vendido"
    },
    {
      name: "Business",
      subtitle: "Automação Corporativa + IA",
      description: "Para empresas que dependem de automações e querem performance.",
      price: "CHF 299–499",
      period: "/mês",
      features: [
        "Workflows ilimitados",
        "IA com treinamento personalizado",
        "Monitoramento 24/7",
        "Banco dedicado + backups automáticos",
        "VPS otimizada",
        "Customizações avançadas",
        "Suporte premium (tempo prioritário)"
      ],
      idealFor: "Empresas que querem escala e redução de mão de obra.",
      buttonText: "Escolher Business",
      highlight: false
    },
    {
      name: "Enterprise",
      subtitle: "IA + CRM COMPLETO PERSONALIZADO",
      description: "Aqui entra o seu novo produto: CRM desenvolvido sob medida pela MooveLabs.",
      price: "Sob Consulta",
      period: "",
      features: [
        "Desenvolvimento de CRM 100% personalizado",
        "Infraestrutura completa MooveLabs",
        "IA integrada ao CRM",
        "Painéis administrativos",
        "Usuários ilimitados",
        "Relatórios + módulos personalizados",
        "Integração com automações n8n",
        "Suporte premium dedicado",
        "Hospedagem + banco dedicado + segurança"
      ],
      idealFor: "Grandes empresas com necessidades específicas.",
      buttonText: "Solicitar análise do projeto",
      highlight: false,
      isEnterprise: true,
      setupCost: "Setup: €800 – €3.500",
      monthlyCost: "Mensal: CHF 390 – 990/mês"
    }
  ];

  return (
    <section id="plans" className="py-24 bg-neutral-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Planos de Automação e IA MooveLabs</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transformamos processos manuais em sistemas inteligentes que trabalham por você.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-6 rounded-2xl border ${plan.highlight
                ? 'bg-white/10 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-white/5 border-white/10 hover:border-white/20'
                } ${plan.isEnterprise ? 'lg:col-span-1 border-purple-500/50' : ''} transition-all duration-300`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-2 ${plan.isEnterprise ? 'text-purple-400' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-blue-400 font-semibold mb-2">{plan.subtitle}</p>
                <p className="text-gray-400 text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.isEnterprise ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-300">{plan.setupCost}</p>
                    <p className="text-lg font-bold text-white">{plan.monthlyCost}</p>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={16} className={`mt-1 flex-shrink-0 ${plan.isEnterprise ? 'text-purple-500' : 'text-blue-500'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="text-xs text-gray-500 mb-4 italic text-center">{plan.idealFor}</p>
                <a
                  href="https://wa.me/41779661285"
                  className={`block w-full py-3 rounded-xl text-center font-semibold transition-all ${plan.highlight
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-600/25'
                    : plan.isEnterprise
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-600/25'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                >
                  {plan.buttonText}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CrmHighlight = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/10 to-black">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 font-semibold mb-6 border border-purple-500/20">
                🚀 Novo Produto Exclusivo
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                CRM Personalizado <span className="text-purple-500">MooveLabs</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Pare de adaptar o seu negócio a sistemas prontos.
                Nós criamos um CRM <strong className="text-white">100% personalizado</strong>, do zero, feito especialmente para sua empresa.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Funções do seu fluxo real",
                  "Automação via n8n",
                  "IA avançada integrada",
                  "Painéis para equipe",
                  "Módulos ilimitados",
                  "Escalável, seguro e rápido"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    {item}
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/41779661285"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-600/25"
              >
                Solicitar Orçamento <ArrowRight size={20} />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl blur-2xl opacity-30" />
              <div className="relative bg-neutral-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Mockup visual representation of a CRM dashboard */}
                <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/3 h-24 rounded-lg bg-white/5 animate-pulse" />
                    <div className="w-1/3 h-24 rounded-lg bg-white/5 animate-pulse delay-75" />
                    <div className="w-1/3 h-24 rounded-lg bg-white/5 animate-pulse delay-150" />
                  </div>
                  <div className="h-40 rounded-lg bg-white/5 w-full animate-pulse delay-200" />
                  <div className="flex gap-4">
                    <div className="h-10 w-1/4 rounded-lg bg-purple-500/20" />
                    <div className="h-10 w-3/4 rounded-lg bg-white/5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <Services />
      <Automations />
      <Plans />
      <CrmHighlight />
      <Projects />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
