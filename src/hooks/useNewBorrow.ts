import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { EquipmentView, BorrowCreateData, Building, Floor, Room, Department } from '@/types/type';
import { ROUTES } from '@/constants/routes';

export interface BorrowItem {
    equipmentType: string;
    equipmentName: string;
    brand: string;
    model: string;
    serialNumber?: string;
    licenseKey?: string;
    notes?: string;
}

export interface SelectedBorrowerData {
    borrowerFirstName: string;
    borrowerLastName: string;
    borrowerEmail: string;
    borrowerPhone: string;
    borrowerRole: string;
    buildingId: number;
    buildingName: string;
    roomId: number;
    roomName: string;
    departmentId: number;
    departmentName: string;
    approverName: string;
}

export function useNewBorrow() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [equipmentList, setEquipmentList] = useState<EquipmentView[]>([]);

    // Location & Organization
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [borrowerRole, setBorrowerRole] = useState('');

    const [selectedDepartment, setSelectedDepartment] = useState<number>(0);
    const [selectedBuilding, setSelectedBuilding] = useState<number>(0);
    const [selectedRoom, setSelectedRoom] = useState<number>(0);
    const [approverName, setApproverName] = useState('');

    // Borrower info
    const [borrowerFirstName, setBorrowerFirstName] = useState('');
    const [borrowerLastName, setBorrowerLastName] = useState('');
    const [borrowerEmail, setBorrowerEmail] = useState('');
    const [borrowerPhone, setBorrowerPhone] = useState('');
    const [borrowDate, setBorrowDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [referenceDoc, setReferenceDoc] = useState('');

    const [borrowItems, setBorrowItems] = useState<BorrowItem[]>([
        {
            equipmentType: 'Hardware',
            equipmentName: '',
            brand: '',
            model: '',
            serialNumber: '',
            licenseKey: '',
            notes: ''
        }
    ]);

    // Auto-fill from sessionStorage when coming from old_borrow
    useEffect(() => {
        const selectedBorrowerData = sessionStorage.getItem('selectedBorrower');
        if (selectedBorrowerData) {
            try {
                const data: SelectedBorrowerData = JSON.parse(selectedBorrowerData);

                console.log('📥 Auto-filling data from old_borrow:', data);

                // Set borrower info
                setBorrowerFirstName(data.borrowerFirstName || '');
                setBorrowerLastName(data.borrowerLastName || '');
                setBorrowerEmail(data.borrowerEmail || '');
                setBorrowerPhone(data.borrowerPhone || '');
                setBorrowerRole(data.borrowerRole || '');
                
                // Set location info (will be set after buildings/departments load)
                if (data.departmentId && data.departmentId > 0) {
                    setSelectedDepartment(data.departmentId);
                }
                if (data.buildingId && data.buildingId > 0) {
                    setSelectedBuilding(data.buildingId);
                }
                if (data.roomId && data.roomId > 0) {
                    setSelectedRoom(data.roomId);
                }
                setApproverName(data.approverName || '');

                console.log('✅ Auto-filled values:', {
                    firstName: data.borrowerFirstName,
                    lastName: data.borrowerLastName,
                    email: data.borrowerEmail,
                    phone: data.borrowerPhone,
                    role: data.borrowerRole,
                });

                sessionStorage.removeItem('selectedBorrower');
            } catch (error) {
                console.error('❌ Error parsing selected borrower data:', error);
            }
        }
    }, []);

    useEffect(() => {
        fetchAvailableEquipment();
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchBuildings();
    }, [selectedDepartment]);

    useEffect(() => {
        fetchRooms();
    }, [selectedDepartment, selectedBuilding]);

    const fetchAvailableEquipment = async () => {
        try {
            const data = await api.borrow.getAvailableEquipment();
            setEquipmentList(data);
        } catch (error) {
            console.error('Error fetching available equipment:', error);
        }
    };

    /**
     * ดึงตึกตาม departmentId ที่เลือก
     * Backend: GET /borrow/buildings/{departmentId}
     */
    const fetchBuildings = async () => {
        if (!selectedDepartment || selectedDepartment === 0) {
            setBuildings([]);
            return;
        }
        try {
            const data = await api.borrow.getBuildingsByDepartment(selectedDepartment);
            setBuildings(data);
            // Reset building and room selection when department changes
            setSelectedBuilding(0);
            setRooms([]);
            setSelectedRoom(0);
        } catch (error) {
            console.error('Error fetching buildings:', error);
        }
    };

    /**
     * ดึงห้องตาม departmentId และ buildingId ที่เลือก
     * Backend: GET /borrow/rooms?departmentId={id}&buildingId={id}
     */
    const fetchRooms = async () => {
        if (!selectedDepartment || selectedDepartment === 0 || !selectedBuilding || selectedBuilding === 0) {
            setRooms([]);
            return;
        }
        try {
            const data = await api.borrow.getRoomsByDepartmentAndBuilding(selectedDepartment, selectedBuilding);
            setRooms(data);
            // Reset room selection when building changes
            setSelectedRoom(0);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const data = await api.borrow.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const addBorrowItem = () => {
        setBorrowItems([
            ...borrowItems,
            {
                equipmentType: 'Hardware',
                equipmentName: '',
                brand: '',
                model: '',
                serialNumber: '',
                licenseKey: '',
                notes: ''
            }
        ]);
    };

    const removeBorrowItem = (index: number) => {
        if (borrowItems.length > 1) {
            const newItems = borrowItems.filter((_, i) => i !== index);
            setBorrowItems(newItems);
        }
    };

    const updateBorrowItem = (index: number, field: keyof BorrowItem, value: string | number) => {
        const newItems = [...borrowItems];

        if (field === 'equipmentType') {
            newItems[index] = {
                ...newItems[index],
                equipmentType: value as string,
                serialNumber: '',
                licenseKey: ''
            };
        } else {
            newItems[index] = {
                ...newItems[index],
                [field]: value
            };
        }

        setBorrowItems(newItems);
    };

    const validateForm = (): string | null => {
        if (!borrowerFirstName.trim() || !borrowerLastName.trim()) {
            return 'กรุณากรอกชื่อ-นามสกุลผู้ยืม';
        }

        if (!borrowerRole) {
            return 'กรุณาเลือกตำแหน่งผู้ยืม';
        }

        if (selectedDepartment === 0) {
            return 'กรุณาเลือกแผนก';
        }

        if (selectedBuilding === 0 || selectedRoom === 0) {
            return 'กรุณาเลือกสถานที่ (ตึก, ห้อง)';
        }

        if (!approverName.trim()) {
            return 'กรุณากรอกชื่อผู้อนุมัติ';
        }

        if (!borrowDate || !dueDate) {
            return 'กรุณาเลือกวันที่ยืมและวันที่คืน';
        }

        if (!borrowerPhone.trim()) {
            return 'กรุณากรอกเบอร์โทรศัพท์';
        }

        const hasInvalidItems = borrowItems.some(
            item => !item.equipmentType || !item.equipmentName.trim()
        );
        if (hasInvalidItems) {
            return 'กรุณาเลือกประเภทและกรอกชื่ออุปกรณ์ให้ครบทุกรายการ';
        }

        for (let i = 0; i < borrowItems.length; i++) {
            const item = borrowItems[i];

            if (item.equipmentType === 'Hardware' && !item.serialNumber?.trim()) {
                return `กรุณากรอก Serial Number ในรายการที่ ${i + 1}`;
            }

            if (item.equipmentType === 'License' && !item.licenseKey?.trim()) {
                return `กรุณากรอก License Key ในรายการที่ ${i + 1}`;
            }
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validationError = validateForm();
            if (validationError) {
                alert(validationError);
                setLoading(false);
                return;
            }

            const borrowData: BorrowCreateData = {
                borrowerFirstName: borrowerFirstName.trim(),
                borrowerLastName: borrowerLastName.trim(),
                borrowerEmail: borrowerEmail.trim() || null,
                borrowerPhone: borrowerPhone.trim() || null,
                borrowDate: borrowDate,
                dueDate: dueDate,
                referenceDoc: referenceDoc || null,
                items: borrowItems.map(item => {
                    // Note: The API might need equipmentId, but we're creating new equipment
                    // This might need adjustment based on actual API requirements
                    return {
                        equipmentId: 0, // Will need to be set based on actual equipment selection or creation
                        serialNumber: item.equipmentType === 'Hardware' ? item.serialNumber?.trim() : undefined,
                        licenseKey: item.equipmentType === 'License' ? item.licenseKey?.trim() : undefined,
                        notes: item.notes || undefined
                    };
                })
            };

            console.log('📤 Submitting borrow data:', borrowData);

            const response = await api.borrow.create(borrowData);
            console.log('✅ Borrow created:', response);

            alert('✅ บันทึกการยืมเรียบร้อยแล้ว!');
            router.push(ROUTES.BORROW_EQUIPMENT);
        } catch (error) {
            console.error('Error submitting borrow:', error);
            alert('❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    return {
        // State
        loading,
        equipmentList,
        buildings,
        rooms,
        departments,
        borrowerRole,
        selectedDepartment,
        selectedBuilding,
        selectedRoom,
        approverName,
        borrowerFirstName,
        borrowerLastName,
        borrowerEmail,
        borrowerPhone,
        borrowDate,
        dueDate,
        referenceDoc,
        borrowItems,

        // Setters
        setBorrowerRole,
        setSelectedDepartment,
        setSelectedBuilding,
        setSelectedRoom,
        setApproverName,
        setBorrowerFirstName,
        setBorrowerLastName,
        setBorrowerEmail,
        setBorrowerPhone,
        setBorrowDate,
        setDueDate,
        setReferenceDoc,

        // Methods
        addBorrowItem,
        removeBorrowItem,
        updateBorrowItem,
        handleSubmit,
    };
}

