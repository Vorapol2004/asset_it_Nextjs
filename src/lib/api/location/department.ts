import {Department} from "@/types/type";
import {API_URL} from "@/lib/config";

export const department = {
    /**
     * ดึงแผนกทั้งหมด (dropdown)
     * Backend: GET /department/drop_down
     */
    getAll: async (): Promise<Department[]> => {
        const res = await fetch(`${API_URL}/department/drop_down`);
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch departments');
        } else {
            return res.json();
        }
    },

}

