import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Token não encontrado' }, { status: 401 });
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        return NextResponse.json({ error: "URL da API não configurada" }, { status: 500 });
    }

    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";

    const response = await fetch(`${apiUrl}/connections/student/requests/?page=${page}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        cache: "no-store",
    });

    if (!response.ok) {
        return NextResponse.json({ error: 'Erro ao obter solicitações de conexão' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}