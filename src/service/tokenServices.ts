/**
 * Token Services - จัดการ JWT Token
 * 
 * หน้าที่:
 * - เก็บ token ใน localStorage
 * - ดึง token ออกมา
 * - ลบ token
 * - ตรวจสอบว่ามี token หรือไม่
 */

const TOKEN_KEY = 'token';

export const tokenServices = {
    /**
     * เก็บ token ใน localStorage
     */
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    /**
     * ดึง token จาก localStorage
     */
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    /**
     * ลบ token จาก localStorage
     */
    removeToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
        }
    },

    /**
     * ตรวจสอบว่ามี token หรือไม่
     */
    hasToken(): boolean {
        return this.getToken() !== null;
    },
};

