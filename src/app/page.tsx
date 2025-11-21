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
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
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

const Technologies = () => {
  const techs = [
    {
      name: "Next.js",
      icon: (
        <svg viewBox="0 0 180 180" className="w-12 h-12 fill-white group-hover:fill-gray-200 transition-colors">
          <mask height="180" id="mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
            <circle cx="90" cy="90" fill="black" r="90"></circle>
          </mask>
          <g mask="url(#mask0_408_134)">
            <circle cx="90" cy="90" data-circle="true" fill="black" r="90"></circle>
            <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)"></path>
            <rect fill="url(#paint1_linear_408_134)" height="72" width="12" x="115" y="54"></rect>
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_408_134" x1="109" x2="144.5" y1="116.5" y2="160.5">
              <stop stopColor="white"></stop>
              <stop offset="1" stopColor="white" stopOpacity="0"></stop>
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_408_134" x1="121" x2="120.799" y1="54" y2="106.875">
              <stop stopColor="white"></stop>
              <stop offset="1" stopColor="white" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      name: "PostgreSQL",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#336791] group-hover:brightness-110 transition-all">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 2.2c5.41 0 9.8 4.39 9.8 9.8 0 5.41-4.39 9.8-9.8 9.8-5.41 0-9.8-4.39-9.8-9.8 0-5.41 4.39-9.8 9.8-9.8zm-1.5 3.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm4.5 1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM7.5 12c0 2.48 2.02 4.5 4.5 4.5s4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5-4.5 2.02-4.5 4.5z" />
          <path d="M12.8 16.8c-.4-.2-.8-.3-1.3-.3-.5 0-.9.1-1.3.3-.4.2-.7.5-.9.9-.2.4-.3.8-.3 1.3 0 .5.1.9.3 1.3.2.4.5.7.9.9.4.2.8.3 1.3.3.5 0 .9-.1 1.3-.3.4-.2.7-.5.9-.9.2-.4.3-.8.3-1.3 0-.5-.1-.9-.3-1.3-.2-.4-.5-.7-.9-.9z" fill="#336791" />
        </svg>
      )
    },
    {
      name: "n8n",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#FF6D5A] group-hover:brightness-110 transition-all">
          <path d="M12.04 0C12.01 0 11.98 0 11.96.01 5.37.08.05 5.43.05 12.04c0 6.59 5.3 11.96 11.89 11.96 6.62 0 12.01-5.39 12.01-12.01C23.95 5.38 18.62.05 12.04 0zm0 2.18c5.41 0 9.83 4.41 9.83 9.83 0 5.42-4.42 9.83-9.83 9.83-5.41 0-9.83-4.41-9.83-9.83 0-5.39 4.39-9.79 9.78-9.83h.05zM8.5 6.5v4h-2v-4h2zm9 0v4h-2v-4h2zm-4.5 2v7h-2v-7h2zm-4.5 6v3h-2v-3h2zm9 0v3h-2v-3h2z" />
        </svg>
      )
    },
    {
      name: "Python",
      icon: (
        <svg viewBox="0 0 256 256" className="w-12 h-12 group-hover:scale-110 transition-transform">
          <path fill="#3776AB" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.019 29.128h61.668v8.71H56.384c-57.863 0-56.384 26.606-56.384 26.606s-1.08 26.651 55.22 26.651h12.806v-17.448s-.197-20.136 20.006-20.136h31.824c20.202 0 20.202-18.956 20.202-18.956V20.34S140.22.072 126.916.072zM97.19 19.185a10.635 10.635 0 1 1 0 21.269 10.635 10.635 0 0 1 0-21.269z" />
          <path fill="#FFD43B" d="M129.084 255.928c64.832 0 60.784-28.115 60.784-28.115l-.019-29.128h-61.668v-8.71h71.435c57.863 0 56.384-26.606 56.384-26.606s1.08-26.651-55.22-26.651h-12.806v17.448s.197 20.136-20.006 20.136h-31.824c-20.202 0-20.202 18.956-20.202 18.956v42.396s-.162 20.274 13.142 20.274zM158.81 236.815a10.635 10.635 0 1 1 0-21.269 10.635 10.635 0 0 1 0 21.269z" />
        </svg>
      )
    },
    {
      name: "JavaScript",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#F7DF1E] group-hover:brightness-110 transition-all">
          <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-1.035.402-2.631.402-4.336 0-1.755.003-3.51.003-5.265z" />
        </svg>
      )
    },
    {
      name: "React",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#61DAFB] group-hover:brightness-110 transition-all">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 2.2c5.41 0 9.8 4.39 9.8 9.8 0 5.41-4.39 9.8-9.8 9.8-5.41 0-9.8-4.39-9.8-9.8 0-5.41 4.39-9.8 9.8-9.8zm0 8.3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      name: "ChatGPT",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#10A37F] group-hover:brightness-110 transition-all">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.98 4.18a5.985 5.985 0 0 0-3.96 5.29 6.046 6.046 0 0 0 .515 4.91 6.065 6.065 0 0 0 6.51 2.9 6.065 6.065 0 0 0 10.276-2.17 5.985 5.985 0 0 0 3.96-5.29h.001zM13.206 17.5a4.535 4.535 0 0 1-2.136.533 4.583 4.583 0 0 1-1.634-.3l-.24-.095-6.22 3.475.34-6.675a4.526 4.526 0 0 1-.55-2.225c0-.15.007-.3.022-.448l.01-.085.013-.08.13-2.17-1.605-1.46.545-.145a4.555 4.555 0 0 1 3.67.43l.245.14 4.87-2.72-.34 6.67c.36.15.74.23 1.125.23.15 0 .3-.008.45-.023l.08-.01.08-.012 2.17-.13 1.6 1.46-.54.145a4.555 4.555 0 0 1-2.066.495zM8.755 10.3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6.49 3.4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      )
    },
    {
      name: "Gemini",
      icon: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white group-hover:fill-blue-400 transition-colors">
          <path d="M12 24c0-6.627-5.373-12-12-12 6.627 0 12-5.373 12-12 0 6.627 5.373 12 12 12-6.627 0-12 5.373-12 12z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Tecnologias</h2>
          <p className="text-gray-400 text-lg">Ferramentas modernas que utilizamos</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-12">
          {techs.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                {tech.icon}
              </div>
              <span className="text-gray-400 font-medium group-hover:text-white transition-colors">{tech.name}</span>
            </motion.div>
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
      <Technologies />
      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
