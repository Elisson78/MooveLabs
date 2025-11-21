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
  ChevronDown
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

        <div className="hidden md:flex space-x-8">
          <a href="#services" className="text-gray-300 hover:text-white transition-colors">Serviços</a>
          <a href="#projects" className="text-gray-300 hover:text-white transition-colors">Projetos</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testemunhos</a>
          <a href="https://wa.me/41779661285" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors">
            Fale Conosco
          </a>
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
            <a href="#projects" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Projetos</a>
            <a href="#testimonials" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">Testemunhos</a>
            <a href="https://wa.me/41779661285" className="text-blue-500 font-semibold">Fale Conosco</a>
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
      <div className="mt-8 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MooveLabs. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
