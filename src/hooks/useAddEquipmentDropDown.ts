import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/config';
import { api } from '@/lib/api';

/**
 * Hook สำหรับดึง dropdown data ที่ใช้ในหน้า add_equipment
 * - Lot Types
 * - Equipment Types
 */
export function useAddEquipmentDropDown() {
    const [lotTypes, setLotTypes] = useState<{ id: number; lotTypeName: string }[]>([]);
    const [equipmentTypes, setEquipmentTypes] = useState<{ id: number; equipmentTypeName: string }[]>([]);

    const fetchLotTypes = async () => {
        try {
            const data = await api.lot.getTypes();
            if (Array.isArray(data)) setLotTypes(data);
            else setLotTypes([]);
        } catch {
            setLotTypes([]);
        }
    };

    const fetchEquipmentTypes = async () => {
        try {
            const res = await fetch(`${API_URL}/equipment_type/type`);
            const data = await res.json();
            if (Array.isArray(data)) setEquipmentTypes(data);
            else setEquipmentTypes([]);
        } catch {
            setEquipmentTypes([]);
        }
    };

    useEffect(() => {
        fetchLotTypes();
        fetchEquipmentTypes();
    }, []);

    return { lotTypes, equipmentTypes };
}

