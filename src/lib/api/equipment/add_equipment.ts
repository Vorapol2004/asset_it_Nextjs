import {Equipment} from "@/types/type";
import {API_URL} from "@/lib/config";

/**
 * API endpoints สำหรับการเพิ่ม/แก้ไข/ลบอุปกรณ์
 * ใช้สำหรับหน้า add_equipment
 */
export const add_equipment = {
    /**
     *  สร้างอุปกรณ์ใหม่
     *  Backend: POST /equipment/create
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
     *  Backend: PUT /equipment/{id}
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
     *  Backend: DELETE /equipment/{id}
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

