'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { EquipmentView } from '@/types/type';

/**
 * ✅ Hook: useEquipment() - เชื่อมกับ Backend API
 */
export function useEquipment() {
    const [equipments, setEquipments] = useState<EquipmentView[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentView | null>(null);

    /**
     * ✅ โหลดข้อมูลทั้งหมด
     */
    const fetchEquipments = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await api.equipment.getAll();
            setEquipments(data);


        } catch (err) {
            console.error('❌ โหลดอุปกรณ์ล้มเหลว:', err);
            setError('ไม่สามารถโหลดข้อมูลอุปกรณ์ได้ กรุณาลองใหม่อีกครั้ง');
            setEquipments([]); // ✅ Clear ข้อมูลเดิม
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ ฟังก์ชันหลักสำหรับ Filter แบบ Multiple Conditions
     */
    const applyFilters = async (params: {
        typeId?: number;
        statusId?: number;
        keyword?: string;
    }) => {
        setLoading(true);
        setError(null); // ✅ Clear error ก่อนกรอง

        try {
            const data = await api.equipment.filterMultiple({
                typeId: params.typeId,
                statusId: params.statusId,
                keyword: params.keyword?.trim() || undefined,
            });

            setEquipments(data);

        } catch (err) {
            console.error('❌ กรองข้อมูลล้มเหลว:', err);
            setError('ไม่สามารถกรองข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
            setEquipments([]); // ✅ Clear ข้อมูลเดิม
        } finally {
            setLoading(false);
        }
    };

    const fetchEquipmentById = async (id: number) => {
        setLoading(true);
        setError(null);

        try {
            const data = await api.equipment.getById(id);
            setSelectedEquipment(data);
            return data;
        } catch (err) {
            console.error('❌ ดึงรายละเอียดล้มเหลว:', err);
            setError('ไม่สามารถดึงรายละเอียดอุปกรณ์ได้');
            return null;
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ โหลดข้อมูลครั้งแรก (เมื่อ component mount)
     * แต่จะไม่โหลดอีกถ้า EquipmentPage เรียก handleApplyFilters() ใน useEffect แล้ว
     */
    // useEffect(() => {
    //     fetchEquipments();
    // }, []);

    return {
        equipments,
        selectedEquipment,
        fetchEquipmentById,
        fetchEquipments,
        applyFilters,
        loading,
        error,
    };
}