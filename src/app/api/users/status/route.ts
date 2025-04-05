import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Token de acesso não encontrado' }, { status: 401 });
    }
     
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/users/status/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    // Retorna os dados da resposta diretamente, preservando o status original
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar o status do usuário' }, { status: 500 });
  }
}