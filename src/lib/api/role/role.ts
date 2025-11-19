import { apiClient } from "@/service/apiClient";

export interface Role {
    id: number;
    roleName: string;
}

export const role = {
    
    filter: async (): Promise<Role[]> => {
        const res = await apiClient('/role/filter');

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch roles');
        } else {
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        }
    },
};

