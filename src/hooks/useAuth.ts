'use client';

import { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/api/auth/auth';
import { tokenServices } from '@/service/tokenServices';
import type { AuthResponse } from '@/types/auth';

interface User {
    id: number;
    username: string;
}

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

/**
 * useAuth Hook - Hook สำหรับจัดการ Authentication
 * 
 * หน้าที่:
 * - จัดการ state ของ user
 * - ตรวจสอบ authentication status
 * - ฟังก์ชัน login, logout
 * - ดึงข้อมูล user ปัจจุบัน
 */
export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    /**
     * ดึงข้อมูล user ปัจจุบัน
     */
    const fetchUser = useCallback(async () => {
        // ตรวจสอบว่ามี token หรือไม่
        if (!tokenServices.hasToken()) {
            setLoading(false);
            return;
        }

        try {
            const response: AuthResponse = await auth.getCurrentUser();
            
            if (response.user) {
                setUser({
                    id: response.user.id,
                    username: response.user.username,
                });
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // ถ้า error ให้ลบ token และ user
            tokenServices.removeToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * ตรวจสอบ authentication เมื่อ component mount
     */
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    /**
     * Login
     */
    const login = useCallback(async (username: string, password: string) => {
        setLoading(true);
        try {
            const response: AuthResponse = await auth.login(username, password);
            
            if (response.user) {
                setUser({
                    id: response.user.id,
                    username: response.user.username,
                });
            } else {
                throw new Error('Login failed: No user data received');
            }
        } catch (error) {
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Logout
     */
    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
            // ถ้า error ก็ลบ user อยู่ดี
        } finally {
            setUser(null);
            setLoading(false);
        }
    }, []);

    /**
     * Refresh user data
     */
    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
    };
}

