import { useState, useEffect } from 'react';
import { EquipmentView } from '@/types/type';
import { equipment } from '@/lib/api/equipment/equipment';
import { API_URL } from '@/lib/config';

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
    
    // State สำหรับ Edit Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<EquipmentView | null>(null);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [errorEdit, setErrorEdit] = useState<string | null>(null);

    // ✅ Dropdown data สำหรับ equipment
    const [statuses, setStatuses] = useState<{ id: number; equipmentStatusName: string }[]>([]);
    const [equipmentTypes, setEquipmentTypes] = useState<{ id: number; equipmentTypeName: string }[]>([]);

    // ดึงข้อมูล dropdown เมื่อ โหลดหน้าอุปกรณ์ 
    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                // ดึง Equipment Types
                const typesRes = await fetch(`${API_URL}/equipment_type/type`);
                const typesData = await typesRes.json();
                if (Array.isArray(typesData)) {
                    setEquipmentTypes(typesData);
                } else {
                    setEquipmentTypes([]);
                }

                // ดึง Equipment Statuses
                const statusesRes = await fetch(`${API_URL}/equipment_status/status`);
                const statusesData = await statusesRes.json();
                if (Array.isArray(statusesData)) {
                    setStatuses(statusesData);
                } else {
                    setStatuses([]);
                }
            } catch (err) {
                console.error('Error loading dropdown data:', err);
                setEquipmentTypes([]);
                setStatuses([]);
            }
        };

        loadDropdownData();
    }, []);

    // ✅ เรียงลำดับอุปกรณ์ให้ล่าสุดอยู่ข้างบนสุด
    const sortEquipmentsByNewest = (data: EquipmentView[]): EquipmentView[] => {
        return [...data].sort((a, b) => {
            // ใช้ createdAt ถ้ามี
            if (a.createdAt && b.createdAt) {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // ใหม่ → เก่า โดยจะทำการจับคู่ข้อมูลทีละ 2 ตัว” มาเปรียบเทียบซ้ำ ๆ ไปเรื่อย ๆ
            }
            return b.id - a.id;
        });
    };

    // ✅ ดึงข้อมูลอุปกรณ์ทั้งหมด
    const fetchEquipments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await equipment.getAll();
            const sortedData = sortEquipmentsByNewest(data);
            setEquipments(sortedData);
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
                const sortedData = sortEquipmentsByNewest(data);
                setEquipments(sortedData);
            }
            // ถ้ามี type หรือ status → เรียก filter
            else if (filters.typeId || filters.statusId) {
                const data = await equipment.filter({
                    typeId: filters.typeId,
                    statusId: filters.statusId,
                });
                const sortedData = sortEquipmentsByNewest(data);
                setEquipments(sortedData);
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
            const sortedData = sortEquipmentsByNewest(data);
            setEquipments(sortedData);
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
    const deleteEquipment = async (id: number): Promise<void> => {
        const confirmDelete = window.confirm('ต้องการลบอุปกรณ์นี้หรือไม่?');
        if (!confirmDelete) return;
        try {
            await equipment.delete(id);
            alert('ลบอุปกรณ์สำเร็จ');
            await fetchEquipments();
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(`ไม่สามารถลบอุปกรณ์ได้: ${err.message}`);
            } else {
                alert('ไม่สามารถลบอุปกรณ์ได้');
            }
            throw err;
        }
    };

    const openDetailModal = (id: number) => fetchEquipmentDetail(id, true);
    const retryFetchDetail = (id: number) => fetchEquipmentDetail(id);
    const closeDetailModal = () => {
        setShowModal(false);
        setSelectedEquipment(null);
        setErrorDetail(null);
    };

    // ✅ เปิด Edit Modal
    const openEditModal = async (id: number) => {
        setShowEditModal(true);
        setLoadingEdit(true);
        setErrorEdit(null);
        try {
            const data = await equipment.getById(id);
            setEditingEquipment(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorEdit(`เกิดข้อผิดพลาด: ${err.message}`);
            } else {
                setErrorEdit('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
            }
        } finally {
            setLoadingEdit(false);
        }
    };

    // ✅ ปิด Edit Modal
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingEquipment(null);
        setErrorEdit(null);
    };

    // ✅ อัปเดตอุปกรณ์
    const updateEquipment = async (id: number, data: Partial<EquipmentView>) => {
        setLoadingEdit(true);
        setErrorEdit(null);
        try {
            await equipment.update(id, data);
            await fetchEquipments(); // Refresh ข้อมูล
            closeEditModal();
            alert('อัปเดตอุปกรณ์สำเร็จ!');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorEdit(`เกิดข้อผิดพลาด: ${err.message}`);
            } else {
                setErrorEdit('ไม่สามารถอัปเดตอุปกรณ์ได้');
            }
            throw err;
        } finally {
            setLoadingEdit(false);
        }
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
        types: equipmentTypes,
        searchEquipment,
        fetchEquipments,
        applyFilters,
        openDetailModal,
        closeDetailModal,
        retryFetchDetail,
        deleteEquipment,
        // Edit Modal
        showEditModal,
        editingEquipment,
        loadingEdit,
        errorEdit,
        openEditModal,
        closeEditModal,
        updateEquipment,
    };
}
