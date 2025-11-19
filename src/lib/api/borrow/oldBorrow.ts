import { apiClient } from '@/service/apiClient';
import { BorrowView } from '@/types/type';


export const oldBorrow = {

    deleteBorrow: async (borrowId: number): Promise<void> => {

        const res = await apiClient(`/borrow/${borrowId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to delete borrow' }));
            throw new Error(errorData.message || 'Failed to delete borrow');
        }
    },

};

