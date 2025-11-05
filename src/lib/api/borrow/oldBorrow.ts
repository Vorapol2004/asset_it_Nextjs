import { API_URL } from '@/lib/config';
import { BorrowView } from '@/types/type';

/**
 * API endpoints สำหรับหน้า old_borrow
 */
export const oldBorrow = {
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

