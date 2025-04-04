"use client";

export async function getAuthenticatedUserClient() {
    try {
        const response = await fetch('/api/users/me');

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao obter usuário autenticado:', error);
        return null;
    }
}