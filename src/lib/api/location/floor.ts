import {Floor} from "@/types/type";
import {API_URL} from "@/lib/config";

export const floor = {
    
    getByBuilding: async (buildingId: number): Promise<Floor[]> => {
        const res = await fetch(`${API_URL}/floor/filter?buildingId=${buildingId}`);
        if (res.status === 204) return [];
        else if (!res.ok) throw new Error('Failed to fetch floors');
        else return res.json();
    },

    create: async (data: { floorName: string; buildingId: number }): Promise<Floor> => {
        const res = await fetch(`${API_URL}/floor/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to create floor' }));
            throw new Error(error.message || 'Failed to create floor');
        }
        return res.json();
    },

    update: async (id: number, data: { floorName?: string; buildingId?: number }): Promise<Floor> => {
        const res = await fetch(`${API_URL}/floor/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to update floor' }));
            throw new Error(error.message || 'Failed to update floor');
        }
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/floor/delete/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to delete floor' }));
            throw new Error(error.message || 'Failed to delete floor');
        }
    },
}

