'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthenticatedUserClient } from '@/lib/api/auth-client';

type User = {
    user_id: string;
    user_type: 'student' | 'advisor';
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getAuthenticatedUserClient();
                setUser(userData);
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
            }
            setLoading(false); // Sempre define como false no final
        };

        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    return context;
}