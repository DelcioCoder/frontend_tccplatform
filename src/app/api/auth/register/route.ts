import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const {
        username,
        last_name,
        email,
        password,
        password2,
        user_type
    } = await request.json();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, last_name, email, password, password2, user_type }),
        });

        // Lê o corpo da resposta apenas uma vez
        const data = await response.json();

        if (!response.ok) {
            // Já temos os dados na variável `data`
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
