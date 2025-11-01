import {EquipmentView} from "@/types/type";

import {API_URL} from "@/lib/config";
export const equipment = {

    equipment: {

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

        filterMultiple: async (params: {
            typeId?: number;
            statusId?: number;
            keyword?: string;
        }): Promise<EquipmentView[]> => {
            let url = `${API_URL}/equipment/all`;

            if (params.keyword && !params.typeId && !params.statusId) {
                url = `${API_URL}/equipment/search?keyword=${encodeURIComponent(params.keyword)}`;
            } else if (params.typeId || params.statusId) {
                const queryParams = new URLSearchParams();
                if (params.typeId) queryParams.append("equipmentType", String(params.typeId));
                if (params.statusId) queryParams.append("equipmentStatus", String(params.statusId));
                url = `${API_URL}/equipment/filter?${queryParams.toString()}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();

            // keyword + type/status พร้อมกัน → filter เพิ่มใน frontend
            if (params.keyword && (params.typeId || params.statusId)) {
                const keyword = params.keyword.toLowerCase().trim();
                return data.filter((eq: EquipmentView) =>
                    eq.equipmentName?.toLowerCase().includes(keyword) ||
                    eq.brand?.toLowerCase().includes(keyword) ||
                    eq.model?.toLowerCase().includes(keyword) ||
                    eq.serialNumber?.toLowerCase().includes(keyword) ||
                    eq.licenseKey?.toLowerCase().includes(keyword) ||
                    eq.lotName?.toLowerCase().includes(keyword)
                );
            }

            return data;
        },


        async delete(id: number) {
            const res = await fetch(`${API_URL}/equipment/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('ไม่สามารถลบอุปกรณ์ได้');
            return await res.text();
        },

    }
}