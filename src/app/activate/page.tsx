'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uidb64 = searchParams.get('uidb64');
  const token = searchParams.get('token');

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function activateAccount() {
      if (!uidb64 || !token) {
        setMessage('Parâmetros inválidos.');
        setStatus('error');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/activate/${uidb64}/${token}/`
        );
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Conta ativada com sucesso!');
          localStorage.setItem('accountActivated', 'true');
          setTimeout(() => {
            router.push('/profile?activated=true'); // Redireciona para a página de perfil após 2 segundos
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Link de ativação inválido ou expirado.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Erro ao ativar a conta.');
      } finally {
        setLoading(false);
      }
    }

    activateAccount();
  }, [uidb64, token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Ativando conta...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1
          className={`text-2xl font-bold ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status === 'success' ? 'Sucesso!' : 'Erro'}
        </h1>
        <p className="mt-4">{message}</p>
      </div>
    </div>
  );
}