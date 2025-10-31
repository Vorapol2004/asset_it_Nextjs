import {EquipmentView} from "@/types/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL|| 'http://localhost:8080';
export const equipment_api = {

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
    }
}