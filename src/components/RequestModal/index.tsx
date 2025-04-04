'use client'
import React, { useState } from 'react';
import Modal from '../Modal';
import { Advisor, Student } from '@/types/advisor';
import { CheckCircle, XCircle } from 'lucide-react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Advisor | Student;
}

export default function RequestModal({ isOpen, onClose, user }: RequestModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async () => {
    if (message.trim() === '') {
      setFeedback({ type: 'error', message: 'Por favor, escreva uma mensagem.' });
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/connections/create', {
        method: 'POST',
        body: JSON.stringify({ advisor: user.user_id, message }),
      });
      setFeedback({ type: 'success', message: 'Solicitação enviada com sucesso!' });
      setTimeout(() => {
        onClose();
      }, 2000); // Fecha o modal após 2 segundos
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setFeedback({ type: 'error', message: 'Erro ao enviar solicitação, tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Enviar solicitação para {user.username}</h2>
      {feedback && (
        <div
          className={`flex items-center p-2 rounded mb-4 ${
            feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="mr-2" size={20} />
          ) : (
            <XCircle className="mr-2" size={20} />
          )}
          {feedback.message}
        </div>
      )}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escreva sua mensagem..."
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
      >
        {loading ? 'Enviando...' : 'Enviar Solicitação'}
      </button>
    </Modal>
  );
}