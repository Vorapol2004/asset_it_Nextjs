import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/config';

export function useMasterData() {
    const [lotTypes, setLotTypes] = useState<{ id: number; lotTypeName: string }[]>([]);
    const [equipmentTypes, setEquipmentTypes] = useState<{ id: number; equipmentTypeName: string }[]>([]);
    const [statuses, setStatuses] = useState<{ id: number; equipmentStatusName: string }[]>([]);

    const fetchLotTypes = async () => {
        try {
            const res = await fetch(`${API_URL}/equipment/lotType/dropDown`);
            const data = await res.json();
            if (Array.isArray(data)) setLotTypes(data);
            else setLotTypes([]); // ป้องกัน error
        } catch {
            setLotTypes([]);
        }
    };

    const fetchEquipmentTypes = async () => {
        try {
            const res = await fetch(`${API_URL}/equipment/equipmentType/dropDown`);
            const data = await res.json();
            if (Array.isArray(data)) setEquipmentTypes(data);
            else setEquipmentTypes([]); // ป้องกัน error ตอน 500
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
        fetchLotTypes();
        fetchEquipmentTypes();
        fetchStatuses();
    }, []);

    return { lotTypes, equipmentTypes, statuses };
}
