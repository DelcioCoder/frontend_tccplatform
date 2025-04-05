"use server"

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Token não encontrado'}, { status: 401})
    }

    const { status, response_message } = await request.json();

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/connections/response/${id}/`;

    try {

    const apiResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ status, response_message })
    })

    if (!apiResponse.ok) {
        return NextResponse.json(
            { error: 'Erro ao atualizar status da conexão'}, 
            { status: apiResponse.status})
    }
     
    const data = await apiResponse.json();

    return NextResponse.json(data, { status: 200})
} catch (error) {
    return NextResponse.json(
        { error: 'Erro ao processar a solicitação'},
        { status: 500}
    )
}
}