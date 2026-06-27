import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import apiClient, { setAuthCredentials, clearAuthCredentials } from '../api/client';
import type { User, RegisterRequest } from '../types/user';

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'jobtracker_credentials';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            setIsLoading(false);
            return;
        }
        const { email, password } = JSON.parse(stored);
        setAuthCredentials(email, password);
        apiClient.get<User>('/api/auth/me')
            .then(res => setUser(res.data))
            .catch(() => {
                clearAuthCredentials();
                localStorage.removeItem(STORAGE_KEY);
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function login(email: string, password: string) {
        setAuthCredentials(email, password);
        try {
            const res = await apiClient.get<User>('/api/auth/me');
            setUser(res.data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
        } catch (err) {
            clearAuthCredentials();
            throw err;
        }
    }

    async function register(data: RegisterRequest) {
        const res = await apiClient.post<User>('/api/auth/register', data);
        setAuthCredentials(data.email, data.password);
        setUser(res.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: data.email, password: data.password }));
    }

    function logout() {
        clearAuthCredentials();
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}