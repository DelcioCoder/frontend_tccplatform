"use server";
import { cookies } from "next/headers";

export async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    if (!accessToken) return null;

    try {
        const response = await fetch('http://localhost:8000/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
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
}