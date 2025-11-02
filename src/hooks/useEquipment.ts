import { useState } from 'react';
import { EquipmentView } from '@/types/type';
import { equipment } from '@/lib/api/equipment/equipment';
import { useEquipmentDropDown } from '@/hooks/useEquipmentDropDown';

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

    // ✅ ใช้ dropdown data สำหรับ equipment
    const { statuses, equipmentTypes: types } = useEquipmentDropDown();

    // ✅ ดึงข้อมูลอุปกรณ์ทั้งหมด
    const fetchEquipments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await equipment.getAll();
            setEquipments(data);
        } catch {
            setError('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
        } finally {
            setLoading(false);
        }
    };

    /**
     * กรองอุปกรณ์ตาม type และ status
     * Note: ถ้าต้องการค้นหา keyword ต้องเรียก searchEquipment() แยก
     */
    const applyFilters = async (filters: FilterParams) => {
        setLoading(true);
        setError(null);
        try {
            // ถ้ามี keyword → เรียก search
            if (filters.keyword && filters.keyword.trim()) {
                const data = await equipment.search(filters.keyword);
                setEquipments(data);
            }
            // ถ้ามี type หรือ status → เรียก filter
            else if (filters.typeId || filters.statusId) {
                const data = await equipment.filter({
                    typeId: filters.typeId,
                    statusId: filters.statusId,
                });
                setEquipments(data);
            }
            // ไม่มี filter → เรียกทั้งหมด
            else {
                await fetchEquipments();
            }
        } catch {
            setError('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
        } finally {
            setLoading(false);
        }
    };

    /**
     * ค้นหาอุปกรณ์ด้วย keyword (เรียก API ตรงๆ)
     */
    const searchEquipment = async (keyword: string) => {
        if (!keyword.trim()) {
            await fetchEquipments();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await equipment.search(keyword);
            setEquipments(data);
        } catch {
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
            const data = await equipment.getById(id);
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
            await equipment.delete(id);
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
