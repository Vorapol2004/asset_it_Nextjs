import { apiClient } from '@/service/apiClient';
import { tokenServices } from '@/service/tokenServices';
import type { LoginInput, RegisterInput, AuthResponse } from '@/types/auth';

/**
 * Auth API - ฟังก์ชันสำหรับเรียก API Authentication
 * 
 * หน้าที่:
 * - Login
 * - Register
 * - Logout
 * - Get Current User
 */

export const auth = {
    /**
     * Login - เข้าสู่ระบบ
     * @param data - username และ password
     * @returns AuthResponse พร้อม token และ user data
     */
    async login(username: string, password: string): Promise<AuthResponse> {
        const data: LoginInput = { username, password };
        
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
     * Register - สมัครสมาชิก
     * @param data - username และ password
     * @returns AuthResponse
     */
    async register(username: string, password: string): Promise<AuthResponse> {
        const data: RegisterInput = { username, password };
        
        const res = await apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
            requireAuth: false, // Register ไม่ต้องใช้ token
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ 
                message: 'Registration failed' 
            }));
            throw new Error(errorData.message || 'Registration failed');
        }

        return res.json();
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
     * @returns AuthResponse พร้อม user data
     */
    async getCurrentUser(): Promise<AuthResponse> {
        const res = await apiClient('/auth/me', {
            method: 'GET',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ 
                message: 'Failed to get user' 
            }));
            throw new Error(errorData.message || 'Failed to get user');
        }

        return res.json();
    },
};

