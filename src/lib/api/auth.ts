'use server';

import { cookies } from 'next/headers';
import { cache } from 'react';

// Interface para o usuário retornado pela API
export interface AuthenticatedUser {
  user_id: number;
  username: string;
  user_type: 'student' | 'advisor';
}

/**
 * Obtém o usuário autenticado a partir do token de acesso armazenado nos cookies.
 * @returns {Promise<AuthenticatedUser | null>} Dados do usuário autenticado ou null se não autenticado.
 */
export const getAuthenticatedUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;

  if (!accessToken) {
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error('Erro: NEXT_PUBLIC_API_URL não está definido.');
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 60, // Revalidar a cada 60 segundos
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      user_id: data.user_id,
      username: data.username,
      user_type: data.user_type as 'student' | 'advisor',
    };
  } catch {
    console.error('Erro ao obter usuário autenticado');
    return null;
  }
});