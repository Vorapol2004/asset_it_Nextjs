import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { BorrowView, BorrowStatus, Department } from '@/types/type';

type GroupedBorrow = BorrowView;

// ฟังก์ชันสำหรับกำหนดสีตามชื่อสถานะ
const getStatusColor = (statusName: string): string => {
    const name = statusName.trim().toLowerCase();
    
    // เลยกำหนด = สีแดง
    if (name.includes('เลยกำหนด') || name.includes('เกินกำหนด') || name.includes('overdue')) {
        return 'bg-red-100 text-red-800 border-red-300';
    }
    // ยืมอยู่ = สีเหลือง
    else if (name.includes('ยืมอยู่') || name.includes('กำลังยืม') || name.includes('borrowed')) {
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    // คืนแล้ว = สีเขียว
    else if (name.includes('คืนแล้ว') || name.includes('คืนครบ') || name.includes('returned')) {
        return 'bg-green-100 text-green-800 border-green-300';
    }
    // คืนบางส่วน = สีน้ำเงิน
    else if (name.includes('คืนบางส่วน') || name.includes('คืนบางรายการ') || name.includes('partial')) {
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    // default
    else {
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

export function useBorrowHistory() {
    const [records, setRecords] = useState<BorrowView[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<GroupedBorrow | null>(null);
    const [selectedLoading, setSelectedLoading] = useState(false);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

    // Options for dropdowns
    const [statuses, setStatuses] = useState<BorrowStatus[]>([]);
    const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);
    const [equipmentTypes, setEquipmentTypes] = useState<{ id: number; equipmentTypeName: string }[]>([]);
    const [equipmentStatuses, setEquipmentStatuses] = useState<{ id: number; equipmentStatusName: string }[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    
    // Filter equipment statuses สำหรับการคืน (แสดงแค่ available, lost, damaged)
    const returnEquipmentStatuses = equipmentStatuses.filter(status => {
        const statusName = (status.equipmentStatusName || '').trim().toLowerCase();
        return statusName === 'available' || statusName === 'lost' || statusName === 'damaged';
    });
    
    // สร้าง STATUS_MAP จาก statuses (อัปเดตเมื่อ statuses เปลี่ยน)
    const STATUS_MAP = useMemo(() => {
        const map: Record<number, { label: string; color: string }> = {};
        statuses.forEach(status => {
            map[status.id] = {
                label: status.borrowStatusName,
                color: getStatusColor(status.borrowStatusName),
            };
        });
        return map;
    }, [statuses]);

    const groupedRecords: GroupedBorrow[] = records;


    //dropdowns
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const [statusesData, rolesData, typesData, equipmentStatusesData, departmentsData] = await Promise.all([
                    api.borrow_history.getStatuses(),
                    api.role.filter(), 
                    api.borrow_history.getEquipmentTypes(),
                    api.borrow_history.getEquipmentStatuses(),
                    api.department.getAll(),
                ]);
                setStatuses(statusesData);
                setRoles(rolesData);
                setEquipmentTypes(typesData);
                setEquipmentStatuses(equipmentStatusesData);
                setDepartments(departmentsData);
            } catch (err) {
                console.error('Error loading filter options:', err);
            }
        };

        loadFilterOptions();
    }, []);

    
    const applyFilters = async () => {
        setLoading(true);
        setError(null);

        try {
            // ใช้ filterByStatus สำหรับทุกกรณี (รองรับ keyword, statusId, roleId, departmentId)
            const statusId = selectedStatus !== 'all' ? Number(selectedStatus) : undefined;
            const roleId = selectedRole !== 'all' 
                ? roles.find(r => r.roleName === selectedRole)?.id 
                : undefined;
            const departmentId = selectedDepartment !== 'all' ? Number(selectedDepartment) : undefined;
            const keyword = searchTerm.trim() || undefined;
            
            const data = await api.borrow_history.filterByStatus(statusId, roleId, departmentId, keyword);
            
            setRecords(data);
        } catch (err) {
            console.error('กรองข้อมูลล้มเหลว:', err);
            setError('ไม่สามารถกรองข้อมูลได้');
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedRole('all');
        setSelectedType('all');
        setSelectedDepartment('all');
    };

    const returnEquipmentItem = async (
        borrowEquipmentId: number,
        statusId: number
    ) => {
        try {
            await api.borrow_history.returnSingle(borrowEquipmentId, statusId);
            
            // Refresh data after return
            await applyFilters();
            
            // ถ้ามี selected borrow อยู่ ให้ reload detail เพื่อแสดง returnDate
            if (selected) {
                await loadBorrowDetails(selected.id);
            }
            
            alert('คืนอุปกรณ์สำเร็จ!');
        } catch (err) {
            console.error('คืนอุปกรณ์ล้มเหลว:', err);
            alert('ไม่สามารถคืนอุปกรณ์ได้ กรุณาลองใหม่อีกครั้ง');
        }
    };

    // โหลดข้อมูลครั้งแรก
    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // เรียก API ทันทีเมื่อ filter อื่นๆ เปลี่ยน (ยกเว้น searchTerm)
    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStatus, selectedRole, selectedType, selectedDepartment]);

    // ฟังก์ชันสำหรับดึงรายละเอียดการยืมจาก backend
    const loadBorrowDetails = async (borrowId: number) => {
        setSelectedLoading(true);
        try {
            const dataArray = await api.borrow_history.select(borrowId);
            
            if (dataArray.length === 0) {
                throw new Error('ไม่พบข้อมูลการยืม');
            }

            const firstRecord = dataArray[0];
            
            // Backend ส่ง grouped format มาแล้ว → ใช้โดยตรง
            setSelected(firstRecord);
        } catch (err) {
            console.error('ดึงรายละเอียดล้มเหลว:', err);
            alert('ไม่สามารถดึงรายละเอียดได้ กรุณาลองอีกครั้ง');
            setSelected(null);
        } finally {
            setSelectedLoading(false);
        }
    };

    return {
        // Data
        records,
        groupedRecords,
        selected,
        statuses,
        roles,
        equipmentTypes,
        equipmentStatuses,
        returnEquipmentStatuses,
        departments,
        STATUS_MAP,
        
        // Filter states
        searchTerm,
        selectedStatus,
        selectedRole,
        selectedType,
        selectedDepartment,
        loading,
        selectedLoading,
        error,

        // Setters
        setSearchTerm,
        setSelectedStatus,
        setSelectedRole,
        setSelectedType,
        setSelectedDepartment,
        setSelected,

        // Methods
        applyFilters,
        handleClearFilters,
        returnEquipmentItem,
        loadBorrowDetails,
    };
}

