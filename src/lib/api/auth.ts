"use server";
import { cookies } from "next/headers";
import { cache } from "react";

// Aplicar cache na função para evitar multiplas chamadas desnecessárias
export const getAuthenticatedUser = cache(async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken) return null;

    try {
        const response = await fetch('http://localhost:8000/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            // Definindo opções de cache para o fetch
            next: {
                revalidate: 60 // Revalidar a cada 60 segundos
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return response.json();

        
    } catch (error) {
        console.error('Erro ao obter usuário autenticado:', error);
        return null;
    }
});