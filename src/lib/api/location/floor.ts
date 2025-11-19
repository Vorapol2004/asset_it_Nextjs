import {Floor} from "@/types/type";
import { apiClient } from "@/service/apiClient";

export const floor = {
    
    getByBuilding: async (buildingId: number): Promise<Floor[]> => {
        const res = await apiClient(`/floor/filter?buildingId=${buildingId}`);
        if (res.status === 204) return [];
        else if (!res.ok) throw new Error('Failed to fetch floors');
        else return res.json();
    },

    create: async (data: { floorName: string; buildingId: number }): Promise<Floor> => {
        const res = await apiClient('/floor/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to create floor' }));
            throw new Error(error.message || 'Failed to create floor');
        }
        return res.json();
    },

    update: async (id: number, data: { floorName?: string; buildingId?: number }): Promise<Floor> => {
        const res = await apiClient(`/floor/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to update floor' }));
            throw new Error(error.message || 'Failed to update floor');
        }
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await apiClient(`/floor/delete/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to delete floor' }));
            throw new Error(error.message || 'Failed to delete floor');
        }
    },
}

