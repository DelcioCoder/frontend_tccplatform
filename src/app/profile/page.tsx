'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  School,
  BookOpen,
  Calendar,
  Briefcase,
  Book,
  FileText,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEditing } from '@/contexts/EditingContext';
import { useUserType } from '@/hooks/useUserType';

interface ProfileFormProps {
  userType: 'student' | 'advisor' | string | null;
  profile: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// Componente para renderizar campos do formulário de acordo com o tipo de usuário
function AnimatedFormFields({ userType, profile, handleChange }: ProfileFormProps) {
  return (
    <motion.div
      key={userType}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {userType === 'student' ? (
        <>
          {/* Campos para estudantes */}
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <School className="mr-2 text-blue-700" size={18} />
              Instituição
            </label>
            <input
              type="text"
              name="institution"
              value={profile.institution}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nome da sua instituição de ensino"
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <BookOpen className="mr-2 text-blue-700" size={18} />
              Curso
            </label>
            <input
              type="text"
              name="course"
              value={profile.course}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Seu curso acadêmico"
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <Calendar className="mr-2 text-blue-700" size={18} />
              Ano de Conclusão
            </label>
            <input
              type="number"
              name="graduation_year"
              value={profile.graduation_year}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ano previsto para conclusão"
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <Book className="mr-2 text-blue-700" size={18} />
              Interesse no TCC
            </label>
            <textarea
              name="tcc_interest"
              value={profile.tcc_interest}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Descreva seus interesses para o TCC"
            ></textarea>
          </div>
        </>
      ) : (
        <>
          {/* Campos para orientadores */}
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <BookOpen className="mr-2 text-blue-700" size={18} />
              Especialização
            </label>
            <input
              type="text"
              name="specialization"
              value={profile.specialization}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Sua área de especialização"
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <Briefcase className="mr-2 text-blue-700" size={18} />
              Experiência
            </label>
            <textarea
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Descreva sua experiência acadêmica e profissional"
            ></textarea>
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <FileText className="mr-2 text-blue-700" size={18} />
              Biografia
            </label>
            <textarea
              name="biography"
              value={profile.biography}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Compartilhe um pouco sobre você"
            ></textarea>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function ProfileForm() {
  const router = useRouter();
  const { isEditing, setIsEditing } = useEditing();
  const { userType: userTypeFromHook, isLoading: userTypeLoading } = useUserType();

  // Estado para armazenar os campos do perfil
  const [profile, setProfile] = useState({
    institution: '',
    course: '',
    graduation_year: '',
    tcc_interest: '',
    specialization: '',
    experience: '',
    biography: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Estados para verificação de ativação da conta
  const [isAccountActivated, setIsAccountActivated] = useState(false);
  const [username, setUsername] = useState('');
  const [checkingActivation, setCheckingActivation] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Verificar o status de ativação da conta
  useEffect(() => {
    async function checkAccountActivation() {
      try {
        const response = await fetch('/api/users/status');
        if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.code === 'user_inactive') {
            setIsAccountActivated(false);
          } else {
            router.push('/login');
            return;
          }
        } else if (response.ok) {
          const data = await response.json();
          setIsAccountActivated(data.is_active);
          setUsername(data.username);
        } else {
          console.error('Erro ao verificar status da conta:', response.status);
        }
      } catch (error) {
        console.error('Erro ao verificar status da conta:', error);
      } finally {
        setCheckingActivation(false);
      }
    }
    checkAccountActivation();
  }, [router]);

  // Buscar o perfil do usuário se a conta estiver ativada e o tipo de usuário carregado
  useEffect(() => {
    if (!checkingActivation && isAccountActivated && !userTypeLoading) {
      fetchProfile();
    } else if (!checkingActivation) {
      setLoading(false);
    }
  }, [checkingActivation, isAccountActivated, userTypeLoading]);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfile({
          institution: data.institution || '',
          course: data.course || '',
          graduation_year: data.graduation_year || '',
          tcc_interest: data.tcc_interest || '',
          specialization: data.specialization || '',
          experience: data.experience || '',
          biography: data.biography || '',
        });
        setIsEditing(true);
      } else {
        console.error('Erro ao buscar perfil:', await response.json());
      }
    } catch (error) {
      console.error('Erro ao buscar o perfil:', error);
    } finally {
      setLoading(false);
    }
  }

  // Função para reenviar o email de ativação
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
        setMessageType('success');
      } else {
        let errorMessage = 'Erro ao reenviar email de ativação.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {}
        setMessage(errorMessage);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro ao reenviar email de ativação:', error);
      setMessage('Erro ao reenviar email de ativação.');
      setMessageType('error');
    } finally {
      setResendingEmail(false);
    }
  };

  // Função para atualizar os valores do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Função para enviar a atualização do perfil para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAccountActivated) {
      setMessage('Sua conta precisa ser ativada antes de criar um perfil.');
      setMessageType('error');
      return;
    }

    // Filtrar os campos com base no tipo de usuário do hook
    const profileData = userTypeFromHook === 'student' ? {
      institution: profile.institution,
      course: profile.course,
      graduation_year: profile.graduation_year,
      tcc_interest: profile.tcc_interest,
    } : {
      specialization: profile.specialization,
      experience: profile.experience,
      biography: profile.biography,
    };

    try {
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (response.ok) {
        setMessage('Perfil criado com sucesso!');
        setMessageType('success');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        let errorMessage = 'Erro ao criar o perfil.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {}
        setMessage(errorMessage);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      setMessage('Erro ao criar o perfil.');
      setMessageType('error');
    }
  };

  // Exibe "Carregando..." enquanto verifica ativação, perfil ou tipo de usuário
  if (loading || checkingActivation || userTypeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  // Se a conta não estiver ativada, exibe mensagem de ativação
  if (!isAccountActivated) {
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
            <h1 className="text-3xl font-bold text-gray-800">Ativação Pendente</h1>
          </div>
          {username && (
            <div className="mb-4 text-center">
              <p className="text-gray-700 font-medium">
                Olá, <span className="text-blue-700">{username}</span>!
              </p>
            </div>
          )}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-3 rounded-lg text-center ${messageType === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </motion.div>
          )}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Sua conta ainda não foi ativada. Por favor, verifique seu e-mail e clique no link de ativação enviado.
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-center">
            Não recebeu o e-mail de ativação? Clique no botão abaixo para reenviar o link.
          </p>
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
          {emailSent && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Após ativar sua conta, recarregue esta página para continuar.
            </div>
          )}
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
  }

  // Exibe o formulário de criação/atualização do perfil
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center mb-6">
          <GraduationCap className="text-blue-700 mr-2" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing ? 'Editar perfil' : 'Criar perfil'}
          </h1>
        </div>
        {username && (
          <div className="mb-4 text-center">
            <p className="text-gray-700 font-medium">
              Olá, <span className="text-blue-700">{username}</span>!
            </p>
          </div>
        )}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg text-center ${messageType === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatedFormFields userType={userTypeFromHook} profile={profile} handleChange={handleChange} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300 cursor-pointer"
          >
            {isEditing ? 'Editar Perfil' : 'Criar Perfil'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}