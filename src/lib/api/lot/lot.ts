import { apiClient } from '@/service/apiClient';
import {LotRequest} from "@/types/type";

export const lot = {
    
    async getTypes() {
        const res = await apiClient('/lot_type/type');
        if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลประเภท Lot ได้');
        return await res.json();
    },


    async create(lotData: LotRequest) {
        const res = await apiClient('/equipment/add', {
            method: 'POST',
            body: JSON.stringify(lotData),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`เกิดข้อผิดพลาด: ${text}`);
        }
        return await res.json();
    },


    

};

