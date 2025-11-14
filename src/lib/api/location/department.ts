import {Department} from "@/types/type";
import {API_URL} from "@/lib/config";

export const department = {
    
    getAll: async (): Promise<Department[]> => {
        const res = await fetch(`${API_URL}/department/drop_down`);
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch departments');
        } else {
            return res.json();
        }
    },

    // TODO: แก้ไข path ให้ตรงกับหลังบ้าน
    create: async (data: { departmentName: string; description?: string }): Promise<Department> => {
        const res = await fetch(`${API_URL}/department`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to create department' }));
            throw new Error(error.message || 'Failed to create department');
        }
        return res.json();
    },

    // TODO: แก้ไข path ให้ตรงกับหลังบ้าน
    update: async (id: number, data: { departmentName?: string; description?: string; isActive?: boolean }): Promise<Department> => {
        const res = await fetch(`${API_URL}/department/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to update department' }));
            throw new Error(error.message || 'Failed to update department');
        }
        return res.json();
    },

    // TODO: แก้ไข path ให้ตรงกับหลังบ้าน
    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/department/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to delete department' }));
            throw new Error(error.message || 'Failed to delete department');
        }
    },

}

