import {Room} from "@/types/type";
import {API_URL} from "@/lib/config";

export const room = {
    
    getByFloor: async (floorId: number): Promise<Room[]> => {
        const res = await fetch(`${API_URL}/room/filter?floorId=${floorId}`);
        if (res.status === 204) return [];
        else if (!res.ok) throw new Error('Failed to fetch rooms');
        else return res.json();
    },

    // TODO: แก้ไข path ให้ตรงกับหลังบ้าน
    create: async (data: { roomName: string; floorId: number }): Promise<Room> => {
        const res = await fetch(`${API_URL}/room`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to create room' }));
            throw new Error(error.message || 'Failed to create room');
        }
        return res.json();
    },

    // TODO: แก้ไข path ให้ตรงกับหลังบ้าน
    update: async (id: number, data: { roomName?: string; floorId?: number; isActive?: boolean }): Promise<Room> => {
        const res = await fetch(`${API_URL}/room/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to update room' }));
            throw new Error(error.message || 'Failed to update room');
        }
        return res.json();
    },

    // TODO: แก้ไข path ให้ตรงกับหลังบ้าน
    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/room/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Failed to delete room' }));
            throw new Error(error.message || 'Failed to delete room');
        }
    },
}

