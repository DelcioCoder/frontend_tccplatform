import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { username, email, password, password2, user_type } = await request.json();

    try {
        const response = await fetch('http://localhost:8000/api/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, password2, user_type }),
        });

        const data = await response.json();
        

        if (!response.ok) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        }

        const cookieStore = await cookies();
        cookieStore.set('access', data.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        cookieStore.set('refresh', data.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return NextResponse.json({ message: 'Registro bem-sucedido' }, { status: 200 });    

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return NextResponse.json({ error: 'Erro ao registrar usuário' }, { status: 500 });
    }
}