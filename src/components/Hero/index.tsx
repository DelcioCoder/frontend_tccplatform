'use client';
import React, { useEffect, useState } from 'react';
import { useUserType } from '@/hooks/useUserType';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  const { userType, isLoading } = useUserType();

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-blue-700 to-emerald-600 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="font-montserrat text-5xl font-bold mb-6 leading-tight"
        >
          Transforme Seu TCC em uma Jornada Excepcional
        </motion.h1>
        
        <motion.p
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: 0.4 }}
          className="text-xl mb-8 opacity-90"
        >
          Conecte-se com os melhores orientadores de Angola e eleve sua pesquisa acadêmica a novos patamares.
        </motion.p>
        
        {isLoading ? (
          <div className="flex justify-center items-center">
            {/* Spinner usando Tailwind CSS */}
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: userType === 'student' ? 1 : 0,
              y: userType === 'student' ? 0 : 30,
              transition: { duration: 0.8, delay: userType === 'student' ? 0.3 : 0, ease: 'easeOut' }
            }}
          >
            {userType === 'student' && (
              <Link
                href="/connect"
                className="inline-block px-8 py-4 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
              >
                Encontre seu Orientador
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
