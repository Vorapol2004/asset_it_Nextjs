import {Department} from "@/types/type";
import { apiClient } from "@/service/apiClient";

export const department = {
    
    getAll: async (): Promise<Department[]> => {
        const res = await apiClient('/department/drop_down');
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch departments');
        } else {
            return res.json();
        }
    },

    create: async (data: { departmentName: string }): Promise<Department> => {
        const res = await apiClient('/department/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to create department' }));
            throw new Error(error.message || 'Failed to create department');
        }
        return res.json();
    },

    update: async (id: number, data: { departmentName?: string }): Promise<Department> => {
        const res = await apiClient(`/department/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to update department' }));
            throw new Error(error.message || 'Failed to update department');
        }
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await apiClient(`/department/delete/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to delete department' }));
            throw new Error(error.message || 'Failed to delete department');
        }
    },

}

