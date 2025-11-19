import { API_URL } from '@/lib/config';
import { tokenServices } from './tokenServices';

/**
 * API Client - ตัวจัดการการเรียก API
 * 
 * หน้าที่:
 * - เพิ่ม Authorization header อัตโนมัติ
 * - จัดการ error handling
 * - ตรวจสอบ token และลบออกถ้า expired
 */

interface RequestOptions extends RequestInit {
    requireAuth?: boolean; // กำหนดว่าต้องการ token หรือไม่
}

/**
 * ฟังก์ชันสำหรับเรียก API พร้อมจัดการ token อัตโนมัติ
 */
export async function apiClient(
    endpoint: string,
    options: RequestOptions = {}
): Promise<Response> {
    const { requireAuth = true, headers = {}, body, ...fetchOptions } = options;

    // สร้าง headers
    const requestHeaders: Record<string, string> = {
        ...(headers as Record<string, string>),
    };

    // เพิ่ม Content-Type เฉพาะเมื่อมี body (POST, PUT, PATCH)
    // และยังไม่ได้กำหนด Content-Type ใน headers แล้ว
    if (body && !requestHeaders['Content-Type'] && !requestHeaders['content-type']) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    // เพิ่ม Authorization header ถ้าต้องการ auth
    if (requireAuth) {
        const token = tokenServices.getToken();
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    // เรียก API
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...fetchOptions,
            body,
            headers: requestHeaders,
        });

        // ถ้า token หมดอายุ (401) ให้ลบ token ออก
        if (response.status === 401 && requireAuth) {
            tokenServices.removeToken();
            // Redirect ไปหน้า login (ถ้าต้องการ)
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        return response;
    } catch (error) {
        // จัดการ network errors (Failed to fetch)
        console.error('API Request failed:', {
            url: `${API_URL}${endpoint}`,
            error: error instanceof Error ? error.message : 'Unknown error',
            apiUrl: API_URL,
        });
        
        // Throw error ที่มีข้อมูลมากขึ้น
        throw new Error(
            `Failed to connect to API server. Please check if the backend is running at ${API_URL}`
        );
    }
}

