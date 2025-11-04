import {Room} from "@/types/type";
import {API_URL} from "@/lib/config";

export const room = {
    /**
     * ดึงห้องตาม floorId
     * Backend: GET /room/filter?floorId={id}
     */
    getByFloor: async (floorId: number): Promise<Room[]> => {
        const res = await fetch(`${API_URL}/room/filter?floorId=${floorId}`);
        if (res.status === 204) return [];
        else if (!res.ok) throw new Error('Failed to fetch rooms');
        else return res.json();
    },
}

