'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, User, AtSign } from 'lucide-react';
import ChooseUserType from '@/components/ChooseUserType';
import { RegisterSchema } from '@/schemas/auth';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [user_type, setUserType] = useState<'student' | 'advisor'>('student');
  const [errors, setErrors] = useState<Record<string, string>>({}); // Estado para erros
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação com Zod
    const validation = RegisterSchema.safeParse({
      username,
      last_name,
      email,
      password,
      password2,
      user_type,
    });

    if (!validation.success) {
      // Extrair mensagens de erro do Zod
      const errorMessages: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path[0];
        errorMessages[path] = err.message;
      });
      setErrors(errorMessages);
      return;
    }

    // Se a validação passar, limpar os erros
    setErrors({});

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, last_name, email, password, password2, user_type }),
        });

        if (response.ok) {
          // Redirecionar para a página protegida após login bem-sucedido
          router.push('/profile');
        } else {
          // Tratar erros retornados pela API
          const data = await response.json();
          setErrors({ general: data.error || 'Erro ao registrar. Tente novamente.' });
        }
      } catch (error) {
        setErrors({ general: 'Erro interno no servidor. Tente novamente mais tarde.' });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Lado Esquerdo - Ilustração */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-emerald-600 p-6 md:p-10 flex flex-col justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className='h-12 w-12 stroke-current text-white'>
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>

            <h1 className="font-montserrat text-2xl font-bold text-white">
              TCCLink
            </h1>
          </div>
          <div className="hidden md:block">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comece sua Jornada Acadêmica
            </h2>
            <p className="text-white/80">
              Crie sua conta e tenha acesso a ferramentas exclusivas para aprimorar seu trabalho acadêmico.
            </p>
          </div>
          <div className="hidden md:block absolute bottom-10 left-10 right-10 h-1 bg-white/20 rounded-full"></div>
        </div>

        {/* Lado Direito - Formulário de Registro */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-2 text-gray-800">
            Crie sua Conta
          </h2>
          <p className="mb-8 text-gray-600">
            Cadastre-se gratuitamente
          </p>

          {errors.general && (
            <div className="text-red-500 mb-4 text-center">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seleção do tipo de usuário */}
            <ChooseUserType userType={user_type} setUserType={setUserType} />

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Primeiro nome"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Sobrenome"
                required
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full pl-10 px-4 py-3 rounded-lg border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>

            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Seu e-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Crie uma senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Confirme sua senha"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className={`w-full pl-10 px-4 py-3 rounded-lg border ${errors.password2 ? 'border-red-500' : 'border-gray-300'} text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
              {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-700 to-emerald-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 font-semibold cursor-pointer"
            >
              {isPending ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Faça login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}