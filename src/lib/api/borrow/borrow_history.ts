import { BorrowView, BorrowStatus } from "@/types/type";
import { apiClient } from "@/service/apiClient";

export const borrow_history = {

    filterByStatus: async (
        statusId?: number, 
        roleId?: number, 
        departmentId?: number, 
        keyword?: string
    ): Promise<BorrowView[]> => {
        const params = new URLSearchParams();
        
        if (keyword && keyword.trim()) {
            params.append('keyword', keyword.trim());
        }
        if (statusId && statusId > 0) {
            params.append('borrowStatusId', statusId.toString());
        }
        if (roleId && roleId > 0) {
            params.append('roleId', roleId.toString());
        }
        if (departmentId && departmentId > 0) {
            params.append('departmentId', departmentId.toString());
        }

        // ถ้าไม่มี parameter เลย → ใช้ /borrow/all (เร็วกว่า)
        // ถ้ามี parameter → ใช้ /borrow/filter
        if (params.toString() === '') {
            const res = await apiClient('/borrow/all');
            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch all borrows');
            } else {
                const data: BorrowView[] = await res.json();
                return data;
            }
        }

        const res = await apiClient(`/borrow/filter?${params.toString()}`);

        if (res.status === 204 || res.status === 404) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to filter borrows');
        } else {
            const data: BorrowView[] = await res.json();
            return data;
        }
    },


    getStatuses: async (): Promise<BorrowStatus[]> => {
        const res = await apiClient('/borrow_status/status');
        
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
        const res = await apiClient('/equipment_type/type');
        
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
        const res = await apiClient('/equipment_status/status');
        
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
        const res = await apiClient(`/borrow/select?borrowId=${borrowId}`);

        if (res.status === 204 || res.status === 404) {
            throw new Error('Borrow not found');
        } else if (!res.ok) {
            throw new Error('Failed to fetch borrow details');
        } else {
            const data = await res.json();
            // รองรับทั้ง single object และ array จาก backend
            const dataArray: BorrowView[] = Array.isArray(data) ? data : [data];
            return dataArray;
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

        const res = await apiClient('/borrow/return', {
            method: 'PATCH',
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to return equipment: ${errorText}`);
        } else {
            return;
        }
    },
}