import {EquipmentView} from "@/types/type";
import { apiClient } from "@/service/apiClient";

const filterEquipment = async (params: {
    equipmentStatusId?: number;
    equipmentTypeId?: number;
    keyword?: string;
}): Promise<EquipmentView[]> => {
    const queryParams = new URLSearchParams();
    
    // Backend ใช้ parameter names: equipmentStatusId, equipmentTypeId, keyword
    if (params.equipmentStatusId && params.equipmentStatusId > 0) {
        queryParams.append("equipmentStatusId", String(params.equipmentStatusId));
    }
    if (params.equipmentTypeId && params.equipmentTypeId > 0) {
        queryParams.append("equipmentTypeId", String(params.equipmentTypeId));
    }
    if (params.keyword && params.keyword.trim()) {
        queryParams.append("keyword", params.keyword.trim());
    }
    
    const res = await apiClient(`/equipment/filter?${queryParams.toString()}`);
    
    if (res.status === 204 || res.status === 404) {
        return [];
    } else if (!res.ok) {
        throw new Error("Failed to filter equipment");
    }
    
    return res.json();
};

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
        
        // ตรวจสอบว่า data เป็น array หรือ object
        let equipmentData: EquipmentView;
        if (Array.isArray(data)) {
            if (data.length === 0) {
                throw new Error('Equipment not found');
            }
            equipmentData = data[0]; // Backend ส่งมาเป็น Array
        } else if (data && typeof data === 'object') {
            // ถ้า backend ส่งมาเป็น object โดยตรง
            equipmentData = data;
        } else {
            throw new Error('Invalid equipment data format');
        }
        
        return equipmentData;
    },

    // ใช้ path เดียว /equipment/filter สำหรับทั้ง search และ filter
    filter: filterEquipment,

    // search: ใช้ filter แทน (backward compatibility)
    search: async (keyword: string): Promise<EquipmentView[]> => {
        return filterEquipment({ keyword });
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