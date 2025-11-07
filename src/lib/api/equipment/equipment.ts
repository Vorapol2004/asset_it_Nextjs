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

    /**
     * ✅ ค้นหาด้วย keyword
     */
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

    /**
     * กรองอุปกรณ์ตาม type และ status
     * Backend: GET /equipment/filter?equipmentStatus={id}&equipmentType={id}
     * Note: Backend รองรับแค่ filter type/status เท่านั้น
     * ถ้าต้องการ keyword ต้องเรียก search() แยก
     */
    filter: async (params: {
        typeId?: number;
        statusId?: number;
    }): Promise<EquipmentView[]> => {
        const queryParams = new URLSearchParams();
        if (params.statusId) queryParams.append("equipmentStatus", String(params.statusId));
        if (params.typeId) queryParams.append("equipmentType", String(params.typeId));
        
        const url = `${API_URL}/equipment/filter?${queryParams.toString()}`;
        const res = await fetch(url);
        
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error("Failed to filter equipment");
        }
        
        return res.json();
    },

    /**
     * ดึงอุปกรณ์ตามประเภทอุปกรณ์
     * Backend: GET /equipment/select_equipment_type?equipmentId={id}
     */
    getByType: async (equipmentTypeId?: number): Promise<EquipmentView[]> => {
        let url = `${API_URL}/equipment/select_equipment_type`;
        if (equipmentTypeId) {
            url += `?equipmentId=${equipmentTypeId}`;
        }
        
        const res = await fetch(url);
        
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch equipment by type');
        } else {
            return res.json();
        }
    },

    /**
     * อัปเดตอุปกรณ์
     * Backend: PUT /equipment/edit
     * Request body: { equipmentId, equipmentName, equipmentTypeId, brand, model, serialNumber, licenseKey, equipmentStatusId }
     */
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
}