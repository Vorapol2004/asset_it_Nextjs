/**
 * API Client สำหรับเรียก Backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Interface สำหรับ User
 */
interface User {
    id: number;
    username: string;
    createdAt?: string;
}

/**
 * Interface สำหรับ Equipment
 */
interface Equipment {
    id: number;
    name: string;
    description?: string;
    quantity?: number;
    available?: number;
}

/**
 * Interface สำหรับ Borrow
 */
interface Borrow {
    id: number;
    equipmentId: number;
    userId: number;
    borrowDate: string;
    returnDate?: string;
    status: string;
}

/**
 * Interface สำหรับ API Response
 */
interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    token?: string;
    user?: User;
}

/**
 * ฟังก์ชันช่วยสำหรับเรียก API
 */
async function fetchAPI<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    // ดึง token จาก localStorage
    let token: string | null = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }

    // ตั้งค่า headers - แก้ไขตรงนี้!
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    // เพิ่ม headers จาก options (ถ้ามี)
    if (options.headers) {
        const optionsHeaders = new Headers(options.headers);
        optionsHeaders.forEach((value, key) => {
            headers.set(key, value);
        });
    }

    // ถ้ามี token ให้ใส่ใน Authorization header - แก้ไขตรงนี้!
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Parse JSON response
        const data: ApiResponse<T> = await response.json();

        // ถ้า response ไม่ ok (status 400-500)
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * API Client Object
 */
export const api = {
    // ========== Authentication ==========

    /**
     * Login
     */
    login: async (username: string, password: string): Promise<ApiResponse<User>> => {
        const data = await fetchAPI<User>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        // เก็บ token ใน localStorage
        if (data.token && typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
        }

        return data;
    },

    /**
     * Register
     */
    register: async (username: string, password: string): Promise<ApiResponse<User>> => {
        return await fetchAPI<User>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    },

    /**
     * Logout
     */
    logout: async (): Promise<ApiResponse<null>> => {
        const data = await fetchAPI<null>('/auth/logout', {
            method: 'POST',
        });

        // ลบ token ออกจาก localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }

        return data;
    },

    /**
     * Get Current User
     */
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        return await fetchAPI<User>('/auth/me');
    },

    // ========== Equipment ==========

    /**
     * Get All Equipment
     */
    getEquipment: async (): Promise<ApiResponse<Equipment[]>> => {
        return await fetchAPI<Equipment[]>('/equipment');
    },

    /**
     * Get Equipment by ID
     */
    getEquipmentById: async (id: number): Promise<ApiResponse<Equipment>> => {
        return await fetchAPI<Equipment>(`/equipment/${id}`);
    },

    /**
     * Add Equipment
     */
    addEquipment: async (equipmentData: Partial<Equipment>): Promise<ApiResponse<Equipment>> => {
        return await fetchAPI<Equipment>('/equipment', {
            method: 'POST',
            body: JSON.stringify(equipmentData),
        });
    },

    /**
     * Update Equipment
     */
    updateEquipment: async (
        id: number,
        equipmentData: Partial<Equipment>
    ): Promise<ApiResponse<Equipment>> => {
        return await fetchAPI<Equipment>(`/equipment/${id}`, {
            method: 'PUT',
            body: JSON.stringify(equipmentData),
        });
    },

    /**
     * Delete Equipment
     */
    deleteEquipment: async (id: number): Promise<ApiResponse<null>> => {
        return await fetchAPI<null>(`/equipment/${id}`, {
            method: 'DELETE',
        });
    },

    // ========== Borrow ==========

    /**
     * Get Borrow History
     */
    getBorrowHistory: async (): Promise<ApiResponse<Borrow[]>> => {
        return await fetchAPI<Borrow[]>('/borrow');
    },

    /**
     * Borrow Equipment
     */
    borrowEquipment: async (equipmentId: number): Promise<ApiResponse<Borrow>> => {
        return await fetchAPI<Borrow>('/borrow', {
            method: 'POST',
            body: JSON.stringify({ equipmentId }),
        });
    },

    /**
     * Return Equipment
     */
    returnEquipment: async (borrowId: {
        borrowId: string;
        returnNotes: string;
        condition: "good" | "damaged" | "lost"
    }): Promise<ApiResponse<Borrow>> => {
        return await fetchAPI<Borrow>(`/borrow/${borrowId}/return`, {
            method: 'PUT',
        });
    },

};