'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PendingActivation from '@/components/PendingActivation';
import ProfileForm from '@/components/ProfileForm';
import { useUserType } from '@/hooks/useUserType';

const ProfilePage = () => {
  const searchParams = useSearchParams();
  const activatedQuery = searchParams.get('activated') === 'true';

  const { isLoading: userTypeLoading } = useUserType();
  const [isAccountActivated, setIsAccountActivated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkActivation() {
      if (activatedQuery) {
        setIsAccountActivated(true);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/users/status');
        if (response.ok) {
          const data = await response.json();
          setIsAccountActivated(data.is_active);
        }
      } catch (error) {
        console.error('Erro ao verificar status de ativação:', error);
      } finally {
        setLoading(false);
      }
    }
    checkActivation();
  }, [activatedQuery]);

  if (loading || userTypeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 to-emerald-600 flex items-center justify-center">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  // Se a conta ainda não foi ativada, renderiza a tela de ativação pendente.
  if (!isAccountActivated) {
    return <PendingActivation />;
  }

  // Se a conta estiver ativada, renderiza o formulário de perfil.
  return <ProfileForm />;
};

export default ProfilePage;
