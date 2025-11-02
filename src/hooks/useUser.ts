'use client';

import { useState, useEffect } from 'react';
interface User {
    id: number;
    username: string;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.getCurrentUser();

                // แก้ตรงนี้ - เช็คว่ามี user หรือไม่
                if (response?.user) {
                    setUser(response.user as User);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // ถ้า error ให้ลบ token ออก
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
}