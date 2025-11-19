import {Building} from "@/types/type";
import { apiClient } from "@/service/apiClient";

export const building = {
    
    filter: async (departmentId: number): Promise<Building[]> => {
        const res = await apiClient(`/building/filter?departmentId=${departmentId}`);
        if (res.status === 204) return [];
        else if (!res.ok) throw new Error('Failed to filter buildings');
        else return res.json();
    },

    create: async (data: { buildingName: string; departmentId: number }): Promise<Building> => {
        const res = await apiClient('/building/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to create building' }));
            throw new Error(error.message || 'Failed to create building');
        }
        return res.json();
    },

    update: async (id: number, data: { buildingName?: string; departmentId?: number }): Promise<Building> => {
        const res = await apiClient(`/building/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to update building' }));
            throw new Error(error.message || 'Failed to update building');
        }
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await apiClient(`/building/delete/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to delete building' }));
            throw new Error(error.message || 'Failed to delete building');
        }
    },
}

