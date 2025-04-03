'use client'
import React, { useState } from 'react';
import Modal from '../Modal';
import { Advisor, Student } from '@/types/advisor';



interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Advisor | Student;
}

export default function RequestModal({ isOpen, onClose, user }: RequestModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (message.trim() === '') {
      alert('Por favor, escreva uma mensagem.');
      return;
    }

    setLoading(true);
    try {
      await fetch('http://localhost:8000/api/connections/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNDAzODg4LCJpYXQiOjE3NDMzMTc0ODgsImp0aSI6IjkwOGIzODJjNWEwYjRkMzk5YWQ4NDRiNjU0N2Y5ZjRiIiwidXNlcl9pZCI6MjB9.Og5Ejyq2Q0WA-y-E1sEzRfICvKrC6942mHHkRGXpzAg',
        },
        body: JSON.stringify({
          advisor: user.user_id,
          message,
        }),
      });
      alert('Solicitação enviada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro ao enviar solicitação, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Enviar solicitação para {user.username}</h2>
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
