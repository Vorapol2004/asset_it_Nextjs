import {Floor} from "@/types/type";

const API_URL = process.env.API_URL || 'http://localhost:8080';

export const CRUD_floor_api = {

    floor: {
        getAll: async (): Promise<Floor[]> => {
            const res = await fetch(`${API_URL}/floors/all`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch floors');
            else return res.json();
        },

        getById: async (id: number): Promise<Floor> => {
            const res = await fetch(`${API_URL}/floors/${id}`);
            if (!res.ok) throw new Error('Failed to fetch floor');
            else return res.json();
        },

        getByBuilding: async (buildingId: number): Promise<Floor[]> => {
            const res = await fetch(`${API_URL}/floors/building/${buildingId}`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch floors');
            else return res.json();
        },

        create: async (data: Partial<Floor>): Promise<Floor> => {
            const res = await fetch(`${API_URL}/floors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create floor');
            }
            else return res.json();
        },

        update: async (id: number, data: Partial<Floor>): Promise<Floor> => {
            const res = await fetch(`${API_URL}/floors/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to update floor');
            }
            else return res.json();
        },

        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/floors/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete floor');
        },
    },
}