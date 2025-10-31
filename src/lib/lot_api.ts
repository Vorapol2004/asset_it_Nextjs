import {Lot, LotCreateData, LotCreateResponse, LotType} from "@/types/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const lot_api = {
    lot: {
        /**
         *  ดึง Lot ทั้งหมด
         */
        getAll: async (): Promise<Lot[]> => {
            const res = await fetch(`${API_URL}/lots/all`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch lots');
            } else {
                return res.json();
            }
        },

        create: async (data: LotCreateData): Promise<LotCreateResponse> => {
            const res = await fetch(`${API_URL}/lots/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create lot');
            } else {
                return res.json();
            }
        },

        getTypes: async (): Promise<LotType[]> => {
            const res = await fetch(`${API_URL}/lot-types`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch lot types');
            } else {
                return res.json();
            }
        },

    }
}