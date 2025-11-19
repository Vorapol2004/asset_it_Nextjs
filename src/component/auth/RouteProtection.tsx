'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { ROUTES } from '@/constants/routes';

interface RouteProtectionProps {
    children: React.ReactNode;
    /**
     * กำหนด role ที่อนุญาตให้เข้าถึง
     * - 'authenticated': ต้อง login (ROLE_ADMIN หรือ ROLE_USER)
     * - 'ROLE_ADMIN': ต้องเป็น ROLE_ADMIN เท่านั้น
     * - 'ROLE_USER': ต้องเป็น ROLE_USER เท่านั้น
     */
    allowedRoles?: 'authenticated' | 'ROLE_ADMIN' | 'ROLE_USER';
    /**
     * หน้า redirect เมื่อไม่มีสิทธิ์เข้าถึง
     * Default: ROUTES.LOGIN (ถ้ายังไม่ login) หรือ ROUTES.HOME (ถ้า login แล้วแต่ไม่มีสิทธิ์)
     */
    redirectTo?: string;
}

/**
 * Route Protection Component
 * 
 * ใช้สำหรับป้องกันการเข้าถึงหน้าโดยตรวจสอบ authentication และ role
 * 
 * @example
 * // ต้อง login เท่านั้น
 * <RouteProtection allowedRoles="authenticated">
 *   <YourPage />
 * </RouteProtection>
 * 
 * @example
 * // ต้องเป็น ROLE_ADMIN เท่านั้น
 * <RouteProtection allowedRoles="ROLE_ADMIN">
 *   <AdminPage />
 * </RouteProtection>
 */
export default function RouteProtection({
    children,
    allowedRoles = 'authenticated',
    redirectTo,
}: RouteProtectionProps) {
    const router = useRouter();
    const { user, loading, isAdmin, isAuthenticated } = useAuthContext();

    useEffect(() => {
        // รอให้ auth context โหลดเสร็จก่อน
        if (loading) {
            return;
        }

        // ตรวจสอบ authentication
        if (!isAuthenticated || !user) {
            // ถ้ายังไม่ login → redirect ไปหน้า login
            router.push(redirectTo || ROUTES.LOGIN);
            return;
        }

        // ตรวจสอบ role
        if (allowedRoles === 'ROLE_ADMIN') {
            if (!isAdmin || user.role !== 'ROLE_ADMIN') {
                // ถ้าไม่ใช่ ROLE_ADMIN → redirect ไปหน้า home
                router.push(redirectTo || ROUTES.HOME);
                return;
            }
        } else if (allowedRoles === 'ROLE_USER') {
            if (user.role !== 'ROLE_USER') {
                // ถ้าไม่ใช่ ROLE_USER → redirect ไปหน้า home
                router.push(redirectTo || ROUTES.HOME);
                return;
            }
        }
        // allowedRoles === 'authenticated' → อนุญาตทั้ง ROLE_ADMIN และ ROLE_USER
    }, [loading, isAuthenticated, user, isAdmin, allowedRoles, redirectTo, router]);

    // แสดง loading state ขณะตรวจสอบ
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
                </div>
            </div>
        );
    }

    // ถ้ายังไม่ authenticated หรือไม่มีสิทธิ์ → ไม่แสดง children (จะ redirect)
    if (!isAuthenticated || !user) {
        return null;
    }

    // ตรวจสอบ role อีกครั้งก่อนแสดง children
    if (allowedRoles === 'ROLE_ADMIN' && (!isAdmin || user.role !== 'ROLE_ADMIN')) {
        return null;
    }

    if (allowedRoles === 'ROLE_USER' && user.role !== 'ROLE_USER') {
        return null;
    }

    // แสดง children เมื่อผ่านการตรวจสอบแล้ว
    return <>{children}</>;
}

