import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/config';

/**
 * Hook สำหรับดึง dropdown data ที่ใช้ในหน้า equipment
 * - Equipment Statuses
 * - Equipment Types
 */
export function useEquipmentDropDown() {
    const [equipmentTypes, setEquipmentTypes] = useState<{ id: number; equipmentTypeName: string }[]>([]);
    const [statuses, setStatuses] = useState<{ id: number; equipmentStatusName: string }[]>([]);

    const fetchEquipmentTypes = async () => {
        try {
            const res = await fetch(`${API_URL}/equipment/equipmentType/dropDown`);
            const data = await res.json();
            if (Array.isArray(data)) setEquipmentTypes(data);
            else setEquipmentTypes([]);
        } catch {
            setEquipmentTypes([]);
        }
    };

    const fetchStatuses = async () => {
        try {
            const res = await fetch(`${API_URL}/equipment/equipmentStatus/dropDown`);
            const data = await res.json();
            if (Array.isArray(data)) setStatuses(data);
            else setStatuses([]);
        } catch {
            setStatuses([]);
        }
    };

    useEffect(() => {
        fetchEquipmentTypes();
        fetchStatuses();
    }, []);

    return { equipmentTypes, statuses };
}

