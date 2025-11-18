import { BorrowView, BorrowStatus } from "@/types/type";

import {API_URL} from "@/lib/config";

export const borrow_history = {

    filterByStatus: async (statusId?: number, roleId?: number, departmentId?: number): Promise<BorrowView[]> => {
        const params = new URLSearchParams();
        if (statusId && statusId > 0) {
            params.append('borrowStatusId', statusId.toString());
        }
        if (roleId && roleId > 0) {
            params.append('roleId', roleId.toString());
        }
        if (departmentId && departmentId > 0) {
            params.append('departmentId', departmentId.toString());
        }

        // ถ้าไม่มี parameter เลย ให้เรียก getAll แทน
        if (params.toString() === '') {
            const res = await fetch(`${API_URL}/borrow/all`);
            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch all borrows');
            } else {
                return res.json();
            }
        }

        const res = await fetch(`${API_URL}/borrow/filter?${params.toString()}`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to filter borrows');
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


    getStatuses: async (): Promise<BorrowStatus[]> => {
        const res = await fetch(`${API_URL}/borrow_status/status`);
        
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch borrow statuses');
        } else {
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        }
    },


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


    getEquipmentStatuses: async (): Promise<{ id: number; equipmentStatusName: string }[]> => {
        const res = await fetch(`${API_URL}/equipment_status/status`);
        
        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch equipment statuses');
        } else {
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        }
    },


    select: async (borrowId: number): Promise<BorrowView[]> => {
        const res = await fetch(`${API_URL}/borrow/select?borrowId=${borrowId}`);

        if (res.status === 204 || res.status === 404) {
            throw new Error('Borrow not found');
        } else if (!res.ok) {
            throw new Error('Failed to fetch borrow details');
        } else {
            return res.json();
        }
    },


    returnSingle: async (
        borrowerEquipmentId: number,
        statusId: number,
        returnDate?: string
    ): Promise<void> => {
        const body = {
            borrowerEquipmentId: borrowerEquipmentId,
            statusId: statusId,
            returnDate: returnDate || new Date().toISOString().split('T')[0],
        };

        const res = await fetch(`${API_URL}/borrow/return`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`Failed to return equipment: ${errorText}`);
        } else {
            return;
        }
    },
}