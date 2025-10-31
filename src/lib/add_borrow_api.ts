import {Equipment,} from "@/types/type";

const API_URL = process.env.API_URL || 'http://localhost:8080';
export const add_borrow_api = {
    /**
     *  สร้างอุปกรณ์ใหม่
     */
    create: async (data: Partial<Equipment>): Promise<Equipment> => {
        const res = await fetch(`${API_URL}/equipment/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || 'Failed to create equipment');
        } else {
            return res.json();
        }
    },

    /**
     *  อัปเดตอุปกรณ์
     */
    update: async (id: number, data: Partial<Equipment>): Promise<Equipment> => {
        const res = await fetch(`${API_URL}/equipment/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Failed to update equipment');
        } else {
            return res.json();
        }
    },

    /**
     *  ลบอุปกรณ์
     */
    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/equipment/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error('Failed to delete equipment');
        } else {
            return;
        }
    },
}