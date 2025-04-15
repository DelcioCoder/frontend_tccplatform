'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEditing } from '@/contexts/EditingContext';
import { useUserType } from '@/hooks/useUserType';
import AnimatedFormFields from '@/components/AnimatedFormFields';

export default function ProfileForm() {
  const router = useRouter();
  const { isEditing, setIsEditing } = useEditing();
  const { userType: userTypeFromHook } = useUserType();

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

  // Buscando o perfil atual via API
  useEffect(() => {
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
    fetchProfile();
  }, [setIsEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Filtra os dados do perfil conforme o tipo de usuário
    const profileData = userTypeFromHook === 'student'
      ? {
          institution: profile.institution,
          course: profile.course,
          graduation_year: profile.graduation_year,
          tcc_interest: profile.tcc_interest,
        }
      : {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }
  
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
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg text-center ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
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
            {isEditing ? "Editar Perfil" : "Criar Perfil"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
