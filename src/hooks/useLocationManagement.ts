import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Department, Building, Floor, Room } from '@/types/type';

type TabType = 'department' | 'building' | 'floor' | 'room';

export function useLocationManagement() {
    const [activeTab, setActiveTab] = useState<TabType>('department');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data states
    const [departments, setDepartments] = useState<Department[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [floors, setFloors] = useState<Floor[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Department | Building | Floor | Room | null>(null);
    const [modalType, setModalType] = useState<'create' | 'edit'>('create');

    // Filter states for hierarchical data
    const [selectedDepartment, setSelectedDepartment] = useState<number>(0);
    const [selectedBuilding, setSelectedBuilding] = useState<number>(0);

    // Load all data
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Load departments
            const depts = await api.department.getAll();
            setDepartments(depts);

            // Load buildings if department selected
            if (selectedDepartment > 0) {
                const bldgs = await api.building.filter(selectedDepartment);
                setBuildings(bldgs);
            } else {
                setBuildings([]);
            }

            // Load floors if building selected
            if (selectedBuilding > 0) {
                const flrs = await api.floor.getByBuilding(selectedBuilding);
                setFloors(flrs);
            } else {
                setFloors([]);
            }

            // Load rooms if floor selected (will be handled when floor is selected)
        } catch (err) {
            console.error('Error loading data:', err);
            setError('ไม่สามารถโหลดข้อมูลได้');
        } finally {
            setLoading(false);
        }
    };

    // Load buildings when department changes
    useEffect(() => {
        const loadBuildings = async () => {
            if (selectedDepartment > 0) {
                try {
                    const data = await api.building.filter(selectedDepartment);
                    setBuildings(data);
                } catch (err) {
                    console.error('Error loading buildings:', err);
                }
            } else {
                setBuildings([]);
            }
            setSelectedBuilding(0);
            setFloors([]);
            setRooms([]);
        };
        loadBuildings();
    }, [selectedDepartment]);

    // Load floors when building changes
    useEffect(() => {
        const loadFloors = async () => {
            if (selectedBuilding > 0) {
                try {
                    const data = await api.floor.getByBuilding(selectedBuilding);
                    setFloors(data);
                } catch (err) {
                    console.error('Error loading floors:', err);
                }
            } else {
                setFloors([]);
            }
            setRooms([]);
        };
        loadFloors();
    }, [selectedBuilding]);

    // Load rooms when floor changes (for room tab)
    const loadRooms = async (floorId: number) => {
        try {
            const data = await api.room.getByFloor(floorId);
            setRooms(data);
        } catch (err) {
            console.error('Error loading rooms:', err);
        }
    };

    // Initial load
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Open create modal
    const openCreateModal = () => {
        setEditingItem(null);
        setModalType('create');
        setShowModal(true);
    };

    // Open edit modal
    const openEditModal = (item: Department | Building | Floor | Room) => {
        setEditingItem(item);
        setModalType('edit');
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    // Create functions
    const createDepartment = async (data: { departmentName: string }) => {
        setLoading(true);
        setError(null);
        try {
            await api.department.create(data);
            await loadData();
            closeModal();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถเพิ่มแผนกได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createBuilding = async (data: { buildingName: string; departmentId: number }) => {
        setLoading(true);
        setError(null);
        try {
            await api.building.create(data);
            await loadData();
            closeModal();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถเพิ่มตึกได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createFloor = async (data: { floorName: string; buildingId: number }) => {
        setLoading(true);
        setError(null);
        try {
            await api.floor.create(data);
            await loadData();
            closeModal();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถเพิ่มชั้นได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createRoom = async (data: { roomName: string; floorId: number }) => {
        setLoading(true);
        setError(null);
        try {
            await api.room.create(data);
            await loadData();
            closeModal();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถเพิ่มห้องได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update functions
    const updateDepartment = async (id: number, data: { departmentName?: string }) => {
        setLoading(true);
        setError(null);
        try {
            await api.department.update(id, data);
            await loadData();
            closeModal();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถแก้ไขแผนกได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateBuilding = async (id: number, data: { buildingName?: string; departmentId?: number }) => {
        setLoading(true);
        setError(null);
        try {
            await api.building.update(id, data);
            await loadData();
            closeModal();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถแก้ไขตึกได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateFloor = async (id: number, data: { floorName?: string; buildingId?: number }) => {
        setLoading(true);
        setError(null);
        try {
            await api.floor.update(id, data);
            await loadData();
            closeModal();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถแก้ไขชั้นได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateRoom = async (id: number, data: { roomName?: string; floorId?: number }) => {
        setLoading(true);
        setError(null);
        try {
            await api.room.update(id, data);
            await loadData();
            closeModal();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถแก้ไขห้องได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Delete functions
    const deleteDepartment = async (id: number) => {
        if (!confirm('ต้องการลบแผนกนี้หรือไม่?')) return;
        setLoading(true);
        setError(null);
        try {
            await api.department.delete(id);
            await loadData();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถลบแผนกได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteBuilding = async (id: number) => {
        if (!confirm('ต้องการลบตึกนี้หรือไม่?')) return;
        setLoading(true);
        setError(null);
        try {
            await api.building.delete(id);
            await loadData();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถลบตึกได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteFloor = async (id: number) => {
        if (!confirm('ต้องการลบชั้นนี้หรือไม่?')) return;
        setLoading(true);
        setError(null);
        try {
            await api.floor.delete(id);
            await loadData();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถลบชั้นได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteRoom = async (id: number) => {
        if (!confirm('ต้องการลบห้องนี้หรือไม่?')) return;
        setLoading(true);
        setError(null);
        try {
            await api.room.delete(id);
            await loadData();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('ไม่สามารถลบห้องได้');
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        // State
        activeTab,
        setActiveTab,
        loading,
        error,
        setError,
        
        // Data
        departments,
        buildings,
        floors,
        rooms,
        
        // Modal
        showModal,
        editingItem,
        modalType,
        openCreateModal,
        openEditModal,
        closeModal,
        
        // Filters
        selectedDepartment,
        setSelectedDepartment,
        selectedBuilding,
        setSelectedBuilding,
        loadRooms,
        
        // Actions
        createDepartment,
        createBuilding,
        createFloor,
        createRoom,
        updateDepartment,
        updateBuilding,
        updateFloor,
        updateRoom,
        deleteDepartment,
        deleteBuilding,
        deleteFloor,
        deleteRoom,
        loadData,
    };
}

