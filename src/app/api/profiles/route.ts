import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
        }

        const response = await fetch('http://localhost:8000/api/profiles/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar perfil' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
        }

        const body = await request.json();
        const response = await fetch('http://localhost:8000/api/profiles/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
    }
}