/**
 * Token Services - จัดการ JWT Token
 * 
 * หน้าที่:
 * - เก็บ token ใน sessionStorage
 * - ดึง token ออกมา
 * - ลบ token
 * - ตรวจสอบว่ามี token หรือไม่
 */

const TOKEN_KEY = 'token';

export const tokenServices = {
    /**
     * เก็บ token ใน sessionStorage
     */
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(TOKEN_KEY, token);
        }
    },

    /**
     * ดึง token จาก sessionStorage
     */
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    /**
     * ลบ token จาก sessionStorage
     */
    removeToken(): void {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(TOKEN_KEY);
        }
    },

    /**
     * ตรวจสอบว่ามี token หรือไม่
     */
    hasToken(): boolean {
        return this.getToken() !== null;
    },
};

