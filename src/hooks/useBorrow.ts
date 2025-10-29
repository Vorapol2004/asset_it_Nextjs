'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BorrowView, BorrowFilters } from '@/types/type';

/**
 * ✅ Hook: useBorrow() - เชื่อมกับ Backend API
 */
export function useBorrow(initialFilters?: BorrowFilters) {
    const [records, setRecords] = useState<BorrowView[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<BorrowFilters>(initialFilters || {});

    // ✅ โหลดประวัติการยืมทั้งหมด
    const fetchBorrowHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.borrow.getAll();
            setRecords(data);
        } catch (err) {
            console.error('❌ โหลดประวัติการยืมล้มเหลว:', err);
            setError('ไม่สามารถโหลดข้อมูลประวัติการยืมได้');
        } finally {
            setLoading(false);
        }
    };

    // ✅ ค้นหาด้วย keyword (เรียก API)
    const searchBorrow = async (keyword: string) => {
        if (!keyword.trim()) {
            fetchBorrowHistory();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await api.borrow.search(keyword);
            setRecords(data);
        } catch (err) {
            console.error('❌ ค้นหาการยืมล้มเหลว:', err);
            setError('ไม่สามารถค้นหาข้อมูลได้');
        } finally {
            setLoading(false);
        }
    };

    // ✅ กรองตามสถานะ (เรียก API)
    const filterByStatus = async (statusId: number | null) => {
        if (statusId === null) {
            fetchBorrowHistory();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await api.borrow.getByStatus(statusId);
            setRecords(data);
        } catch (err) {
            console.error('❌ กรองตามสถานะล้มเหลว:', err);
            setError('ไม่สามารถกรองตามสถานะได้');
        } finally {
            setLoading(false);
        }
    };

    // 🔥 กรองตาม Role (ทำในฝั่งหน้าบ้านเพราะ Backend ไม่มี endpoint นี้)
    const filterByRole = async (role: 'all' | 'พนักงาน' | 'อาจารย์' | 'ส่วนกลาง') => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.borrow.getAll();

            if (role === 'all') {
                setRecords(data);
            } else {
                const filtered = data.filter((record) => record.roleName === role);
                setRecords(filtered);
            }
        } catch (err) {
            console.error('❌ กรองตาม Role ล้มเหลว:', err);
            setError('ไม่สามารถกรองตาม Role ได้');
        } finally {
            setLoading(false);
        }
    };

    // 🔥 กรองตามประเภทอุปกรณ์ (ทำในฝั่งหน้าบ้านเพราะ Backend ไม่มี endpoint นี้)
    const filterByType = async (type: 'all' | 'hardware' | 'software') => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.borrow.getAll();

            if (type === 'all') {
                setRecords(data);
            } else {
                const filtered = data.filter((record) =>
                    record.equipmentTypeName?.toLowerCase() === type
                );
                setRecords(filtered);
            }
        } catch (err) {
            console.error('❌ กรองตามประเภทล้มเหลว:', err);
            setError('ไม่สามารถกรองตามประเภทได้');
        } finally {
            setLoading(false);
        }
    };

    // ✅ คืนอุปกรณ์ทีละชิ้น (ใช้ equipmentId)
    const returnEquipmentItem = async (equipmentId: number) => {
        try {
            await api.borrow.returnSingle(equipmentId);

            // โหลดข้อมูลใหม่หลังคืนอุปกรณ์
            await fetchBorrowHistory();

            alert('คืนอุปกรณ์สำเร็จ! ✅');
        } catch (err) {
            console.error('❌ คืนอุปกรณ์ล้มเหลว:', err);
            alert('ไม่สามารถคืนอุปกรณ์ได้ กรุณาลองใหม่อีกครั้ง');
        }
    };

    // ✅ โหลดข้อมูลตอนเปิดหน้า
    useEffect(() => {
        fetchBorrowHistory();
    }, []);

    return {
        records,
        filters,
        setFilters,
        fetchBorrowHistory,
        searchBorrow,
        filterByStatus,
        filterByRole,
        filterByType,
        returnEquipmentItem,
        loading,
        error,
    };
}