import { useState } from 'react';
import { EquipmentView } from '@/types/type';
import { equipment } from '@/lib/api/equipment/equipment';
import { useMasterData } from '@/hooks/useMasterData';

interface FilterParams {
    typeId?: number;
    statusId?: number;
    keyword?: string;
}

export function useEquipment() {
    const [equipments, setEquipments] = useState<EquipmentView[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentView | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorDetail, setErrorDetail] = useState<string | null>(null);

    // ✅ ใช้ master data (ดึง dropdown จาก hook กลาง)
    const { statuses, equipmentTypes: types } = useMasterData();

    // ✅ ดึงข้อมูลอุปกรณ์ทั้งหมด
    const fetchEquipments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await equipment.equipment.getAll();
            setEquipments(data);
        } catch {
            setError('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
        } finally {
            setLoading(false);
        }
    };

    // ✅ ใช้ filterMultiple จาก backend
    const applyFilters = async (filters: FilterParams) => {
        setLoading(true);
        setError(null);
        try {
            const data = await equipment.equipment.filterMultiple(filters);
            setEquipments(data);
        } catch {
            setError('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
        } finally {
            setLoading(false);
        }
    };

    // ✅  ฟังก์ชันค้นหาอุปกรณ์
    const searchEquipment = async (keyword: string) => {
        if (!keyword.trim()) {
            // ถ้าไม่ใส่ keyword ให้โหลดทั้งหมดแทน
            await fetchEquipments();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/search?keyword=${encodeURIComponent(keyword)}`);
            if (!res.ok) throw new Error('ไม่สามารถค้นหาได้');
            const data = await res.json();
            setEquipments(data);
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการค้นหา');
        } finally {
            setLoading(false);
        }
    };

    // ✅ ดึงรายละเอียดอุปกรณ์แต่ละชิ้น
    const fetchEquipmentDetail = async (id: number, showModalOnOpen = false) => {
        if (showModalOnOpen) setShowModal(true);
        setLoadingDetail(true);
        setErrorDetail(null);
        try {
            const data = await equipment.equipment.getById(id);
            setSelectedEquipment(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorDetail(`เกิดข้อผิดพลาด: ${err.message}`);
            } else {
                setErrorDetail('ไม่สามารถดึงรายละเอียดอุปกรณ์ได้');
            }
        } finally {
            setLoadingDetail(false);
        }
    };

    // ✅ ลบอุปกรณ์
    const deleteEquipment = async (id: number) => {
        const confirmDelete = window.confirm('ต้องการลบอุปกรณ์นี้หรือไม่?');
        if (!confirmDelete) return false;
        try {
            await equipment.equipment.delete(id);
            alert('ลบอุปกรณ์สำเร็จ');
            await fetchEquipments();
            return true;
        } catch (err: any) {
            alert(err.message || 'เกิดข้อผิดพลาดในการลบอุปกรณ์');
            return false;
        }
    };

    const openDetailModal = (id: number) => fetchEquipmentDetail(id, true);
    const retryFetchDetail = (id: number) => fetchEquipmentDetail(id);
    const closeDetailModal = () => {
        setShowModal(false);
        setSelectedEquipment(null);
        setErrorDetail(null);
    };

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
        searchEquipment,
        fetchEquipments,
        applyFilters,
        openDetailModal,
        closeDetailModal,
        retryFetchDetail,
        deleteEquipment,
    };
}
