import { useState, useEffect } from 'react';
import { EquipmentView, Department } from '@/types/type';
import { equipment } from '@/lib/api/equipment/equipment';
import { api } from '@/lib/api';

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

    // Dropdown data สำหรับ equipment
    const [statuses, setStatuses] = useState<{ id: number; equipmentStatusName: string }[]>([]);
    const [equipmentTypes, setEquipmentTypes] = useState<{ id: number; equipmentTypeName: string }[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const [typesData, statusesData, departmentsData] = await Promise.all([
                    equipment.getTypes(),
                    equipment.getStatuses(),
                    api.department.getAll(),
                ]);
                setEquipmentTypes(typesData);
                setStatuses(statusesData);
                setDepartments(departmentsData);
            } catch (err) {
                console.error('Error loading dropdown data:', err);
                setEquipmentTypes([]);
                setStatuses([]);
                setDepartments([]);
            }
        };

        loadDropdownData();
    }, []);

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


    const applyFilters = async (filters: FilterParams) => {
        setLoading(true);
        setError(null);
        try {
            // ใช้ filter เดียวสำหรับทุกกรณี (รองรับ keyword, typeId, statusId)
            // ถ้ามี filters ใดๆ → เรียก filter
            if (filters.keyword || filters.typeId || filters.statusId) {
                const data = await equipment.filter({
                    keyword: filters.keyword,
                    equipmentTypeId: filters.typeId,
                    equipmentStatusId: filters.statusId,
                });
                setEquipments(data);
            }
            // ถ้าไม่มี filters → เรียก getAll
            else {
                await fetchEquipments();
            }
        } catch {
            setError('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
        } finally {
            setLoading(false);
        }
    };


    const searchEquipment = async (keyword: string) => {
        // ใช้ applyFilters แทน (จะเรียก filter อัตโนมัติ)
        await applyFilters({ keyword: keyword.trim() || undefined });
    };

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

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingEquipment(null);
        setErrorEdit(null);
    };

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
        departments,
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
