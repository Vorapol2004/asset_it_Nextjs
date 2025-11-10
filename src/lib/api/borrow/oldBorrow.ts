import { API_URL } from '@/lib/config';
import { BorrowView } from '@/types/type';


export const oldBorrow = {

    deleteBorrow: async (borrowId: number): Promise<void> => {

        const res = await fetch(`${API_URL}/borrow/${borrowId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to delete borrow' }));
            throw new Error(errorData.message || 'Failed to delete borrow');
        }
    },

};

