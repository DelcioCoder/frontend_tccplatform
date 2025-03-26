'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, AtSign, UserCheck, BookOpen } from 'lucide-react';
import ChooseUserType from '@/components/ChooseUserType';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'advisor'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Registration attempt:', { 
      name, 
      email, 
      password, 
      userType 
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
              Comece sua Jornada Acadêmica
            </h2>
            <p className="text-white/80">
              Crie sua conta e tenha acesso a ferramentas exclusivas para aprimorar seu trabalho acadêmico.
            </p>
          </div>
          
          <div className="hidden md:block absolute bottom-10 left-10 right-10 h-1 bg-white/20 rounded-full"></div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-2 text-gray-800">
            Crie sua Conta
          </h2>
          <p className="mb-8 text-gray-600">
            Cadastre-se gratuitamente
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Selection */}
            <ChooseUserType userType={userType} setUserType={setUserType} />
            


            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Nome completo" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
                placeholder="Crie uma senha" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Confirme sua senha" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-700 to-emerald-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 font-semibold"
            >
              Criar Conta
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            Já tem uma conta? {' '}
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