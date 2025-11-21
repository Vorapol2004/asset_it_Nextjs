import { apiClient } from '@/service/apiClient';
import { tokenServices } from '@/service/tokenServices';
import type { LoginInput, AuthResponse } from '@/types/auth';

/**
 * Auth API - ฟังก์ชันสำหรับเรียก API Authentication
 * 
 * หน้าที่:
 * - Login
 * - Logout
 * - Get Current User
 */

export const auth = {
    /**
     * Login - เข้าสู่ระบบ
     * @param email - email และ password
     * @returns AuthResponse พร้อม token และ user data
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        const data: LoginInput = { email, password };
        
        const res = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
            requireAuth: false, // Login ไม่ต้องใช้ token
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ 
                message: 'Login failed' 
            }));
            throw new Error(errorData.message || 'Login failed');
        }

        const response: AuthResponse = await res.json();

        // เก็บ token ถ้ามี
        if (response.token) {
            tokenServices.setToken(response.token);
        }

        return response;
    },

    /**
     * Logout - ออกจากระบบ
     * @returns AuthResponse
     */
    async logout(): Promise<AuthResponse> {
        try {
            const res = await apiClient('/auth/logout', {
                method: 'POST',
            });

            // ลบ token ออกไม่ว่าจะสำเร็จหรือไม่
            tokenServices.removeToken();

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ 
                    message: 'Logout failed' 
                }));
                throw new Error(errorData.message || 'Logout failed');
            }

            return res.json();
        } catch (error) {
            // ถ้า error ก็ลบ token ออกอยู่ดี
            tokenServices.removeToken();
            throw error;
        }
    },

    /**
     * Get Current User - ดึงข้อมูล user ปัจจุบัน
     * @returns AuthResponse พร้อม user data หรือ response ที่ไม่มี user ถ้าไม่ authenticated
     */
    async getCurrentUser(): Promise<AuthResponse> {
        const res = await apiClient('/auth/me', {
            method: 'GET',
        });

        // ถ้าเป็น 401 หรือ 403 (Unauthorized/Forbidden) แสดงว่าไม่มี session
        // ไม่ต้อง throw error เพราะเป็นสถานการณ์ปกติเมื่อยังไม่ได้ login
        if (res.status === 401 || res.status === 403) {
            // ลบ token ที่อาจจะหมดอายุหรือไม่ถูกต้อง
            tokenServices.removeToken();
            // คืนค่า response ที่ไม่มี user
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ 
                message: 'Failed to get user' 
            }));
            throw new Error(errorData.message || 'Failed to get user');
        }

        return res.json();
    },
};

