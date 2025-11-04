import { API_URL } from '@/lib/config';
import { BorrowView } from '@/types/type';

/**
 * API endpoints สำหรับหน้า old_borrow
 */
export const oldBorrow = {
    /**
     *  ดึงรายการผู้ยืมเก่า (distinct borrowers)
     *  TODO: เปลี่ยนเป็น endpoint จริงเมื่อ backend พร้อม
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

    /**
     *  ลบ borrow record
     *  Backend endpoint: DELETE /borrow/{id}
     *  TODO: ตรวจสอบ endpoint ที่ถูกต้องจาก backend
     */
    deleteBorrow: async (borrowId: number): Promise<void> => {
        // TODO: ตรวจสอบ endpoint ที่ถูกต้องจาก backend
        // อาจจะเป็น DELETE /borrow/{id} หรือ DELETE /borrow/delete/{id}
        const res = await fetch(`${API_URL}/borrow/${borrowId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to delete borrow' }));
            throw new Error(errorData.message || 'Failed to delete borrow');
        }
    },

    /**
     *  ลบ borrow records ทั้งหมดของ borrower (optional)
     *  Backend endpoint: DELETE /borrow/borrower/{employeeId}
     *  TODO: ตรวจสอบ endpoint ที่ถูกต้องจาก backend
     */
    deleteBorrowerBorrows: async (employeeId: number): Promise<void> => {
        // TODO: ตรวจสอบ endpoint ที่ถูกต้องจาก backend
        // อาจจะเป็น DELETE /borrow/borrower/{employeeId} หรือ DELETE /borrow/employee/{employeeId}
        const res = await fetch(`${API_URL}/borrow/borrower/${employeeId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to delete borrower borrows' }));
            throw new Error(errorData.message || 'Failed to delete borrower borrows');
        }
    },
};

