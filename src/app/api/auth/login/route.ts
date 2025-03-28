import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    // Envia as credenciais ao endpoint do Django
    const response = await fetch('http://localhost:8000/api/auth_user/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Retorne um NextResponse com status de erro
      return NextResponse.json(data, { status: response.status });
    }

    // Usar NextResponse para maior flexibilidade
    const cookieStore = await cookies();
    cookieStore.set('access', data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Adicionado para maior segurança
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });
    
    cookieStore.set('refresh', data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Adicionado para maior segurança
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });
    
    return NextResponse.json({ message: 'Login bem-sucedido' }, { status: 200 });
   
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}