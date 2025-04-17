"use server"
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }

    const { advisor, message } = await request.json();

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        await fetch(`${apiUrl}/connections/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ advisor, message })
        })
    } catch (error) {
        console.error('Erro ao criar conexão:', error);
        return NextResponse.json({ error: 'Erro ao criar conexão' }, { status: 500 });
    }
}