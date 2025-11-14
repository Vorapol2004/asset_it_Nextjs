import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BorrowView, BorrowStatus, BorrowEquipmentView } from '@/types/type';

type GroupedBorrow = Omit<BorrowView, 'items'> & {
    items: BorrowEquipmentView[];
    borrowEquipmentCount?: number | null;
    approverName?: string | null;
};

const STATUS_MAP: Record<number, { label: string; color: string }> = {};

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

    // Options for dropdowns
    const [statuses, setStatuses] = useState<BorrowStatus[]>([]);
    const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);
    const [equipmentTypes, setEquipmentTypes] = useState<{ id: number; equipmentTypeName: string }[]>([]);
    const [equipmentStatuses, setEquipmentStatuses] = useState<{ id: number; equipmentStatusName: string }[]>([]);
    
    // Filter equipment statuses สำหรับการคืน (แสดงแค่ available, lost, damaged)
    const returnEquipmentStatuses = equipmentStatuses.filter(status => {
        const statusName = (status.equipmentStatusName || '').trim().toLowerCase();
        return statusName === 'available' || statusName === 'lost' || statusName === 'damaged';
    });
    
    //ตรวจสอบสถานะที่ filter ได้
    useEffect(() => {
        if (equipmentStatuses.length > 0) {
            console.log('Equipment Statuses ทั้งหมด:', equipmentStatuses);
            console.log('Filtered Return Statuses:', returnEquipmentStatuses);
        }
    }, [equipmentStatuses]);


    const groupedRecords: GroupedBorrow[] = (() => {
        // ตรวจสอบว่าเป็น grouped หรือ flat
        const firstRecord = records[0];
        if (firstRecord && Array.isArray(firstRecord.items)) {
            // Backend ส่ง grouped format มาแล้ว → ใช้โดยตรง
            return records.map(record => ({
                ...record,
                roleName: record.roleName || 'ไม่ระบุ',
                items: record.items || []
            }));
        } else {
            // Backend ส่ง flat array → ต้อง group
            const grouped = records.reduce<GroupedBorrow[]>((acc, record) => {
                const existingGroup = acc.find(g => g.id === record.id);

                if (existingGroup) {
                    // เพิ่ม equipment จาก record นี้เข้าไปใน items
                    if (record.equipmentId) {
                        const equipmentItem: BorrowEquipmentView = {
                            // ใช้ id เป็น borrowEquipmentId (ตามที่ backend ส่งมา)
                            borrowEquipmentId: record.borrowEquipmentId || record.id || 0,
                            equipmentId: record.equipmentId,
                            equipmentName: record.equipmentName || '',
                            brand: record.brand || undefined,
                            model: record.model || undefined,
                            serialNumber: record.serialNumber || undefined,
                            licenseKey: record.licenseKey || undefined,
                            equipmentTypeName: record.equipmentTypeName || undefined,
                            dueDate: record.dueDate || undefined,
                            returnDate: record.returnDate || undefined,
                        };
                        existingGroup.items.push(equipmentItem);
                    }
                    // อัพเดท borrowEquipmentCount ถ้ามี
                    if (record.borrowEquipmentCount !== undefined) {
                        existingGroup.borrowEquipmentCount = record.borrowEquipmentCount;
                    }
                } else {
                    // สร้าง group ใหม่
                    const items: BorrowEquipmentView[] = [];
                    
                    if (record.equipmentId) {
                        //เพิ่มอุปกรณ์ใหม่เข้าในกลุ่ม
                        items.push({
                            // ใช้ id เป็น borrowEquipmentId (ตามที่ backend ส่งมา)
                            borrowEquipmentId: record.borrowEquipmentId || record.id || 0,
                            equipmentId: record.equipmentId,
                            equipmentName: record.equipmentName || '',
                            brand: record.brand || undefined,
                            model: record.model || undefined,
                            serialNumber: record.serialNumber || undefined,
                            licenseKey: record.licenseKey || undefined,
                            equipmentTypeName: record.equipmentTypeName || undefined,
                            dueDate: record.dueDate || undefined,
                            returnDate: record.returnDate || undefined,
                        });
                    }

                    const newGroup: GroupedBorrow = {
                        ...record,
                        roleName: record.roleName || 'ไม่ระบุ',
                        items: items
                    };
                    acc.push(newGroup);
                }

                return acc;
            }, []);
            return grouped;
        }
    })();


    //dropdowns
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const [statusesData, rolesData, typesData, equipmentStatusesData] = await Promise.all([
                    api.borrow_history.getStatuses(),
                    api.role.filter(), 
                    api.borrow_history.getEquipmentTypes(),
                    api.borrow_history.getEquipmentStatuses(),
                ]);
                setStatuses(statusesData);
                setRoles(rolesData);
                setEquipmentTypes(typesData);
                setEquipmentStatuses(equipmentStatusesData);
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
            let data: BorrowView[] = [];

            // ถ้ามี keyword → เรียก search
            if (searchTerm.trim()) {
                data = await api.borrow.search(searchTerm.trim());
            }
            // ถ้ามี status หรือ role → เรียก filter (รองรับ filter หลายตัวพร้อมกัน)
            else if (selectedStatus !== 'all' || selectedRole !== 'all') {
                const statusId = selectedStatus !== 'all' ? Number(selectedStatus) : undefined;
                const roleId = selectedRole !== 'all' 
                    ? roles.find(r => r.roleName === selectedRole)?.id 
                    : undefined;
                
                data = await api.borrow_history.filterByStatus(statusId, roleId);
            }
            else {
                data = await api.borrow.getAll();
            }

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
    }, []);

    // เรียก API ทันทีเมื่อ filter อื่นๆ เปลี่ยน (ยกเว้น searchTerm)
    useEffect(() => {
        applyFilters();
    }, [selectedStatus, selectedRole, selectedType]);

    // ฟังก์ชันสำหรับดึงรายละเอียดการยืมจาก backend
    const loadBorrowDetails = async (borrowId: number) => {
        setSelectedLoading(true);
        try {
            const dataArray = await api.borrow_history.select(borrowId);
            
            if (dataArray.length === 0) {
                throw new Error('ไม่พบข้อมูลการยืม');
            }

            const firstRecord = dataArray[0];
            let groupedData: GroupedBorrow;

            // ตรวจสอบว่า backend ส่ง grouped format มาแล้วหรือไม่ (มี items array)
            if (Array.isArray(firstRecord.items)) {
                // Backend ส่ง grouped format มาแล้ว → ใช้โดยตรง
                groupedData = {
                    ...firstRecord,
                    roleName: firstRecord.roleName || 'ไม่ระบุ',
                    items: firstRecord.items || []
                };
            } else {
                // Backend ส่ง flat array → ต้อง group
                const items: BorrowEquipmentView[] = [];

                // รวบรวม equipment จากทุก record
                dataArray.forEach((record) => {
                    if (record.equipmentId) {
                        items.push({
                            // ใช้ id เป็น borrowEquipmentId (ตามที่ backend ส่งมา)
                            borrowEquipmentId: record.borrowEquipmentId || record.id || 0,
                            equipmentId: record.equipmentId,
                            equipmentName: record.equipmentName || '',
                            brand: record.brand || undefined,
                            model: record.model || undefined,
                            serialNumber: record.serialNumber || undefined,
                            licenseKey: record.licenseKey || undefined,
                            equipmentTypeName: record.equipmentTypeName || undefined,
                            dueDate: record.dueDate || undefined,
                            returnDate: record.returnDate || undefined,
                        });
                    }
                });

                // แปลงเป็น GroupedBorrow
                groupedData = {
                    ...firstRecord,
                    roleName: firstRecord.roleName || 'ไม่ระบุ',
                    employeeName: firstRecord.employeeName || `${firstRecord.firstName || ''} ${firstRecord.lastName || ''}`.trim(),
                    items: items,
                    referenceDoc: firstRecord.referenceDoc || undefined,
                    approverName: firstRecord.approverName || undefined,
                };
            }
            
            setSelected(groupedData);
        } catch (err) {
            console.error('❌ ดึงรายละเอียดล้มเหลว:', err);
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
        STATUS_MAP,
        
        // Filter states
        searchTerm,
        selectedStatus,
        selectedRole,
        selectedType,
        loading,
        selectedLoading,
        error,

        // Setters
        setSearchTerm,
        setSelectedStatus,
        setSelectedRole,
        setSelectedType,
        setSelected,

        // Methods
        applyFilters,
        handleClearFilters,
        returnEquipmentItem,
        loadBorrowDetails,
    };
}

