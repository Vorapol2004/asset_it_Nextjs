import {Building} from "@/types/type";
import {API_URL} from "@/lib/config";

export const building = {
    
    filter: async (departmentId: number): Promise<Building[]> => {
        const res = await fetch(`${API_URL}/building/filter?departmentId=${departmentId}`);
        if (res.status === 204) return [];
        else if (!res.ok) throw new Error('Failed to filter buildings');
        else return res.json();
    },

    create: async (data: { buildingName: string; departmentId: number }): Promise<Building> => {
        const res = await fetch(`${API_URL}/building/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to create building' }));
            throw new Error(error.message || 'Failed to create building');
        }
        return res.json();
    },

    update: async (id: number, data: { buildingName?: string; departmentId?: number }): Promise<Building> => {
        const res = await fetch(`${API_URL}/building/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to update building' }));
            throw new Error(error.message || 'Failed to update building');
        }
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/building/delete/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to delete building' }));
            throw new Error(error.message || 'Failed to delete building');
        }
    },
}

