import {EquipmentView} from "@/types/type";
import { apiClient } from "@/service/apiClient";

export const equipment = {
    //ดึงอุปกรณ์ทั้งหมด
    getAll: async (): Promise<EquipmentView[]> => {
        const res = await apiClient('/equipment/all');

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch equipment');
        } else {
            return res.json();
        }
    },

    //เลือกดูอุปกรณ์ทีละตัว
    getById: async (id: number): Promise<EquipmentView> => {
        const res = await apiClient(`/equipment/select/${id}`);

        if (res.status === 204) {
            throw new Error('Equipment not found');
        } else if (!res.ok) {
            throw new Error('Failed to fetch equipment detail');
        }

        const data = await res.json();
        return data[0]; // Backend ส่งมาเป็น Array
    },

    
    search: async (keyword: string): Promise<EquipmentView[]> => {
        const res = await apiClient(
            `/equipment/search?keyword=${encodeURIComponent(keyword)}`
        );

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to search equipment');
        } else {
            return res.json();
        }
    },

    
    filter: async (params: {
        typeId?: number;
        statusId?: number;
        departmentId?: number;
    }): Promise<EquipmentView[]> => {
        const queryParams = new URLSearchParams();
        if (params.statusId) queryParams.append("equipmentStatus", String(params.statusId));
        if (params.typeId) queryParams.append("equipmentType", String(params.typeId));
        if (params.departmentId) queryParams.append("departmentId", String(params.departmentId));
        
        const res = await apiClient(`/equipment/filter?${queryParams.toString()}`);
        
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error("Failed to filter equipment");
        }
        
        return res.json();
    },


    update: async (id: number, data: Partial<EquipmentView>): Promise<EquipmentView> => {
        // สร้าง request body โดยเพิ่ม equipmentId
        const requestBody = {
            equipmentId: id,
            ...data,
        };

        const res = await apiClient('/equipment/edit', {
            method: 'PUT',
            body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to update equipment' }));
            throw new Error(errorData.message || `Failed to update equipment: ${res.status} ${res.statusText}`);
        } else {
            return res.json();
        }
    },


    async delete(id: number) {
        const res = await apiClient(`/equipment/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('ไม่สามารถลบอุปกรณ์ได้');
        return await res.text();
    },

    
    getTypes: async (): Promise<{ id: number; equipmentTypeName: string }[]> => {
        const res = await apiClient('/equipment_type/type');
        
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch equipment types');
        } else {
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        }
    },

    
    getStatuses: async (): Promise<{ id: number; equipmentStatusName: string }[]> => {
        const res = await apiClient('/equipment_status/status');
        
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch equipment statuses');
        } else {
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        }
    },
}