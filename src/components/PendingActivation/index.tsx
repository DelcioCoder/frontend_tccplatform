'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw } from 'lucide-react';

const PendingActivation = () => {
  const [message, setMessage] = useState('');
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResendActivationEmail = async () => {
    setResendingEmail(true);
    setEmailSent(false);
    try {
      const response = await fetch('/api/users/resend-activation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setEmailSent(true);
        setMessage('Email de ativação reenviado com sucesso! Verifique sua caixa de entrada.');
      } else {
        let errorMessage = 'Erro ao reenviar email de ativação.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {}
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error('Erro ao reenviar email de ativação:', error);
      setMessage('Erro ao reenviar email de ativação.');
    } finally {
      setResendingEmail(false);
    }
  };

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
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg text-center bg-yellow-50 text-yellow-700"
          >
            {message}
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={resendingEmail}
          onClick={handleResendActivationEmail}
          className="w-full bg-gradient-to-r from-blue-700 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300 cursor-pointer flex items-center justify-center"
        >
          {resendingEmail ? (
            <>
              <RefreshCw className="animate-spin mr-2" size={18} />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="mr-2" size={18} />
              Reenviar E-mail de Ativação
            </>
          )}
        </motion.button>
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
