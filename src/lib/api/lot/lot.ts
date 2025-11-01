import { API_URL } from '@/lib/config';
import {LotRequest} from "@/types/type";

export const lot = {
    async getTypes() {
        const res = await fetch(`${API_URL}/equipment/lotType/dropDown`);
        if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลประเภท Lot ได้');
        return await res.json();
    },


    async create(lotData: LotRequest) {
        const res = await fetch(`${API_URL}/equipment/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lotData),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`เกิดข้อผิดพลาด: ${text}`);
        }
        return await res.json();
    },


    // async getAll() {
    //     const res = await fetch(`${API_URL}/lot`);
    //     if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูล Lot ได้');
    //     return await res.json();
    // },

};

