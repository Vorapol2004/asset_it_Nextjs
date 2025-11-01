import {Room} from "@/types/type";

import {API_URL} from "@/lib/config";

export const CRUD_room = {

    room: {
        getAll: async (): Promise<Room[]> => {
            const res = await fetch(`${API_URL}/rooms/all`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch rooms');
            else return res.json();
        },

        getById: async (id: number): Promise<Room> => {
            const res = await fetch(`${API_URL}/rooms/${id}`);
            if (!res.ok) throw new Error('Failed to fetch room');
            else return res.json();
        },

        getByFloor: async (floorId: number): Promise<Room[]> => {
            const res = await fetch(`${API_URL}/rooms/floor/${floorId}`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch rooms');
            else return res.json();
        },

        create: async (data: Partial<Room>): Promise<Room> => {
            const res = await fetch(`${API_URL}/rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create room');
            }
            else return res.json();
        },

        update: async (id: number, data: Partial<Room>): Promise<Room> => {
            const res = await fetch(`${API_URL}/rooms/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to update room');
            }
            else return res.json();
        },

        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/rooms/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete room');
        },
    },
}