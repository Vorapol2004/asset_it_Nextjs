import {EquipmentView} from "@/types/type";

import {API_URL} from "@/lib/config";
export const equipment = {
    //ดึงอุปกรณ์ทั้งหมด
    getAll: async (): Promise<EquipmentView[]> => {
        const res = await fetch(`${API_URL}/equipment/all`);

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
        const res = await fetch(`${API_URL}/equipment/select/${id}`);

        if (res.status === 204) {
            throw new Error('Equipment not found');
        } else if (!res.ok) {
            throw new Error('Failed to fetch equipment detail');
        }

        const data = await res.json();
        return data[0]; // Backend ส่งมาเป็น Array
    },

    
    search: async (keyword: string): Promise<EquipmentView[]> => {
        const res = await fetch(
            `${API_URL}/equipment/search?keyword=${encodeURIComponent(keyword)}`
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
        
        const url = `${API_URL}/equipment/filter?${queryParams.toString()}`;
        const res = await fetch(url);
        
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

        const res = await fetch(`${API_URL}/equipment/edit`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
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
        const res = await fetch(`${API_URL}/equipment/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('ไม่สามารถลบอุปกรณ์ได้');
        return await res.text();
    },

    
    getTypes: async (): Promise<{ id: number; equipmentTypeName: string }[]> => {
        const res = await fetch(`${API_URL}/equipment_type/type`);
        
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
        const res = await fetch(`${API_URL}/equipment_status/status`);
        
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