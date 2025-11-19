import {BorrowCreateData, BorrowCreateResponse, BorrowStatus, BorrowView, EquipmentView, Building, Floor, Room, Department} from "@/types/type";
import {API_URL} from "@/lib/config";

export const borrow = {

    getAll: async (): Promise<BorrowView[]> => {
        const res = await fetch(`${API_URL}/borrow/all`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch borrows');
        } else {
            const data: BorrowView[] = await res.json();
            return data;
        }
    },

    search: async (keyword: string): Promise<BorrowView[]> => {
        const res = await fetch(`${API_URL}/borrow/search?keyword=${encodeURIComponent(keyword)}`);

        if (res.status === 204 || res.status === 404) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to search borrows');
        } else {
            const data: BorrowView[] = await res.json();
            return data;
        }
    },

    create: async (data: BorrowCreateData): Promise<BorrowCreateResponse> => {
        const res = await fetch(`${API_URL}/borrow/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || 'Failed to create borrow');
        } else {
            return res.json();
        }
    },


    getAvailableEquipment: async (): Promise<EquipmentView[]> => {
        // TODO: ตรวจสอบ endpoint ที่ถูกต้องสำหรับอุปกรณ์ที่พร้อมให้ยืม
        // ตอนนี้ใช้ equipmentBorrow/dropDown ซึ่งดึงอุปกรณ์ที่กำลังถูกยืม
        const res = await fetch(`${API_URL}/borrow/equipmentBorrow/dropDown`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch available equipment');
        } else {
            return res.json();
        }
    },


    getActive: async (): Promise<BorrowView[]> => {
        const res = await fetch(`${API_URL}/borrow/active`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch active borrows');
        } else {
            const data: BorrowView[] = await res.json();
            return data;
        }
    },


    getOverdue: async (): Promise<BorrowView[]> => {
        const res = await fetch(`${API_URL}/borrow/overdue`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch overdue items');
        } else {
            const data: BorrowView[] = await res.json();
            return data;
        }
    },


    getBorrowStatuses: async (): Promise<BorrowStatus[]> => {
        const res = await fetch(`${API_URL}/borrow/statuses`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch borrow statuses');
        } else {
            return res.json();
        }
    },


    getEquipmentTypes: async (): Promise<{ id: number; equipmentTypeName: string }[]> => {
        const res = await fetch(`${API_URL}/equipment_type/type`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch equipment types');
        } else {
            return res.json();
        }
    },


    getEquipmentByType: async (equipmentTypeId: number): Promise<EquipmentView[]> => {
        const res = await fetch(`${API_URL}/equipment/select_equipment_type?equipmentId=${equipmentTypeId}`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch equipment by type');
        } else {
            return res.json();
        }
    },

    searchEquipment: async (searchValue: string): Promise<EquipmentView[]> => {
        const res = await fetch(`${API_URL}/equipment/identifier?keyword=${encodeURIComponent(searchValue)}`);

        if (res.status === 204) {
            return []; // ไม่เจอ - return empty array
        } else if (!res.ok) {
            throw new Error('Failed to search equipment');
        } else {
            const data = await res.json();
            return Array.isArray(data) ? data : []; // ตรวจสอบว่าเป็น array
        }
    },
}