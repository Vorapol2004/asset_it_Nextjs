import type { LoginInput, AuthResponse } from '@/types/auth';

/**
 * Auth Service - ฟังก์ชันสำหรับเรียก API ทั้งหมด
 *
 * หน้าที่:
 * - รวมฟังก์ชันเรียก API ทั้งหมดไว้ที่เดียว
 * - ทำให้โค้ดอ่านง่ายและนำกลับมาใช้ใหม่ได้
 * - แยก logic การเรียก API ออกจาก component
 */
export const authService = {
    /**
     * Login
     * @param data - username และ password
     * @returns AuthResponse
     */
    async login(data: LoginInput): Promise<AuthResponse> {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    /**
     * Logout
     * @returns AuthResponse
     */
    async logout(): Promise<AuthResponse> {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
        });
        return res.json();
    },

    /**
     * Get Current User
     * @returns AuthResponse with user data
     */
    async getCurrentUser(): Promise<AuthResponse> {
        const res = await fetch('/api/auth/me');
        return res.json();
    },
};