import { apiClient } from '@/service/apiClient';
import type { User } from '@/types/auth';

/**
 * User API - ฟังก์ชันสำหรับเรียก API จัดการ Users (สำหรับ Admin เท่านั้น)
 * 
 * หน้าที่:
 * - ดึงรายการ users ทั้งหมด
 * - สร้าง user ใหม่
 * - แก้ไข user
 * - ลบ user
 */

export type UserWithoutPassword = Omit<User, 'password'>

export interface CreateUserInput {
    email: string;
    password: string;
    role?: string; // รองรับ 'ROLE_ADMIN' หรือ 'ROLE_USER' โดยตรง
}

export interface UpdateUserInput {
    email?: string;
    password?: string;
    role?: string; // รองรับ 'ROLE_ADMIN' หรือ 'ROLE_USER' โดยตรง
}

export interface UsersResponse {
    success: boolean;
    message: string;
    users?: UserWithoutPassword[];
    user?: UserWithoutPassword;
}

export const userApi = {
    /**
     * Get All Users - ดึงรายการ users ทั้งหมด
     * @returns UsersResponse พร้อมรายการ users
     */
    async getAllUsers(): Promise<UsersResponse> {
        const res = await apiClient('/users', {
            method: 'GET',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ 
                message: 'Failed to fetch users' 
            }));
            throw new Error(errorData.message || 'Failed to fetch users');
        }

        return res.json();
    },

    /**
     * Create User - สร้าง user ใหม่
     * @param data - ข้อมูล user ที่จะสร้าง
     * @returns UsersResponse พร้อม user ที่สร้าง
     */
    async createUser(data: CreateUserInput): Promise<UsersResponse> {
        const res = await apiClient('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ 
                message: 'Failed to create user' 
            }));
            throw new Error(errorData.message || 'Failed to create user');
        }

        return res.json();
    },

    /**
     * Update User - แก้ไข user
     * @param id - ID ของ user ที่จะแก้ไข
     * @param data - ข้อมูลที่ต้องการแก้ไข
     * @returns UsersResponse พร้อม user ที่แก้ไข
     */
    async updateUser(id: number, data: UpdateUserInput): Promise<UsersResponse> {
        const res = await apiClient(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ 
                message: 'Failed to update user' 
            }));
            throw new Error(errorData.message || 'Failed to update user');
        }

        return res.json();
    },

    /**
     * Delete User - ลบ user
     * @param id - ID ของ user ที่จะลบ
     * @returns UsersResponse
     */
    async deleteUser(id: number): Promise<UsersResponse> {
        const res = await apiClient(`/users/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ 
                message: 'Failed to delete user' 
            }));
            throw new Error(errorData.message || 'Failed to delete user');
        }

        return res.json();
    },
};

