import { cookies } from "next/headers";
import { NextResponse } from "next/server";



export async function GET(request: Request) {
  const cookieStore = await cookies();
  const acessToken = cookieStore.get("access")?.value;

    if (!acessToken) {
        return NextResponse.json({ error: "Token não encontrado" }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        return NextResponse.json({ error: "URL da API não configurada" }, { status: 500 });
    }
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";

    try {
        const response = await fetch(`${apiUrl}/chat/conversations/?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${acessToken}`,
            },
            cache: "no-store",
        });
        if (response.status === 404) {
            return NextResponse.json({
                count: 0,
                next: null,
                previous: null,
                results: [],
            });
        }
        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Erro ao buscar conversas: ${response.status} - ${errorText}` },
                { status: response.status }
            );
        }
        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error("Erro ao buscar conversas:", error);
        return NextResponse.json({ error: "Erro interno ao buscar conversas" }, { status: 500 });
    }
}

