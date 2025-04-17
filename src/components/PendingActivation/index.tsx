'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const PendingActivation = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center mb-6">
          <Mail className="text-blue-700 mr-2" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Ativação pendente</h1>
        </div>
        <p className="text-gray-600 mb-6 text-center">
          Sua conta ainda não foi ativada. Verifique seu e-mail para o link de ativação.
        </p>
       
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="w-full mt-4 bg-white text-blue-700 border border-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 cursor-pointer"
        >
          Recarregar Página
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PendingActivation;
