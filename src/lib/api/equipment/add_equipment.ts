import {Equipment} from "@/types/type";
import { apiClient } from "@/service/apiClient";


export const add_equipment = {
    
    create: async (data: Partial<Equipment>): Promise<Equipment> => {
        const res = await apiClient('/equipment/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || 'Failed to create equipment');
        } else {
            return res.json();
        }
    },

    update: async (id: number, data: Partial<Equipment>): Promise<Equipment> => {
        const res = await apiClient(`/equipment/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Failed to update equipment');
        } else {
            return res.json();
        }
    },

    delete: async (id: number): Promise<void> => {
        const res = await apiClient(`/equipment/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error('Failed to delete equipment');
        } else {
            return;
        }
    },
}

