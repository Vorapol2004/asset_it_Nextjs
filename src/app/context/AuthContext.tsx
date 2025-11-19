'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from '@/hooks/useAuth';

import type { UserRole } from '@/types/auth';

interface User {
    id: number;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Context Provider สำหรับ Authentication
 * 
 * หน้าที่:
 * - ใช้ useAuth hook เพื่อจัดการ authentication state
 * - ให้ components อื่นๆ เข้าถึง auth state ได้ผ่าน context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuthHook();

    return (
        <AuthContext.Provider
            value={{
                user: auth.user,
                loading: auth.loading,
                login: auth.login,
                logout: auth.logout,
                isAuthenticated: auth.isAuthenticated,
                isAdmin: auth.isAdmin,
                refreshUser: auth.refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuthContext - Hook สำหรับเข้าถึง Auth Context
 * 
 * ใช้ใน components ที่ต้องการเข้าถึง authentication state
 * 
 * หมายเหตุ: ถ้าต้องการใช้ hook โดยตรง (ไม่ผ่าน context) ให้ใช้ useAuth จาก @/hooks/useAuth แทน
 */
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}
