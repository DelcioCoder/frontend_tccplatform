'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle, Users, BookOpen, Calendar, ArrowRight, Award, Zap } from 'lucide-react';
import FeatureCard from '../FeatureCard';
import TestimonialCard from '../TestimonialCard'; 
import IconTextCard from '../IconTextCard';


export default function UnauthenticatedHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <GraduationCap className="text-blue-700 mr-2" size={32} />
          <h1 className="font-bold text-xl text-blue-700">TCC Connect</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 hover:text-blue-700 transition-all font-medium">
            Faça login
          </Link>
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            Cadastre-se
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-700 to-emerald-600 pt-16 pb-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Faça seu projeto acadêmico crescer com 
                  <span className="block text-emerald-300">o melhor orientador</span>
                  para seu TCC
                </h2>
                <p className="text-white/90 text-lg mb-8">
                  Desenvolva seu TCC de forma rápida e segura. Conectamos você com centenas de orientadores especialistas no seu tema e com disponibilidade compatível com seu cronograma.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register" 
                    className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold text-center hover:bg-gray-100 transition-all"
                  >
                    Eu quero ser orientado
                  </Link>
                  <Link 
                    href="/register?role=advisor" 
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-white/10 transition-all"
                  >
                    Quero ser orientador
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-xl">
                  <Image 
                    src="/public/ChatGPT Image 31 de mar. de 2025, 14_23_50.png" 
                    alt="Student and teacher talking" 
                    className="w-full h-auto rounded-lg mb-4"
                    width={400} height={300} 
                  />
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src="/api/placeholder/40/40" 
                      alt="Avatar" 
                      className="rounded-full" 
                      width={40}
                      height={40}
                     
                    />
                    <div> 
                      <p className="text-white font-medium">Ana Clara</p>
                      <p className="text-white/70 text-sm">Engenharia Civil</p>
                    </div>
                  </div>
                  <p className="text-white/90 italic">"Encontrei o orientador perfeito para meu TCC em menos de uma semana. A plataforma facilitou todo o processo!"</p>
                </div>
                
                {/* Círculos decorativos */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-500/30 backdrop-blur-sm -z-10"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-blue-600/30 backdrop-blur-sm -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Features Section dentro do Hero */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> 
              <IconTextCard icon={CheckCircle} text="Consultoria acadêmica gratuita" />
              <IconTextCard icon={Users} text="Pagamentos protegidos" />
              <IconTextCard icon={Users} text="Orientadores verificados" />
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="bg-white w-full overflow-hidden -mt-5">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-blue-700 fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Como Funciona Section */}
      <div className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Como o TCC Connect funciona</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Uma plataforma completa que facilita todo o processo de desenvolvimento do seu trabalho acadêmico, desde a escolha do orientador até a entrega final.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <FeatureCard
                icon={Users}
                title="1. Encontre o orientador ideal"
                description="Pesquise entre centenas de orientadores qualificados por área de conhecimento, universidade e disponibilidade de horário."
                checks={[
                  "Perfis detalhados com experiência acadêmica",
                  "Avaliações de outros estudantes",
                  "Filtros por tema e especialidade",
                ]}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
              <FeatureCard
                icon={Calendar}
                title="2. Agende e gerencie reuniões"
                description="Marque encontros de orientação que se encaixem na sua agenda e acompanhe o progresso do seu trabalho."
                checks={[
                  "Calendário integrado com notificações",
                  "Videoconferências dentro da plataforma",
                  "Registro de anotações de cada encontro",
                ]}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}>
              <FeatureCard
                icon={BookOpen}
                title="3. Desenvolva seu TCC"
                description="Utilize nossas ferramentas exclusivas para redigir, revisar e aprimorar seu trabalho acadêmico."
                checks={[
                  "Editor colaborativo em tempo real",
                  "Ferramentas de formatação ABNT",
                  "Verificador de plágio e corretor gramatical",
                ]}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-700 to-emerald-600 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comece a transformar seu TCC hoje mesmo
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Mais de 5.000 estudantes já concluíram seus trabalhos com sucesso através da nossa plataforma. Junte-se a eles e tenha uma experiência acadêmica incrível.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <IconTextCard icon={Users} text="+2.500 orientadores" />
                <IconTextCard icon={Award} text="98% de aprovação" />
                <IconTextCard icon={Zap} text="Suporte 24/7" />
              </div>
            </div>

            {/* Botão de CTA */}
            <div className="md:w-1/3">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Crie sua conta gratuitamente</h3>
                <p className="text-gray-600 mb-6">
                  Aproveite 7 dias de teste grátis com todas as funcionalidades premium desbloqueadas.
                </p>
                <Link 
                  href="/register" 
                  className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all mb-3"
                >
                  Começar agora
                </Link>
                <Link 
                  href="/como-funciona" 
                  className="block w-full text-blue-600 text-center px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all border border-blue-600"
                >
                  Saiba mais <ArrowRight className="inline ml-1" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">O que nossos usuários dizem</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Histórias reais de sucesso de estudantes que utilizaram nossa plataforma para desenvolver seus trabalhos de conclusão de curso.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
            >
              <TestimonialCard
                avatarSrc="/api/placeholder/50/50"
                avatarAlt="Marcos Silva Avatar"
                name="Marcos Silva"
                role="Administração • UFMG"
                description="A plataforma foi essencial para eu conseguir concluir meu TCC no prazo. Meu orientador me ajudou a definir um tema relevante e me acompanhou em cada etapa do processo."
                stars={5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}
            >
              <TestimonialCard
                avatarSrc="/api/placeholder/50/50"
                avatarAlt="Juliana Costa Avatar"
                name="Juliana Costa"
                role="Psicologia • USP"
                description="As ferramentas de formatação automática me pouparam horas de trabalho. Além disso, meu orientador estava sempre disponível para tirar dúvidas. Nota 10 para a plataforma!"
                stars={5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}
            >
              <TestimonialCard
                avatarSrc="/api/placeholder/50/50"
                avatarAlt="Pedro Oliveira Avatar"
                name="Pedro Oliveira"
                role="Engenharia • UFRJ"
                description="Mesmo morando longe do campus, consegui encontrar um orientador perfeito para meu TCC. A plataforma facilitou a minha vida!"
                stars={5}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}




                                  