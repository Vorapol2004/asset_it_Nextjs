import { useEffect, useState } from 'react';
import { EquipmentView } from '@/types/type';
import { equipment_api } from '@/lib/equipment_api';

// ==================== Types ====================
interface EquipmentStatus {
    id: number; equipmentStatusName: string;
}
interface EquipmentType {
    id: number; equipmentTypeName: string;
}
interface FilterParams {
    typeId?: number;
    statusId?: number;
    keyword?: string;
}

// ==================== Hook ====================
export function useEquipment() {
    const [equipments, setEquipments] = useState<EquipmentView[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentView | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorDetail, setErrorDetail] = useState<string | null>(null);
    const [statuses, setStatuses] = useState<EquipmentStatus[]>([]);
    const [types, setTypes] = useState<EquipmentType[]>([]);

    // ==================== Fetch Master ====================
    const fetchDropDownData = async () => {
        try {
            const [statusRes, typeRes] = await Promise.all([
                fetch('http://localhost:8080/public/e_status'),
                fetch('http://localhost:8080/public/e_type'),
            ]);
            const [statusesData, typesData] = await Promise.all([
                statusRes.json(),
                typeRes.json(),
            ]);
            setStatuses(statusesData);
            setTypes(typesData);
        } catch (err) {
            console.error('Error fetching equipment data:', err);
        }
    };
    useEffect(() => {
        fetchDropDownData();
    }, []);

    // ==================== Functions ====================
    const fetchEquipments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await equipment_api.equipment.getAll();
            setEquipments(data);
        } catch {
            setError('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = async (filters: FilterParams) => {
        setLoading(true);
        setError(null);
        try {
            let data: EquipmentView[] = [];
            if (filters.keyword) {
                data = await equipment_api.equipment.search(filters.keyword);
            } else if (filters.typeId || filters.statusId) {
                data = await equipment_api.equipment.filterMultiple({
                    typeId: filters.typeId,
                    statusId: filters.statusId,
                });
            } else {
                data = await equipment_api.equipment.getAll();
            }
            setEquipments(data);
        } catch {
            setError('ไม่สามารถกรองข้อมูลได้');
        } finally {
            setLoading(false);
        }
    };

    const fetchEquipmentDetail = async (id: number, showModalOnOpen = false) => {
        if (showModalOnOpen) setShowModal(true);
        setLoadingDetail(true);
        setErrorDetail(null);

        try {
            const data = await equipment_api.equipment.getById(id);
            setSelectedEquipment(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Fetch error:", err.message);
                setErrorDetail(`เกิดข้อผิดพลาด: ${err.message}`);
            } else {
                console.error("Unknown error:", err);
                setErrorDetail('ไม่สามารถดึงรายละเอียดอุปกรณ์ได้');
            }
        } finally {
            setLoadingDetail(false);
        }
    };

    const openDetailModal = (id: number) => fetchEquipmentDetail(id, true);
    const retryFetchDetail = (id: number) => fetchEquipmentDetail(id);
    const closeDetailModal = () => {
        setShowModal(false);
        setSelectedEquipment(null);
        setErrorDetail(null);
    };

    // ==================== Return ====================
    return {
        equipments,
        loading,
        error,
        showModal,
        selectedEquipment,
        loadingDetail,
        errorDetail,
        statuses,
        types,
        fetchEquipments,
        applyFilters,
        openDetailModal,
        closeDetailModal,
        retryFetchDetail,
    };
}
