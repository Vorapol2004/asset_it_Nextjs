/**
 * User Services - จัดการ User Data
 * 
 * หน้าที่:
 * - เก็บ user data ใน localStorage
 * - ดึง user data ออกมา
 * - ลบ user data
 */

const USER_KEY = 'user';

interface StoredUser {
    id: number;
    email: string;
    role: 'ROLE_ADMIN' | 'ROLE_USER'; // ใช้ backend format โดยตรง
}

export const userServices = {
    /**
     * เก็บ user data ใน localStorage
     */
    setUser(user: StoredUser): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    /**
     * ดึง user data จาก localStorage
     */
    getUser(): StoredUser | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem(USER_KEY);
            if (userStr) {
                try {
                    return JSON.parse(userStr) as StoredUser;
                } catch (error) {
                    console.error('Failed to parse user data from localStorage:', error);
                    return null;
                }
            }
        }
        return null;
    },

    /**
     * ลบ user data จาก localStorage
     */
    removeUser(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(USER_KEY);
        }
    },

    /**
     * ตรวจสอบว่ามี user data หรือไม่
     */
    hasUser(): boolean {
        return this.getUser() !== null;
    },
};

