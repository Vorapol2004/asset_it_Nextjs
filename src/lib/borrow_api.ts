import {BorrowCreateData, BorrowCreateResponse, BorrowStatus, BorrowView, EquipmentView} from "@/types/type";

const API_URL = process.env.API_URL || 'http://localhost:8080';
export const borrow_api = {
    borrow: {

        getAll: async (): Promise<BorrowView[]> => {
            const res = await fetch(`${API_URL}/borrow/all`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch borrows');
            } else {
                return res.json();
            }
        },

        search: async (keyword: string): Promise<BorrowView[]> => {
            const res = await fetch(`${API_URL}/borrow/search?keyword=${encodeURIComponent(keyword)}`);

            if (res.status === 204 || res.status === 404) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to search borrows');
            } else {
                return res.json();
            }
        },

        getByStatus: async (statusId: number): Promise<BorrowView[]> => {
            const res = await fetch(`${API_URL}/borrow/filter/Status/${statusId}`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to filter borrows by status');
            } else {
                return res.json();
            }
        },

        filterMultiple: async (params: {
            statusId?: number;
            roleName?: string;
            equipmentType?: string;
            keyword?: string;
        }): Promise<BorrowView[]> => {
            const queryParams = new URLSearchParams();

            if (params.statusId) queryParams.append('statusId', String(params.statusId));
            if (params.roleName && params.roleName !== 'all') queryParams.append('roleName', params.roleName);
            if (params.equipmentType && params.equipmentType !== 'all') queryParams.append('equipmentType', params.equipmentType);
            if (params.keyword) queryParams.append('keyword', params.keyword);

            const url = `${API_URL}/borrow/filter${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            const res = await fetch(url);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to filter borrows');
            } else {
                return res.json();
            }
        },

        returnSingle: async (borrowEquipmentId: number): Promise<void> => {
            const res = await fetch(`${API_URL}/borrow-equipment/${borrowEquipmentId}/return`, {
                method: 'POST',
            });

            if (!res.ok) {
                throw new Error('Failed to return equipment');
            } else {
                return;
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


        /**
         *  ดึงอุปกรณ์ที่พร้อมให้ยืม
         */
        getAvailableEquipment: async (): Promise<EquipmentView[]> => {
            const res = await fetch(`${API_URL}/borrow/available-equipment`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch available equipment');
            } else {
                return res.json();
            }
        },

        /**
         *  ดึงรายการที่ยัง active (ยังไม่คืน)
         */
        getActive: async (): Promise<BorrowView[]> => {
            const res = await fetch(`${API_URL}/borrow/active`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch active borrows');
            } else {
                return res.json();
            }
        },

        /**
         *  ดึงรายการที่เกินกำหนด
         */
        getOverdue: async (): Promise<BorrowView[]> => {
            const res = await fetch(`${API_URL}/borrow/overdue`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch overdue items');
            } else {
                return res.json();
            }
        },

        /**
         *  ดึงสถานะการยืมทั้งหมด
         */
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
    }
}