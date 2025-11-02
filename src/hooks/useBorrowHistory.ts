import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BorrowView, BorrowStatus, BorrowEquipmentView } from '@/types/type';

type GroupedBorrow = Omit<BorrowView, 'items'> & {
    items: BorrowEquipmentView[];
};

const STATUS_MAP: Record<number, { label: string; color: string }> = {};

export function useBorrowHistory() {
    const [records, setRecords] = useState<BorrowView[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<GroupedBorrow | null>(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');

    // Options for dropdowns
    const [statuses, setStatuses] = useState<BorrowStatus[]>([]);
    const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);
    const [equipmentTypes, setEquipmentTypes] = useState<{ id: number; equipmentTypeName: string }[]>([]);

    /**
     * จัดกลุ่มข้อมูลตาม borrowId
     * TODO: เมื่อ backend ส่งข้อมูลมาเป็น grouped format แล้ว
     * ให้ลบ logic นี้และใช้ข้อมูลจาก backend โดยตรง
     * 
     * ปัจจุบันต้อง group ใน frontend เพราะ backend ส่ง BorrowView[]
     * ที่อาจมี duplicate borrowId (ถ้ามีหลาย equipment ใน borrow เดียวกัน)
     */
    const groupedRecords = records.reduce<GroupedBorrow[]>((acc, record) => {
        const existingGroup = acc.find(g => g.id === record.id);

        if (existingGroup) {
            // เพิ่ม items จาก record นี้เข้าไปใน group
            if (record.items && record.items.length > 0) {
                existingGroup.items.push(...record.items);
            }
        } else {
            const newGroup: GroupedBorrow = {
                ...record,
                items: record.items || []
            };
            acc.push(newGroup);
        }

        return acc;
    }, []);

    // โหลดข้อมูลสำหรับ dropdowns
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const [statusesData, rolesData, typesData] = await Promise.all([
                    api.borrow_history.getStatuses(),
                    api.borrow_history.getRoles(),
                    api.borrow_history.getEquipmentTypes(),
                ]);
                setStatuses(statusesData);
                setRoles(rolesData);
                setEquipmentTypes(typesData);
            } catch (err) {
                console.error('Error loading filter options:', err);
            }
        };

        loadFilterOptions();
    }, []);

    /**
     * กรองข้อมูลการยืม (เรียก API ตรงๆ ตาม backend)
     * Note: Backend รองรับแค่ search และ filterByStatus
     * role และ equipmentType ยังไม่มี endpoint filter แยก
     * - ถ้ามี keyword → เรียก search
     * - ถ้ามี status → เรียก filterByStatus  
     * - ถ้าไม่มี filter → เรียก getAll
     */
    const applyFilters = async () => {
        setLoading(true);
        setError(null);

        try {
            let data: BorrowView[] = [];

            // ถ้ามี keyword → เรียก search
            if (searchTerm.trim()) {
                data = await api.borrow.search(searchTerm.trim());
            }
            // ถ้ามี status → เรียก filterByStatus
            else if (selectedStatus !== 'all') {
                data = await api.borrow_history.filterByStatus(Number(selectedStatus));
            }
            // ไม่มี filter → เรียกทั้งหมด
            else {
                data = await api.borrow.getAll();
            }

            // TODO: ถ้า backend มี endpoint สำหรับ filter role และ equipmentType
            // ให้เพิ่ม logic ที่นี่

            setRecords(data);

            if (data.length === 0) {
                setError('ไม่พบรายการที่ตรงกับเงื่อนไขที่เลือก');
            }
        } catch (err) {
            console.error('❌ กรองข้อมูลล้มเหลว:', err);
            setError('ไม่สามารถกรองข้อมูลได้');
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    // ล้างฟิลเตอร์ทั้งหมด
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedRole('all');
        setSelectedType('all');
    };

    // คืนอุปกรณ์ทีละชิ้น
    const returnEquipmentItem = async (borrowEquipmentId: number) => {
        try {
            await api.borrow_history.returnSingle(borrowEquipmentId);
            
            // Refresh data after return
            await applyFilters();
            
            alert('คืนอุปกรณ์สำเร็จ! ✅');
        } catch (err) {
            console.error('❌ คืนอุปกรณ์ล้มเหลว:', err);
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
    }, [selectedStatus, selectedRole, selectedType]);

    return {
        // Data
        records,
        groupedRecords,
        selected,
        statuses,
        roles,
        equipmentTypes,
        STATUS_MAP,
        
        // Filter states
        searchTerm,
        selectedStatus,
        selectedRole,
        selectedType,
        loading,
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
    };
}

