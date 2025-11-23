'use client';

import { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/api/auth/auth';
import { tokenServices } from '@/service/tokenServices';
import { userServices } from '@/service/userServices';
import type { AuthResponse, UserRole } from '@/types/auth';

interface User {
    id: number;
    email: string;
    role: UserRole;
}

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
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

        // ลองอ่าน user data จาก sessionStorage ก่อน (fallback เมื่อ backend ไม่ได้รัน)
        // ต้องอ่านก่อนเพื่อให้ user state ถูก set ทันที (synchronous)
        const storedUser = userServices.getUser();
        
        if (storedUser) {
            setUser(storedUser);
            // ตั้ง loading = false ชั่วคราวเพื่อให้ route protection ทำงานได้
            // แต่จะ set กลับเป็น true เมื่อเริ่มเรียก API
            setLoading(false);
        }

        try {
            // ตั้ง loading = true อีกครั้งเมื่อเริ่มเรียก API
            if (storedUser) {
                setLoading(true);
            }
            
            const response: AuthResponse = await auth.getCurrentUser();
            
            if (response.user) {
                // ใช้ role จาก backend โดยตรง (ROLE_ADMIN หรือ ROLE_USER)
                const backendRole = (response.user.role === 'ROLE_ADMIN' || response.user.role === 'ROLE_USER') 
                    ? response.user.role 
                    : 'ROLE_USER'; // Default เป็น ROLE_USER
                const userData = {
                    id: response.user.id,
                    email: response.user.email,
                    role: backendRole as UserRole,
                };
                
                // เก็บ user data ใน sessionStorage
                userServices.setUser(userData);
                setUser(userData);
            } else {
                // ถ้าไม่มี user (เช่น ไม่ได้ login หรือ token หมดอายุ)
                // ลบข้อมูล user และ token ที่อาจจะหมดอายุ
                tokenServices.removeToken();
                userServices.removeUser();
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            
            // ถ้าเป็น network error (Failed to fetch) ใช้ข้อมูลจาก sessionStorage
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage.includes('Failed to connect')) {
                console.warn('Backend server may not be running. Using cached user data from sessionStorage.');
                // ใช้ข้อมูลจาก sessionStorage ที่อ่านไว้แล้ว (ถ้ามี)
                if (!storedUser) {
                    // ถ้าไม่มีข้อมูลใน sessionStorage และ backend ไม่ได้รัน ให้ลบ token
                    tokenServices.removeToken();
                    userServices.removeUser();
                    setUser(null);
                }
                // ถ้ามี storedUser อยู่แล้ว ไม่ต้องทำอะไร (user state ถูก set ไว้แล้ว)
            } else {
                // ถ้าเป็น error อื่นๆ (เช่น 401, 403) ให้ลบ token และ user
                tokenServices.removeToken();
                userServices.removeUser();
                setUser(null);
            }
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
    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const response: AuthResponse = await auth.login(email, password);
            
            if (response.user) {
                // ใช้ role จาก backend โดยตรง (ROLE_ADMIN หรือ ROLE_USER)
                const backendRole = (response.user.role === 'ROLE_ADMIN' || response.user.role === 'ROLE_USER') 
                    ? response.user.role 
                    : 'ROLE_USER'; // Default เป็น ROLE_USER
                const userData = {
                    id: response.user.id,
                    email: response.user.email,
                    role: backendRole as UserRole,
                };
                
                // เก็บ user data ใน sessionStorage
                userServices.setUser(userData);
                setUser(userData);
            } else {
                throw new Error('Login failed: No user data received');
            }
        } catch (error) {
            tokenServices.removeToken();
            userServices.removeUser();
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
            tokenServices.removeToken();
            userServices.removeUser();
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
        isAdmin: user?.role === 'ROLE_ADMIN',
        login,
        logout,
        refreshUser,
    };
}

