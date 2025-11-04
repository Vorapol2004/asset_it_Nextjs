import { BorrowView, BorrowStatus } from "@/types/type";

import {API_URL} from "@/lib/config";

export const borrow_history = {
    /**
     * กรองข้อมูลการยืมตาม status
     * Backend: GET /borrow/filter/Status/{id}
     */
    filterByStatus: async (statusId: number): Promise<BorrowView[]> => {
        const res = await fetch(`${API_URL}/borrow/filter/Status/${statusId}`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to filter borrows by status');
        } else {
            return res.json();
        }
    },

    /**
     *  ค้นหาข้อมูลการยืมด้วย keyword
     */
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

    /**
     * ดึงสถานะการยืมทั้งหมด
     * Backend: GET /borrow/statuses
     * 
     * Note: ถ้า backend ยังไม่มี endpoint นี้ ให้:
     * 1. Comment บรรทัด fetch และ uncomment mock data
     * 2. หรือเปลี่ยน endpoint path ให้ตรงกับ backend
     */
    getStatuses: async (): Promise<BorrowStatus[]> => {
        const res = await fetch(`${API_URL}/borrow/statuses`);
        
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            // ถ้า backend ยังไม่มี endpoint ให้ใช้ mock data
            // Uncomment mock data ด้านล่างและ comment บรรทัด throw
            throw new Error('Failed to fetch borrow statuses');
        } else {
            return res.json();
        }

        // Mock data (ใช้เมื่อ backend ยังไม่มี endpoint)
        // Uncomment ส่วนนี้เมื่อ backend ยังไม่มี endpoint
        // return [
        //     { id: 1, borrowStatusName: 'กำลังยืม' },
        //     { id: 2, borrowStatusName: 'คืนแล้ว' },
        //     { id: 3, borrowStatusName: 'คืนบางส่วน' },
        //     { id: 4, borrowStatusName: 'เกินกำหนด' },
        // ];
    },

    /**
     * ดึงตำแหน่งทั้งหมดสำหรับ dropdown
     * Backend: GET /borrow/employeeRole/dropdown
     */
    getRoles: async (): Promise<{ id: number; roleName: string }[]> => {
        const res = await fetch(`${API_URL}/borrow/employeeRole/dropdown`);
        
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch roles');
        } else {
            const data = await res.json();
            // แปลงเป็น array of strings สำหรับ dropdown
            return Array.isArray(data) ? data : [];
        }
    },

    /**
     * ดึงประเภทอุปกรณ์ทั้งหมดสำหรับ dropdown
     * Backend: GET /equipment_type/type
     */
    getEquipmentTypes: async (): Promise<{ id: number; equipmentTypeName: string }[]> => {
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

    /**
     *  คืนอุปกรณ์ทีละชิ้น
     */
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
}