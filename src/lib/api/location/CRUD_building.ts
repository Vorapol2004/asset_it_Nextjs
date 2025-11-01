import {Building} from "@/types/type";

import {API_URL} from "@/lib/config";

export const CRUD_building = {
    building: {
        getAll: async (): Promise<Building[]> => {
            const res = await fetch(`${API_URL}/buildings/all`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch buildings');
            else return res.json();
        },

        getById: async (id: number): Promise<Building> => {
            const res = await fetch(`${API_URL}/buildings/${id}`);
            if (!res.ok) throw new Error('Failed to fetch building');
            else return res.json();
        },

        create: async (data: Partial<Building>): Promise<Building> => {
            const res = await fetch(`${API_URL}/buildings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create building');
            }
            else return res.json();
        },

        update: async (id: number, data: Partial<Building>): Promise<Building> => {
            const res = await fetch(`${API_URL}/buildings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to update building');
            }
            else return res.json();
        },

        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/buildings/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete building');
        },
    },
}