"use server";
import { Advisor } from "@/types/advisor";
import { PaginatedResponse } from "@/types/api";
import { cookies } from "next/headers";

export async function getAdvisors(page: string = "1"): Promise<PaginatedResponse<Advisor>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;
    
    if (!accessToken) {
      throw new Error('Não autorizado: Token não encontrado');
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error('URL da API não configurada');
    }
    
    const response = await fetch(`${apiUrl}/profiles/advisors/?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store'
    });
  
    // Se a requisição retornar 404, significa que não há mais páginas
    if (response.status === 404) {
      // Retorna um objeto vazio mas válido para evitar erros
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao buscar orientadores: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Erro ao buscar orientadores:", error);
    throw error;
  }
}