import {Room} from "@/types/type";
import { apiClient } from "@/service/apiClient";

export const room = {
    
    getByFloor: async (floorId: number): Promise<Room[]> => {
        const res = await apiClient(`/room/filter?floorId=${floorId}`);
        if (res.status === 204) return [];
        else if (!res.ok) throw new Error('Failed to fetch rooms');
        else return res.json();
    },

    create: async (data: { roomName: string; floorId: number }): Promise<Room> => {
        const res = await apiClient('/room/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to create room' }));
            throw new Error(error.message || 'Failed to create room');
        }
        return res.json();
    },

    update: async (id: number, data: { roomName?: string; floorId?: number }): Promise<Room> => {
        const res = await apiClient(`/room/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to update room' }));
            throw new Error(error.message || 'Failed to update room');
        }
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        const res = await apiClient(`/room/delete/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to delete room' }));
            throw new Error(error.message || 'Failed to delete room');
        }
    },
}

