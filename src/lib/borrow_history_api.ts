import {BorrowCreateData, BorrowCreateResponse, BorrowView, EquipmentView} from "@/types/type";

const API_URL = process.env.API_ENDPOINT || 'http://localhost:8080';

export const borrow_history_api = {

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
}