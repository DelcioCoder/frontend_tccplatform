'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Left Side - Illustration */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-emerald-600 p-6 md:p-10 flex flex-col justify-between">
          <div className="flex items-center">
            <GraduationCap className="text-white mr-2" size={40} />
            <h1 className="font-montserrat text-2xl font-bold text-white">
              TCC Connect
            </h1>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transforme seu TCC
            </h2>
            <p className="text-white/80">
              Conecte-se, colabore e aprimore seu trabalho acadêmico com nossa plataforma inovadora.
            </p>
          </div>
          
          <div className="hidden md:block absolute bottom-10 left-10 right-10 h-1 bg-white/20 rounded-full"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-2 text-gray-800">
            Bem-vindo!
          </h2>
          <p className="mb-8 text-gray-600">
            Entre para continuar seu projeto
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Sua senha" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-700 to-emerald-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 font-semibold cursor-pointer"
            >
              Entrar na Plataforma
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            Ainda não tem conta? {' '}
            <Link 
              href="/register" 
              className="text-blue-600 hover:underline font-semibold"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}