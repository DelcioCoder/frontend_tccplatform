"use client";

import { useState, useEffect } from "react";
import { getAuthenticatedUser } from "@/lib/api/auth";


export function useUserType() {
    const [userType, setUserType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar se já temos o tipo de usuário armazenado no localStorage
        const cachedUserType = localStorage.getItem('userType');

        if(cachedUserType) {
            setUserType(cachedUserType);
            setIsLoading(false);
            return;
        }

        /* Mesmo que tenhamos o tipo de usuário armazenado no localStorage,
        ainda precisamos verificar se ele é válido, ou seja, se ele existe
        
        */
       const fetchUserType = async () => {
        try {
            const user = await getAuthenticatedUser();

            if(user?.user_type) {
                setUserType(user.user_type);
                localStorage.setItem('userType', user.user_type);

            } else {
                // se não houver tipo de usuário, limpamos o localStorage
                localStorage.removeItem('userType');
                setUserType(null);
            }
        } catch (error) {
            console.error('Erro ao obter tipo de usuário:', error);
            localStorage.removeItem('userType');
            setUserType(null);
        } finally {
            setIsLoading(false);
        }
       }

       fetchUserType();
    }, []);

    return { userType, isLoading };
       
       
}