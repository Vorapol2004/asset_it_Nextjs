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

    /**
     *  ดึงรายการผู้ยืมเก่า (distinct borrowers)
     *  TODO: เปลี่ยน endpoint เมื่อ backend พร้อม
     *  Endpoint ที่ควรจะเป็น: GET /borrow/borrowers หรือ GET /borrow/distinct-borrowers
     *  Response ควรมีข้อมูลครบ: firstName, lastName, email, phone, roleName, 
     *                             buildingId, buildingName, roomId, roomName, 
     *                             departmentId, departmentName, approverName
     *  
     *  ตอนนี้ใช้ /borrow/all ซึ่ง BorrowView อาจไม่มี field ครบ:
     *  - phone (ต้องดึงจาก employee หรือ join table)
     *  - buildingId, buildingName (ต้อง join กับ location tables)
     *  - roomId, roomName (ต้อง join กับ location tables)
     *  - departmentId, departmentName (ต้อง join กับ department table)
     *  - approverName (ต้อง join กับ employee หรือ approver table)
     */
    getPreviousBorrowers: async (): Promise<BorrowView[]> => {
        // TODO: เปลี่ยนเป็น endpoint จริงเมื่อ backend พร้อม
        // const res = await fetch(`${API_URL}/borrow/borrowers`); 
        // หรือ
        // const res = await fetch(`${API_URL}/borrow/distinct-borrowers`);
        
        // ตอนนี้ใช้ endpoint ชั่วคราว
        const res = await fetch(`${API_URL}/borrow/all`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch previous borrowers');
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
     * ดึงอุปกรณ์ที่กำลังถูกยืมอยู่ (dropdown)
     * Backend: GET /borrow/equipmentBorrow/dropDown
     * Note: อาจจะต้องใช้ endpoint อื่นสำหรับอุปกรณ์ที่พร้อมให้ยืม
     */
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

    /**
     *  ดึงตึกตาม departmentId
     *  Backend: GET /borrow/buildings/{departmentId}
     */
    getBuildingsByDepartment: async (departmentId: number): Promise<Building[]> => {
        const res = await fetch(`${API_URL}/borrow/buildings/${departmentId}`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch buildings');
        } else {
            return res.json();
        }
    },


    /**
     *  ดึงห้องตาม departmentId และ buildingId
     *  Backend: GET /borrow/rooms?departmentId={id}&buildingId={id}
     */
    getRoomsByDepartmentAndBuilding: async (departmentId: number, buildingId: number): Promise<Room[]> => {
        const res = await fetch(`${API_URL}/borrow/rooms?departmentId=${departmentId}&buildingId=${buildingId}`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch rooms');
        } else {
            return res.json();
        }
    },

    /**
     *  ดึงแผนกทั้งหมด
     */
    getDepartments: async (): Promise<Department[]> => {
        const res = await fetch(`${API_URL}/departments/all`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch departments');
        } else {
            return res.json();
        }
    },
}