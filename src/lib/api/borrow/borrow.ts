import {BorrowCreateData, BorrowCreateResponse, EquipmentView} from "@/types/type";
import { apiClient } from "@/service/apiClient";

export const borrow = {
    create: async (data: BorrowCreateData): Promise<BorrowCreateResponse> => {
        const res = await apiClient('/borrow/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(errorData.message || 'Failed to create borrow');
        } else {
            return res.json();
        }
    },

    searchEquipment: async (searchValue: string): Promise<EquipmentView[]> => {
        const res = await apiClient(`/equipment/identifier?keyword=${encodeURIComponent(searchValue)}`);

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