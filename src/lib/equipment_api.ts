import {EquipmentView} from "@/types/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL|| 'http://localhost:8080';
export const equipment_api = {

    equipment: {

        //ดึงอุปกรณ์ทั้งหมด
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

        //เลือกดูอุปกรณ์ทีละตัว
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
    }
}