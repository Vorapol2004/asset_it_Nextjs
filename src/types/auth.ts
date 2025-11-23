// ไฟล์นี้กำหนด Types ทั้งหมดที่เกี่ยวกับ Authentication
// ใช้เพื่อให้ TypeScript ตรวจสอบ type ของข้อมูลได้

// Role types - ใช้ backend format โดยตรง
export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER';

// ข้อมูล User ที่เก็บใน Database
export interface User {
    id: number;
    email: string;            // Email สำหรับ login
    password: string;        // Password ที่ Hash แล้ว
    role: UserRole;          // Role ของ user (ROLE_ADMIN หรือ ROLE_USER)
}

// ข้อมูลที่ใช้สำหรับ Login
export interface LoginInput {
    email: string;           // Email สำหรับ login
    password: string;        // Password ที่ user กรอก
}

// Response ที่ส่งกลับจาก API
// หมายเหตุ: user.role จาก backend จะเป็น 'ROLE_ADMIN' หรือ 'ROLE_USER' โดยตรง
export interface AuthResponse {
    success: boolean;        // สำเร็จหรือไม่
    message: string;         // ข้อความแจ้ง
    token?: string;          // JWT Token (ถ้า login สำเร็จ)
    user?: {
        id: number;
        email: string;
        role: string;        // อาจจะเป็น 'ROLE_ADMIN' หรือ 'ROLE_USER'
        createdAt?: Date | null;
    };
}

// ข้อมูลที่เก็บใน JWT Token
export interface JWTPayload {
    userId: number;          // ID ของ User
    email: string;           // Email ของ User
    role: UserRole;          // Role ของ User
}

//กำหนด structure ของข้อมูลทั้งหมด
// ช่วยให้ TypeScript ตรวจสอบ type ได้
// ทำให้โค้ดปลอดภัยและอ่านง่ายขึ้น