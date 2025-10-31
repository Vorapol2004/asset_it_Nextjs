import {Department} from "@/types/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const CRUD_department_api = {

    department: {
        getAll: async (): Promise<Department[]> => {
            const res = await fetch(`${API_URL}/departments/all`);
            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch departments');
            } else {
                return res.json();
            }
        },

        getById: async (id: number): Promise<Department> => {
            const res = await fetch(`${API_URL}/departments/${id}`);
            if (!res.ok) {
                throw new Error('Failed to fetch department');
            } else {
                return res.json();
            }
        },

        create: async (data: Partial<Department>): Promise<Department> => {
            const res = await fetch(`${API_URL}/departments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create department');
            } else {
                return res.json();
            }
        },

        update: async (id: number, data: Partial<Department>): Promise<Department> => {
            const res = await fetch(`${API_URL}/departments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to update department');
            } else {
                return res.json();
            }
        },

        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/departments/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Failed to delete department');
            }
        },

        search: async (keyword: string): Promise<Department[]> => {
            const res = await fetch(
                `${API_URL}/departments/search?keyword=${encodeURIComponent(keyword)}`
            );
            if (res.status === 204 || res.status === 404) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to search departments');
            } else {
                return res.json();
            }
        },
    },

}