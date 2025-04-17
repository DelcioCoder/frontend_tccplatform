"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh')?.value;
    const accessToken = cookieStore.get('access')?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: 'Refresh token não encontrado' }, { status: 401 });
    }
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/auth_user/token/blacklist/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Erro ao fazer logout' }, { status: response.status });
        }
        cookieStore.delete('access')
        cookieStore.delete('refresh')

        return NextResponse.json({ message: 'Logout realizado com sucesso' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Erro na conexão com o servidor' }, { status: 500 });
    }
}