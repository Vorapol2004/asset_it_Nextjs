import {Employee, EmployeeView} from "@/types/type";

import {API_URL} from "@/lib/config";

export const employee = {

    employee: {
        /**
         *  ดึงพนักงานทั้งหมด
         */
        getAll: async (): Promise<EmployeeView[]> => {
            const res = await fetch(`${API_URL}/employee/all`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch employees');
            } else {
                return res.json();
            }
        },

        /**
         *  ดึงพนักงานตาม ID
         */
        getById: async (id: number): Promise<EmployeeView> => {
            const res = await fetch(`${API_URL}/employee/${id}`);

            if (!res.ok) {
                throw new Error('Failed to fetch employee');
            } else {
                return res.json();
            }
        },

        /**
         *  ดึงพนักงานตาม Role
         */
        getByRole: async (roleId: number): Promise<EmployeeView[]> => {
            const res = await fetch(`${API_URL}/employee/role/${roleId}`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch employees by role');
            } else {
                return res.json();
            }
        },

        /**
         *  ดึงพนักงานตาม Department
         */
        getByDepartment: async (departmentId: number): Promise<EmployeeView[]> => {
            const res = await fetch(`${API_URL}/employee/dep/${departmentId}`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch employees by department');
            } else {
                return res.json();
            }
        },

        create: async (data: Partial<Employee>): Promise<Employee> => {
            const res = await fetch(`${API_URL}/employee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to create employee');
            } else {
                return res.json();
            }
        },

        /**
         *  อัปเดตพนักงาน
         */
        update: async (id: number, data: Partial<Employee>): Promise<Employee> => {
            const res = await fetch(`${API_URL}/employee/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to update employee');
            } else {
                return res.json();
            }
        },

        /**
         *  ลบพนักงาน
         */
        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/employee/${id}`, { method: 'DELETE' });

            if (!res.ok) {
                throw new Error('Failed to delete employee');
            } else {
                return;
            }
        },

        /**
         *  ค้นหาพนักงานด้วย keyword
         */
        search: async (keyword: string): Promise<EmployeeView[]> => {
            const res = await fetch(`${API_URL}/employee/search?keyword=${encodeURIComponent(keyword)}`);

            if (res.status === 204 || res.status === 404) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to search employees');
            } else {
                return res.json();
            }
        },
    }
}
