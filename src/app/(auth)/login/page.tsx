'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, User, Lock } from 'lucide-react';
import { LoginSchema } from '@/schemas/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação com Zod
    const validation = LoginSchema.safeParse({
      username,
      password,
    });

    if (!validation.success) {
      const errorMessages: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path[0];
        errorMessages[path] = err.message;
      });
      setErrors(errorMessages);
      return;
    }

    // Limpar erros se a validação passar
    setErrors({});

    // Enviar os dados para a API interna
    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          // Redirecionar para a página protegida após login bem-sucedido
          router.push('/');
        } else {
          // Tratar erros retornados pela API
          const data = await response.json();
          setErrors({
            general: data.error || 'Erro ao fazer login. Verifique suas credenciais.',
          });
        }
      } catch (error) {
        setErrors({
          general: 'Erro interno no servidor. Tente novamente mais tarde.',
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Lado Esquerdo - Ilustração */}
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

        {/* Lado Direito - Formulário de Login */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-2 text-gray-800">
            Bem-vindo!
          </h2>
          <p className="mb-8 text-gray-600">
            Entre para continuar seu projeto
          </p>

          {errors.general && (
            <div className="text-red-500 mb-4 text-center">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Seu nome de usuário" 
                required 
                value={username}
                onChange={(e) => (setUsername(e.target.value))}
                className={`w-full pl-10 px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Sua senha" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-700 to-emerald-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 font-semibold cursor-pointer"
            >
              {isPending ? 'Entrando...' : 'Entrar na Plataforma'}
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