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

   
    selectEmployee: async (employeeId: number): Promise<EmployeeView> => {
        const res = await apiClient(`/employee/select_employee?employeeId=${employeeId}`);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to select employee' }));
            throw new Error(errorData.message || 'Failed to select employee');
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

    
    update: async (id: number, data: Partial<Employee> & { roomId?: number }): Promise<Employee> => {
        // ตรวจสอบว่า id ถูกต้องหรือไม่
        if (!id || id === 0 || isNaN(id)) {
            throw new Error(`Invalid employee ID: ${id}`);
        }

        // ใช้ data ที่ส่งมาโดยตรง (useOldBorrow สร้างไว้แล้ว)
        // ลบ roomId ออกถ้าไม่มีหรือ <= 0 (เพราะ backend ต้องการ optional)
        const { roomId, ...requestData } = data;
        const bodyData: Record<string, unknown> = {
            employeeId: id, // Backend ต้องการ employeeId (ไม่ใช่ id)
            ...requestData,
            description: requestData.description ?? null,
        };
        
        // เพิ่ม roomId เฉพาะเมื่อ > 0
        if (roomId && roomId > 0) {
            bodyData.roomId = roomId;
        }

        // Backend ต้องการ path: PUT /employee/edit (ไม่มี /id ใน path)
        // ส่ง id ใน request body แทน
        const res = await apiClient('/employee/edit', {
            method: 'PUT',
            body: JSON.stringify(bodyData),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to update employee' }));
            const errorMessage = errorData.message || errorData.error || errorData.errorMessage || `Failed to update employee (Status: ${res.status} ${res.statusText})`;
            throw new Error(errorMessage);
        } else {
            return res.json();
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
}
