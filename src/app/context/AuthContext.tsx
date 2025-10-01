'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
    id: number;
    username: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

            if (token) {
                try {
                    const data = await api.getCurrentUser();
                    // แก้ตรงนี้ - เช็คว่ามี user ก่อน
                    if (data?.user) {
                        setUser(data.user as User);
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                    }
                    setUser(null);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const data = await api.login(username, password);
        // แก้ตรงนี้ - เช็คว่ามี user ก่อน
        if (data?.user) {
            setUser(data.user as User);
        }
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}