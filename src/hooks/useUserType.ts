'use client';

import { useState, useEffect } from 'react';
import { getAuthenticatedUser } from '@/lib/api/auth';

/**
 * Hook personalizado para obter o tipo de usuário autenticado.
 * @returns {Object} Objeto com userType ('student', 'advisor', ou null) e isLoading (boolean).
 */
export function useUserType() {
  const [userType, setUserType] = useState<'student' | 'advisor' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se já temos o tipo de usuário armazenado no localStorage
    const cachedUserType = localStorage.getItem('userType') as 'student' | 'advisor' | null;

    if (cachedUserType) {
      setUserType(cachedUserType);
      setIsLoading(false);
      return;
    }

    const fetchUserType = async () => {
      try {
        const user = await getAuthenticatedUser();

        if (user?.user_type) {
          setUserType(user.user_type);
          localStorage.setItem('userType', user.user_type);
        } else {
          localStorage.removeItem('userType');
          setUserType(null);
        }
      } catch {
        console.error('Erro ao obter tipo de usuário');
        localStorage.removeItem('userType');
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserType();
  }, []);

  return { userType, isLoading };
}