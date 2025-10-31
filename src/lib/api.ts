import {
    Equipment,
    EquipmentView,
    EquipmentCreateData,
    Lot,
    LotType,
    LotCreateData,
    LotCreateResponse,
    Borrow,
    BorrowView,
    BorrowCreateData,
    BorrowCreateResponse,
    ReturnItemData,
    Employee,
    EmployeeView,
    DashboardStats,
    BorrowStats,
    ApiResponse, EquipmentType, EquipmentStatus, BorrowStatus, Building, Floor, Room, Department, ReturnResponseData,
} from '@/types/type';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = {

    // =============================
    // Equipment API
    // =============================

    equipment: {
        /**
         * ✅ ดึงอุปกรณ์ทั้งหมด
         */
        getAll: async (): Promise<EquipmentView[]> => {
            const res = await fetch(`${API_URL}/equipment/all`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch equipment');
            } else {
                return res.json();
            }
        },

        // เพิ่มใน api.equipment
        getById: async (id: number): Promise<EquipmentView> => {
            const res = await fetch(`${API_URL}/equipment/select/${id}`);

            if (res.status === 204) {
                throw new Error('Equipment not found');
            } else if (!res.ok) {
                throw new Error('Failed to fetch equipment detail');
            }

            const data = await res.json();
            return data[0]; // Backend ส่งมาเป็น Array
        },

        /**
         * ✅ กรองตามประเภท
         */
        getByType: async (typeId: number): Promise<EquipmentView[]> => {
            const res = await fetch(`${API_URL}/equipment/Type/${typeId}`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to filter by type');
            } else {
                return res.json();
            }
        },

        /**
         * ✅ กรองตามสถานะ
         */
        getByStatus: async (statusId: number): Promise<EquipmentView[]> => {
            const res = await fetch(`${API_URL}/equipment/Status/${statusId}`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to filter by status');
            } else {
                return res.json();
            }
        },

        /**
         * ✅ ค้นหาด้วย keyword
         */
        search: async (keyword: string): Promise<EquipmentView[]> => {
            const res = await fetch(
                `${API_URL}/equipment/search?keyword=${encodeURIComponent(keyword)}`
            );

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to search equipment');
            } else {
                return res.json();
            }
        },

        /**
         * ✅ กรองตาม Lot Type
         */
        getByLotType: async (lotTypeId: number): Promise<EquipmentView[]> => {
            const res = await fetch(`${API_URL}/equipment/lottype/${lotTypeId}`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to filter by lot type');
            } else {
                return res.json();
            }
        },

        /**
         * ✅ กรองตาม Lot
         */
        getByLot: async (lotId: number): Promise<EquipmentView[]> => {
            const res = await fetch(`${API_URL}/equipment/lot/${lotId}`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to filter by lot');
            } else {
                return res.json();
            }
        },

        /**
         * ✅ กรองหลายเงื่อนไขพร้อมกัน (สถานะ + ประเภท + ค้นหา)
         *
         * 📌 แก้ไขให้ทำงานกับ Backend ที่มีอยู่โดยไม่ต้องแก้ Backend
         *
         * Logic:
         * 1. ถ้ามี keyword เท่านั้น → ใช้ /equipment/search
         * 2. ถ้ามี type/status เท่านั้น → ใช้ /equipment/filter
         * 3. ถ้ามี type/status + keyword → ใช้ /equipment/filter แล้วกรอง keyword ใน Frontend
         * 4. ถ้าไม่มีอะไรเลย → ใช้ /equipment/all
         */
        filterMultiple: async (params: {
            typeId?: number;
            statusId?: number;
            keyword?: string;
        }): Promise<EquipmentView[]> => {
            console.log('🔵 filterMultiple called with params:', params);

            const hasTypeOrStatus = params.typeId || params.statusId;
            const hasKeyword = params.keyword && params.keyword.trim().length > 0;

            let results: EquipmentView[] = [];

            try {
                // Case 1: มี keyword เท่านั้น
                if (hasKeyword && !hasTypeOrStatus) {
                    const url = `${API_URL}/equipment/search?keyword=${encodeURIComponent(params.keyword!)}`;
                    console.log('🔍 Case 1: Searching with keyword only');
                    console.log('📡 Request URL:', url);

                    const res = await fetch(url);
                    console.log('📥 Response status:', res.status, res.statusText);

                    if (res.status === 204) {
                        console.log('✅ No content (204)');
                        return [];
                    } else if (!res.ok) {
                        const errorText = await res.text().catch(() => 'Unknown error');
                        console.error('❌ Error response:', errorText);
                        throw new Error(`Search failed (${res.status}): ${errorText}`);
                    }
                    results = await res.json();
                    console.log('✅ Got', results.length, 'results');
                }
                // Case 2 & 3: มี type/status
                else if (hasTypeOrStatus) {
                    const queryParams = new URLSearchParams();
                    if (params.typeId) queryParams.append('equipmentTypeId', String(params.typeId));
                    if (params.statusId) queryParams.append('equipmentStatusId', String(params.statusId));

                    const url = `${API_URL}/equipment/filter?${queryParams.toString()}`;
                    console.log('🔍 Case 2/3: Filtering with type/status');
                    console.log('📡 Request URL:', url);
                    console.log('📋 Query params:', {
                        equipmentTypeId: params.typeId || 'not set',
                        equipmentStatusId: params.statusId || 'not set'
                    });

                    const res = await fetch(url);
                    console.log('📥 Response status:', res.status, res.statusText);
                    console.log('📥 Response headers:', Object.fromEntries(res.headers.entries()));

                    if (res.status === 204) {
                        console.log('✅ No content (204)');
                        return [];
                    } else if (!res.ok) {
                        // ✅ พยายามอ่าน response body
                        let errorBody = 'Unknown error';
                        try {
                            const contentType = res.headers.get('content-type');
                            console.log('📄 Content-Type:', contentType);

                            if (contentType?.includes('application/json')) {
                                const errorJson = await res.json();
                                errorBody = JSON.stringify(errorJson, null, 2);
                            } else {
                                errorBody = await res.text();
                            }
                        } catch (e) {
                            console.error('Failed to read error body:', e);
                        }

                        console.error('❌ Error response body:', errorBody);
                        throw new Error(`Filter failed (${res.status}): ${errorBody}`);
                    }

                    const data = await res.json();
                    console.log('✅ Got', data.length, 'results from API');

                    // ถ้ามี keyword ด้วย → กรองใน Frontend
                    if (hasKeyword) {
                        console.log('🔍 Filtering by keyword in frontend:', params.keyword);
                        const keyword = params.keyword!.toLowerCase().trim();
                        results = data.filter((eq: EquipmentView) => {
                            return (
                                eq.equipmentName?.toLowerCase().includes(keyword) ||
                                eq.brand?.toLowerCase().includes(keyword) ||
                                eq.model?.toLowerCase().includes(keyword) ||
                                eq.serialNumber?.toLowerCase().includes(keyword) ||
                                eq.licenseKey?.toLowerCase().includes(keyword) ||
                                eq.lotName?.toLowerCase().includes(keyword)
                            );
                        });
                        console.log('✅ After keyword filter:', results.length, 'results');
                    } else {
                        results = data;
                    }
                }
                // Case 4: ไม่มี filter
                else {
                    const url = `${API_URL}/equipment/all`;
                    console.log('🔍 Case 4: Loading all');
                    console.log('📡 Request URL:', url);

                    const res = await fetch(url);
                    console.log('📥 Response status:', res.status, res.statusText);

                    if (res.status === 204) {
                        console.log('✅ No content (204)');
                        return [];
                    } else if (!res.ok) {
                        const errorText = await res.text().catch(() => 'Unknown error');
                        console.error('❌ Error response:', errorText);
                        throw new Error(`Load all failed (${res.status}): ${errorText}`);
                    }
                    results = await res.json();
                    console.log('✅ Got', results.length, 'results');
                }

                console.log('✅ Returning', results.length, 'total results');
                return results;

            } catch (error) {
                console.error('❌ API Error in filterMultiple:', error);
                if (error instanceof Error) {
                    console.error('❌ Error message:', error.message);
                    console.error('❌ Error stack:', error.stack);
                }
                throw error;
            }
        },

        /**
         *  สร้างอุปกรณ์ใหม่
         */
        create: async (data: Partial<Equipment>): Promise<Equipment> => {
            const res = await fetch(`${API_URL}/equipment/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create equipment');
            } else {
                return res.json();
            }
        },

        /**
         *  อัปเดตอุปกรณ์
         */
        update: async (id: number, data: Partial<Equipment>): Promise<Equipment> => {
            const res = await fetch(`${API_URL}/equipment/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to update equipment');
            } else {
                return res.json();
            }
        },

        /**
         *  ลบอุปกรณ์
         */
        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/equipment/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete equipment');
            } else {
                return;
            }
        },

        // /**
        //  *  ดึง EquipmentStatus ทั้งหมด
        //  */
        // getStatuses: async (): Promise<EquipmentStatus[]> => {
        //     const res = await fetch(`${API_URL}/equipment/statuses`);
        //
        //     if (res.status === 204) {
        //         return [];
        //     } else if (!res.ok) {
        //         throw new Error('Failed to fetch statuses');
        //     } else {
        //         return res.json();
        //     }
        // },

        // /**
        //  *  ดึง EquipmentType ทั้งหมด
        //  */
        // getTypes: async (): Promise<EquipmentType[]> => {
        //     const res = await fetch(`${API_URL}/equipment/types`);
        //
        //     if (res.status === 204) {
        //         return [];
        //     } else if (!res.ok) {
        //         throw new Error('Failed to fetch types');
        //     } else {
        //         return res.json();
        //     }
        // },

        // /**
        //  *  ดึง Lot ทั้งหมด
        //  */
        // getLots: async (): Promise<Lot[]> => {
        //     const res = await fetch(`${API_URL}/equipment/lots`);
        //
        //     if (res.status === 204) {
        //         return [];
        //     } else if (!res.ok) {
        //         throw new Error('Failed to fetch lots');
        //     } else {
        //         return res.json();
        //     }
        // },
    },
    // =============================
    // LOT API
    // =============================
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


        /**
         *  สร้าง Lot พร้อมอุปกรณ์
         */
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

        /**
         *  ดึงประเภท Lot
         */
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

        /**
         *  อัปเดต Lot
         */
        update: async (id: number, data: Partial<LotCreateData>): Promise<Lot> => {
            const res = await fetch(`${API_URL}/lots/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to update lot');
            } else {
                return res.json();
            }
        },

        /**
         *  ลบ Lot
         */
        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/lots/${id}`, { method: 'DELETE' });

            if (!res.ok) {
                throw new Error('Failed to delete lot');
            } else {
                return;
            }
        },
    },

    // =============================
    // BORROW API
    // =============================
    borrow: {
        /**
         *  ดึงรายการยืมทั้งหมด
         */
        getAll: async (): Promise<BorrowView[]> => {
            const res = await fetch(`${API_URL}/borrow/all`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch borrows');
            } else {
                return res.json();
            }
        },

        /**
         *  ค้นหาด้วย keyword
         */
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

        /**
         *  กรองตามสถานะ
         */
        getByStatus: async (statusId: number): Promise<BorrowView[]> => {
            const res = await fetch(`${API_URL}/borrow/filter/Status/${statusId}`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to filter borrows by status');
            } else {
                return res.json();
            }
        },

        /**
         *  กรองหลายเงื่อนไขพร้อมกัน
         */
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

        /**
         *  คืนอุปกรณ์ทีละชิ้น
         */
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

        /**
         *  ดึงรายการยืมตาม ID
         */
        getById: async (id: number): Promise<BorrowView> => {
            const res = await fetch(`${API_URL}/borrow/${id}`);

            if (!res.ok) {
                throw new Error('Failed to fetch borrow');
            } else {
                return res.json();
            }
        },

        /**
         *  สร้างรายการยืมใหม่
         */
        create: async (data: BorrowCreateData): Promise<BorrowCreateResponse> => {
            const res = await fetch(`${API_URL}/borrow/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create borrow');
            } else {
                return res.json();
            }
        },

        /**
         *  อัปเดตรายการยืม
         */
        update: async (id: number, data: Partial<BorrowCreateData>): Promise<Borrow> => {
            const res = await fetch(`${API_URL}/borrow/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Failed to update borrow');
            } else {
                return res.json();
            }
        },

        /**
         *  ลบรายการยืม
         */
        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/borrow/${id}`, { method: 'DELETE' });

            if (!res.ok) {
                throw new Error('Failed to delete borrow');
            } else {
                return;
            }
        },

        /**
         *  คืนอุปกรณ์ (หลายรายการ)
         */
        returnEquipment: async (
            borrowId: number,
            items: ReturnItemData[]
        ): Promise<ApiResponse<ReturnResponseData>> => {
            const res = await fetch(`${API_URL}/borrow/${borrowId}/return`, {
                method: 'POST',  // ✅ ใช้ POST เพราะเรากำลัง "ส่งข้อมูล" ไปยัง backend
                headers: {'Content-Type': 'application/json'}, // ✅ บอกว่าเราส่งข้อมูลเป็น JSON
                body: JSON.stringify({items}),// ✅ แปลง object { items: [...] } เป็นข้อความ JSON ก่อนส่ง
            });

            if (!res.ok) {
                throw new Error('Failed to return equipment');
            } else {
                return res.json();
            }
        },


        /**
         *  ดึงรายการที่เกินกำหนด
         */
        getOverdue: async (): Promise<BorrowView[]> => {
            const res = await fetch(`${API_URL}/borrow/overdue`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch overdue items');
            } else {
                return res.json();
            }
        },

        /**
         *  ดึงรายการที่ยัง active (ยังไม่คืน)
         */
        getActive: async (): Promise<BorrowView[]> => {
            const res = await fetch(`${API_URL}/borrow/active`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch active borrows');
            } else {
                return res.json();
            }
        },

        /**
         *  ดึงอุปกรณ์ที่พร้อมให้ยืม
         */
        getAvailableEquipment: async (): Promise<EquipmentView[]> => {
            const res = await fetch(`${API_URL}/borrow/available-equipment`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch available equipment');
            } else {
                return res.json();
            }
        },

        /**
         *  ดึงสถานะการยืมทั้งหมด
         */
        getBorrowStatuses: async (): Promise<BorrowStatus[]> => {
            const res = await fetch(`${API_URL}/borrow/statuses`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch borrow statuses');
            } else {
                return res.json();
            }
        },
    },

    // =============================
    // EMPLOYEE API
    // =============================
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

        /**
         *  ดึงพนักงานตาม Department และ Role
         */
        getByDepartmentAndRole: async (departmentId: number, roleId: number): Promise<EmployeeView[]> => {
            const res = await fetch(`${API_URL}/employee/dep/${departmentId}/role/${roleId}`);

            if (res.status === 204) {
                return [];
            } else if (!res.ok) {
                throw new Error('Failed to fetch employees by department and role');
            } else {
                return res.json();
            }
        },

        /**
         *  สร้างพนักงานใหม่
         */
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
    },



    // =============================
    // CRUD Department
    // =============================

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

    // =============================
    // CRUD building
    // =============================

    building: {
        getAll: async (): Promise<Building[]> => {
            const res = await fetch(`${API_URL}/buildings/all`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch buildings');
            else return res.json();
        },

        getById: async (id: number): Promise<Building> => {
            const res = await fetch(`${API_URL}/buildings/${id}`);
            if (!res.ok) throw new Error('Failed to fetch building');
            else return res.json();
        },

        create: async (data: Partial<Building>): Promise<Building> => {
            const res = await fetch(`${API_URL}/buildings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create building');
            }
            else return res.json();
        },

        update: async (id: number, data: Partial<Building>): Promise<Building> => {
            const res = await fetch(`${API_URL}/buildings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to update building');
            }
            else return res.json();
        },

        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/buildings/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete building');
        },
    },

    // =============================
    // CRUD floor
    // =============================

    floor: {
        getAll: async (): Promise<Floor[]> => {
            const res = await fetch(`${API_URL}/floors/all`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch floors');
            else return res.json();
        },

        getById: async (id: number): Promise<Floor> => {
            const res = await fetch(`${API_URL}/floors/${id}`);
            if (!res.ok) throw new Error('Failed to fetch floor');
            else return res.json();
        },

        getByBuilding: async (buildingId: number): Promise<Floor[]> => {
            const res = await fetch(`${API_URL}/floors/building/${buildingId}`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch floors');
            else return res.json();
        },

        create: async (data: Partial<Floor>): Promise<Floor> => {
            const res = await fetch(`${API_URL}/floors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create floor');
            }
            else return res.json();
        },

        update: async (id: number, data: Partial<Floor>): Promise<Floor> => {
            const res = await fetch(`${API_URL}/floors/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to update floor');
            }
            else return res.json();
        },

        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/floors/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete floor');
        },
    },

    // =============================
    // CRUD room
    // =============================

    room: {
        getAll: async (): Promise<Room[]> => {
            const res = await fetch(`${API_URL}/rooms/all`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch rooms');
            else return res.json();
        },

        getById: async (id: number): Promise<Room> => {
            const res = await fetch(`${API_URL}/rooms/${id}`);
            if (!res.ok) throw new Error('Failed to fetch room');
            else return res.json();
        },

        getByFloor: async (floorId: number): Promise<Room[]> => {
            const res = await fetch(`${API_URL}/rooms/floor/${floorId}`);
            if (res.status === 204) return [];
            else if (!res.ok) throw new Error('Failed to fetch rooms');
            else return res.json();
        },

        create: async (data: Partial<Room>): Promise<Room> => {
            const res = await fetch(`${API_URL}/rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to create room');
            }
            else return res.json();
        },

        update: async (id: number, data: Partial<Room>): Promise<Room> => {
            const res = await fetch(`${API_URL}/rooms/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(errorData.message || 'Failed to update room');
            }
            else return res.json();
        },

        delete: async (id: number): Promise<void> => {
            const res = await fetch(`${API_URL}/rooms/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete room');
        },
    },
};



// =============================
// HELPER FUNCTIONS
// =============================

/**
 * ✅ Handle API Error — แปลง error ให้เป็นข้อความอ่านง่าย
 */
export const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    } else {
        return 'An unknown error occurred';
    }
};

/**
 * ✅ Build Query String — แปลง object เป็น query string
 * เช่น { status: 'active', page: 2 } → 'status=active&page=2'
 */
export const buildQueryString = (params: Record<string, string | number | boolean>): string => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, String(value));
        }
    });

    return query.toString();
};