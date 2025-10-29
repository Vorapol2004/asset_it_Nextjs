'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { EquipmentView } from '@/types/type';

/**
 * ✅ Hook: useEquipment() - เชื่อมกับ Backend API
 */
export function useEquipment() {
    const [equipments, setEquipments] = useState<EquipmentView[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ โหลดข้อมูลทั้งหมด
    const fetchEquipments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.equipment.getAll();
            setEquipments(data);
        } catch (err) {
            console.error('❌ โหลดอุปกรณ์ล้มเหลว:', err);
            setError('ไม่สามารถโหลดข้อมูลอุปกรณ์ได้');
        } finally {
            setLoading(false);
        }
    };

    // ✅ ฟังก์ชันหลักสำหรับ Filter แบบ Multiple Conditions
    const applyFilters = async (params: {
        typeId?: number;
        statusId?: number;
        keyword?: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.equipment.filterMultiple({
                typeId: params.typeId,
                statusId: params.statusId,
                keyword: params.keyword?.trim() || undefined,
            });

            setEquipments(data);

            if (data.length === 0) {
                setError('ไม่พบอุปกรณ์ที่ตรงกับเงื่อนไขที่เลือก');
            }
        } catch (err) {
            console.error('❌ กรองข้อมูลล้มเหลว:', err);
            setError('ไม่สามารถกรองข้อมูลได้');
            setEquipments([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ โหลดข้อมูลครั้งแรก
    useEffect(() => {
        fetchEquipments();
    }, []);

    return {
        equipments,
        fetchEquipments,
        applyFilters,
        loading,
        error,
    };
}