// lib/api.ts
import { Equipment, Borrow, Employee } from '@/types/type';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = {
    // =============================
    // EQUIPMENT API
    // =============================
    equipment: {
        getAll: async (): Promise<Equipment[]> => {
            const res = await fetch(`${API_URL}/equipment`);
            if (!res.ok) throw new Error('Failed to fetch equipment');
            return res.json();
        },

        getById: async (id: number): Promise<Equipment> => {
            const res = await fetch(`${API_URL}/equipment/${id}`);
            if (!res.ok) throw new Error('Failed to fetch equipment');
            return res.json();
        },

        create: async (data: Equipment): Promise<Equipment> => {
            const res = await fetch(`${API_URL}/equipment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create equipment');
            return res.json();
        },

        update: async (id: number, data: Equipment): Promise<Equipment> => {
            const res = await fetch(`${API_URL}/equipment/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update equipment');
            return res.json();
        },

        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/equipment/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete equipment');
        },
    },

    // =============================
    // BORROW API
    // =============================
    borrow: {
        getAll: async (): Promise<Borrow[]> => {
            const res = await fetch(`${API_URL}/borrow`);
            if (!res.ok) throw new Error('Failed to fetch borrows');
            return res.json();
        },

        getById: async (id: number): Promise<Borrow> => {
            const res = await fetch(`${API_URL}/borrow/${id}`);
            if (!res.ok) throw new Error('Failed to fetch borrow');
            return res.json();
        },

        create: async (data: Borrow): Promise<Borrow> => {
            const res = await fetch(`${API_URL}/borrow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create borrow');
            return res.json();
        },

        update: async (id: number, data: Borrow): Promise<Borrow> => {
            const res = await fetch(`${API_URL}/borrow/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update borrow');
            return res.json();
        },

        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/borrow/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete borrow');
        },
    },

    // =============================
    // EMPLOYEE API
    // =============================
    employee: {
        getAll: async (): Promise<Employee[]> => {
            const res = await fetch(`${API_URL}/employee`);
            if (!res.ok) throw new Error('Failed to fetch employees');
            return res.json();
        },

        getById: async (id: number): Promise<Employee> => {
            const res = await fetch(`${API_URL}/employee/${id}`);
            if (!res.ok) throw new Error('Failed to fetch employee');
            return res.json();
        },
    },
};