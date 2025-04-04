import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const response = await fetch('http://localhost:8000/api/connections/advisor/requests/', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        return NextResponse.json({ error: 'Erro ao buscar solicitações' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
}