import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }
    
    try {
        const response = await fetch('http://localhost:8000/api/users/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Erro ao obter usuário' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return NextResponse.json({ error: 'Erro ao obter usuário' }, { status: 500 });
    }
}