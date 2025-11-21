'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/api/auth/auth';
import { tokenServices } from '@/service/tokenServices';
import type { AuthResponse } from '@/types/auth';

import type { UserRole } from '@/types/auth';

interface User {
    id: number;
    email: string;
    role: UserRole;
}

/**
 * useUser Hook - Hook สำหรับดึงข้อมูล user
 * 
 * ใช้เมื่อต้องการแค่ข้อมูล user โดยไม่ต้องใช้ auth context
 */
export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!tokenServices.hasToken()) {
                setLoading(false);
                return;
            }

            try {
                const response: AuthResponse = await auth.getCurrentUser();

                if (response?.user) {
                    setUser({
                        id: response.user.id,
                        email: response.user.email,
                        role: response.user.role as UserRole,
                    });
                } else {
                    // ถ้าไม่มี user (เช่น ไม่ได้ login หรือ token หมดอายุ)
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // ถ้า error ให้ลบ token ออก
                tokenServices.removeToken();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
}
