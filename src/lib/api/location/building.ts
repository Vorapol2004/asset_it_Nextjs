import {Building} from "@/types/type";
import {API_URL} from "@/lib/config";

export const building = {
    
    filter: async (departmentId: number): Promise<Building[]> => {
        const res = await fetch(`${API_URL}/building/filter?departmentId=${departmentId}`);
        if (res.status === 204) return [];
        else if (!res.ok) throw new Error('Failed to filter buildings');
        else return res.json();
    },
}

