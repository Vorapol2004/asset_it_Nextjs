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

    /**
     *  สร้างการยืมใหม่
     *  Backend endpoint: POST /borrow/create
     *  Request body format:
     *  {
     *    "employeeId": Integer,
     *    "referenceDoc": String (optional, nullable),
     *    "borrowDate": "YYYY-MM-DD" (LocalDate),
     *    "dueDate": "YYYY-MM-DD" (LocalDate),
     *    "equipmentIds": [Integer, Integer, ...]
     *  }
     */
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
     *  ดึงประเภทอุปกรณ์ทั้งหมด
     *  Backend: GET /equipment_type/type
     */
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

    /**
     *  ดึงอุปกรณ์ตามประเภทอุปกรณ์
     *  Backend: GET /equipment/select_equipment_type?equipmentId={id}
     */
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

    /**
     *  ค้นหาอุปกรณ์ด้วย licensekey หรือ serialnumber
     *  Backend: GET /equipment/identifier?keyword={value}
     *  Note: Backend จะค้นหาและส่งกลับเฉพาะอุปกรณ์ที่ยังไม่ได้ยืมมา (status = 1)
     */
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