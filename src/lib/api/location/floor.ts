import {Floor} from "@/types/type";
import {API_URL} from "@/lib/config";

export const floor = {
    
    getByBuilding: async (buildingId: number): Promise<Floor[]> => {
        const res = await fetch(`${API_URL}/floor/filter?buildingId=${buildingId}`);
        if (res.status === 204) return [];
        else if (!res.ok) throw new Error('Failed to fetch floors');
        else return res.json();
    },
}

