import {Employee, EmployeeView} from "@/types/type";
import { apiClient } from "@/service/apiClient";

export const employee = {
    
    getAll: async (): Promise<EmployeeView[]> => {
        const res = await apiClient('/employee/all');

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch employees');
        } else {
            return res.json();
        }
    },

    
    getById: async (id: number): Promise<EmployeeView> => {
        const res = await apiClient(`/employee/${id}`);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to fetch employee' }));
            throw new Error(errorData.message || 'Failed to fetch employee');
        } else {
            return res.json();
        }
    },

   
    selectEmployee: async (employeeId: number): Promise<EmployeeView> => {
        const res = await apiClient(`/employee/select_employee?employeeId=${employeeId}`);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to select employee' }));
            throw new Error(errorData.message || 'Failed to select employee');
        } else {
            return res.json();
        }
    },

    
    getByRole: async (roleId: number): Promise<EmployeeView[]> => {
        const res = await apiClient(`/employee/role/${roleId}`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch employees by role');
        } else {
            return res.json();
        }
    },

    
    getByDepartment: async (departmentId: number): Promise<EmployeeView[]> => {
        const res = await apiClient(`/employee/dep/${departmentId}`);

        if (res.status === 204) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch employees by department');
        } else {
            return res.json();
        }
    },

    create: async (data: Partial<Employee> & { roomId?: number }): Promise<Employee> => {
        const res = await apiClient('/employee/add', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to create employee' }));
            throw new Error(errorData.message || `Failed to create employee: ${res.status} ${res.statusText}`);
        } else {
            return res.json();
        }
    },

    
    update: async (id: number, data: Partial<Employee>): Promise<Employee> => {
        const res = await apiClient(`/employee/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Failed to update employee');
        } else {
            return res.json();
        }
    },

   
    delete: async (id: number): Promise<void> => {
        const res = await apiClient(`/employee/${id}`, { method: 'DELETE' });

        if (!res.ok) {
            throw new Error('Failed to delete employee');
        } else {
            return;
        }
    },

    
    search: async (keyword: string): Promise<EmployeeView[]> => {
        const res = await apiClient(`/employee/search?keyword=${encodeURIComponent(keyword)}`);

        if (res.status === 204 || res.status === 404) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to search employees');
        } else {
            return res.json();
        }
    },

    
    getByDepartmentAndRole: async (departmentId: number, roleId: number): Promise<EmployeeView[]> => {
        const res = await apiClient(`/employee/dep/${departmentId}/role/${roleId}`);

        if (res.status === 204 || res.status === 404) {
            return [];
        } else if (!res.ok) {
            throw new Error('Failed to fetch employees by department and role');
        } else {
            return res.json();
        }
    },
}
