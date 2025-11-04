import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { EquipmentView, Building, Floor, Room, Department, Role, Employee } from '@/types/type';
import { ROUTES } from '@/constants/routes';

export interface BorrowItem {
    searchValue: string;     // ค่าที่ใช้ search (licensekey หรือ serialnumber)
    equipmentId: number;     // อุปกรณ์ที่ค้นหาเจอ (0 ถ้ายังไม่เจอ)
    equipmentName: string;   // ชื่ออุปกรณ์ (auto-fill)
    brand: string;           // ยี่ห้อ (auto-fill)
    model: string;           // รุ่น (auto-fill)
    notes?: string;          // หมายเหตุ
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
    fromOldBorrow?: boolean; // Flag เพื่อบอกว่ามาจาก old_borrow
}

export function useNewBorrow() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [equipmentList, setEquipmentList] = useState<EquipmentView[]>([]);


    // Location & Organization
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [floors, setFloors] = useState<Floor[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [borrowerRole, setBorrowerRole] = useState('');

    const [selectedDepartment, setSelectedDepartment] = useState<number>(0);
    const [selectedBuilding, setSelectedBuilding] = useState<number>(0);
    const [selectedFloor, setSelectedFloor] = useState<number>(0);
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
            searchValue: '',
            equipmentId: 0,
            equipmentName: '',
            brand: '',
            model: '',
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
        fetchDepartments();
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchBuildings();
    }, [selectedDepartment]);

    useEffect(() => {
        fetchFloors();
    }, [selectedBuilding]);

    useEffect(() => {
        fetchRooms();
    }, [selectedFloor]);

    /**
     * ค้นหาอุปกรณ์ด้วย licensekey หรือ serialnumber
     * Backend: GET /equipment/select_equipment_type?licensekey={value} หรือ ?serialnumber={value}
     * ลองค้นหาด้วย licensekey ก่อน ถ้าไม่เจอค่อยลอง serialnumber
     */
    const searchEquipment = async (itemIndex: number, searchValue: string) => {
        if (!searchValue.trim()) {
            // Clear data when search value is empty
            setBorrowItems(prev => {
                const newItems = [...prev];
                newItems[itemIndex] = {
                    ...newItems[itemIndex],
                    searchValue: '',
                    equipmentId: 0,
                    equipmentName: '',
                    brand: '',
                    model: ''
                };
                return newItems;
            });
            return;
        }

        try {
            // Backend จะค้นหาทั้ง licensekey และ serialnumber เอง
            const data = await api.borrow.searchEquipment(searchValue.trim());

            // ถ้าเจออุปกรณ์ (ควรเจอ 1 อัน) ให้ auto-fill ข้อมูล
            if (data.length > 0) {
                const equipment = data[0];
                setBorrowItems(prev => {
                    const newItems = [...prev];
                    newItems[itemIndex] = {
                        ...newItems[itemIndex],
                        searchValue: searchValue.trim(),
                        equipmentId: equipment.id,
                        equipmentName: equipment.equipmentName || '',
                        brand: equipment.brand || '',
                        model: equipment.model || ''
                    };
                    return newItems;
                });
            } else {
                // ไม่เจอ - clear ข้อมูลอุปกรณ์ แต่เก็บ search value ไว้
                setBorrowItems(prev => {
                    const newItems = [...prev];
                    newItems[itemIndex] = {
                        ...newItems[itemIndex],
                        searchValue: searchValue.trim(),
                        equipmentId: 0,
                        equipmentName: '',
                        brand: '',
                        model: ''
                    };
                    return newItems;
                });
            }
        } catch (error) {
            console.error('Error searching equipment:', error);
            // Clear data on error แต่เก็บ search value ไว้
            setBorrowItems(prev => {
                const newItems = [...prev];
                newItems[itemIndex] = {
                    ...newItems[itemIndex],
                    equipmentId: 0,
                    equipmentName: '',
                    brand: '',
                    model: ''
                };
                return newItems;
            });
        }
    };

    /**
     * ดึงตึกตาม departmentId ที่เลือก
     * Backend: GET /building/filter?departmentId={id}
     */
    const fetchBuildings = async () => {
        if (!selectedDepartment || selectedDepartment === 0) {
            setBuildings([]);
            return;
        }
        try {
            const data = await api.building.filter(selectedDepartment);
            setBuildings(data);
            // Reset building, floor, and room selection when department changes
            setSelectedBuilding(0);
            setFloors([]);
            setSelectedFloor(0);
            setRooms([]);
            setSelectedRoom(0);
        } catch (error) {
            console.error('Error fetching buildings:', error);
        }
    };

    /**
     * ดึงชั้นตาม buildingId ที่เลือก
     * Backend: GET /floor/filter?buildingId={id}
     */
    const fetchFloors = async () => {
        if (!selectedBuilding || selectedBuilding === 0) {
            setFloors([]);
            setSelectedFloor(0);
            setRooms([]);
            return;
        }
        try {
            const data = await api.floor.getByBuilding(selectedBuilding);
            setFloors(data);
            // Reset floor and room selection when building changes
            setSelectedFloor(0);
            setRooms([]);
            setSelectedRoom(0);
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    /**
     * ดึงห้องตาม floorId ที่เลือก
     * Backend: GET /room/filter?floorId={id}
     */
    const fetchRooms = async () => {
        if (!selectedFloor || selectedFloor === 0) {
            setRooms([]);
            setSelectedRoom(0);
            return;
        }
        try {
            const data = await api.room.getByFloor(selectedFloor);
            setRooms(data);
            // Reset room selection when floor changes
            setSelectedRoom(0);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const data = await api.department.getAll();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await api.role.filter();
            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            setRoles([]);
        }
    };

    const addBorrowItem = () => {
        setBorrowItems([
            ...borrowItems,
            {
                searchValue: '',
                equipmentId: 0,
                equipmentName: '',
                brand: '',
                model: '',
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
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };
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

        if (selectedBuilding === 0 || selectedFloor === 0 || selectedRoom === 0) {
            return 'กรุณาเลือกสถานที่ (ตึก, ชั้น, ห้อง)';
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
            item => !item.searchValue.trim() || !item.equipmentId || item.equipmentId === 0 || !item.equipmentName.trim()
        );
        if (hasInvalidItems) {
            return 'กรุณาค้นหาอุปกรณ์ให้ครบทุกรายการ (ต้องพบอุปกรณ์ที่ตรงกับ License Key หรือ Serial Number)';
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate ข้อมูลผู้ยืมและสถานที่
            if (!borrowerFirstName.trim() || !borrowerLastName.trim()) {
                alert('กรุณากรอกชื่อและนามสกุล');
                setLoading(false);
                return;
            }
            if (!borrowerPhone.trim()) {
                alert('กรุณากรอกเบอร์โทรศัพท์');
                setLoading(false);
                return;
            }
            if (!borrowerRole) {
                alert('กรุณาเลือกตำแหน่ง');
                setLoading(false);
                return;
            }
            if (!selectedDepartment || selectedDepartment === 0) {
                alert('กรุณาเลือกแผนก');
                setLoading(false);
                return;
            }
            if (!selectedBuilding || selectedBuilding === 0) {
                alert('กรุณาเลือกตึก');
                setLoading(false);
                return;
            }
            if (!selectedFloor || selectedFloor === 0) {
                alert('กรุณาเลือกชั้น');
                setLoading(false);
                return;
            }
            if (!selectedRoom || selectedRoom === 0) {
                alert('กรุณาเลือกห้อง');
                setLoading(false);
                return;
            }
            if (!approverName.trim()) {
                alert('กรุณากรอกชื่อผู้อนุมัติ');
                setLoading(false);
                return;
            }

            // หา roleId จาก roleName
            const selectedRole = roles.find(r => r.roleName === borrowerRole);
            if (!selectedRole) {
                alert('ไม่พบตำแหน่งที่เลือก');
                setLoading(false);
                return;
            }

            // สร้าง employee ผ่าน API
            // Backend endpoint: POST /employee
            const employeeData: Partial<Employee> = {
                firstName: borrowerFirstName.trim(),
                lastName: borrowerLastName.trim(),
                email: borrowerEmail.trim() || undefined,
                phone: borrowerPhone.trim(),
                description: null,
                roleId: selectedRole.id,
                departmentId: selectedDepartment,
            };

            console.log('📤 Creating employee:', employeeData);
            
            // เรียก API เพื่อสร้าง employee
            const employee = await api.employee.create(employeeData);
            console.log('✅ Employee created successfully:', employee);

            if (!employee || !employee.id) {
                throw new Error('ไม่ได้รับข้อมูล employee หลังจากสร้าง');
            }

            // เก็บแค่ employeeId ไปหน้า borrow (ผ่าน sessionStorage)
            // หน้า borrow/page.tsx จะดึง employeeId นี้ไปดึงข้อมูล employee มาแสดง
            const borrowData = {
                employeeId: employee.id,
            };

            console.log('📦 Storing borrow data:', borrowData);
            
            // ตรวจสอบว่า sessionStorage ทำงานได้
            try {
                sessionStorage.setItem('borrowData', JSON.stringify(borrowData));
                const stored = sessionStorage.getItem('borrowData');
                console.log('✅ Stored in sessionStorage:', stored);
                
                if (!stored) {
                    throw new Error('Failed to store data in sessionStorage');
                }
                
                // รอสักครู่เพื่อให้แน่ใจว่า sessionStorage ถูก set แล้ว
                await new Promise(resolve => setTimeout(resolve, 50));
                
                // ไปหน้า borrow
                console.log('🚀 Navigating to borrow page');
                router.push(ROUTES.BORROW);
            } catch (storageError) {
                console.error('❌ SessionStorage error:', storageError);
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองอีกครั้ง');
                setLoading(false);
                return;
            }
        } catch (error: any) {
            console.error('❌ Error creating employee:', error);
            
            // แสดง error message ที่ชัดเจน
            let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
            if (error.message) {
                errorMessage = error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            alert(`❌ ${errorMessage}\n\nกรุณาตรวจสอบ:\n- ข้อมูลที่กรอกครบถ้วนหรือไม่\n- อีเมลซ้ำกับที่มีอยู่แล้วหรือไม่\n- API backend ทำงานปกติหรือไม่`);
        } finally {
            setLoading(false);
        }
    };

    return {
        // State
        loading,
        buildings,
        floors,
        rooms,
        departments,
        roles,
        borrowerRole,
        selectedDepartment,
        selectedBuilding,
        selectedFloor,
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
        setSelectedFloor,
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
        searchEquipment,
        handleSubmit,
    };
}

