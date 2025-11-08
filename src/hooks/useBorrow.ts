import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { BorrowCreateData, BorrowItemData, EquipmentView, EmployeeView, Building, Floor, Room, Department } from '@/types/type';
import { ROUTES } from '@/constants/routes';

export interface BorrowItem {
    searchValue: string;
    equipmentId: number;
    equipmentName: string;
    brand: string;
    model: string;
    notes?: string;
    searchError?: string; // ข้อความ error เมื่อค้นหาไม่เจอ
}

export interface BorrowPageData {
    employeeId: number;
}

export function useBorrow() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [borrowDate, setBorrowDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [referenceDoc, setReferenceDoc] = useState('');
    const [approverName, setApproverName] = useState('');
    const [employeeId, setEmployeeId] = useState<number>(0);
    const [employee, setEmployee] = useState<EmployeeView | null>(null);
    const [employeeLoading, setEmployeeLoading] = useState(false);
    const [isLocked] = useState(true); // ข้อมูลผู้ยืมล็อคไว้ไม่ให้แก้ไข
    const hasCheckedStorage = useRef(false); // Flag เพื่อป้องกันการ redirect ซ้ำ
    
    // Location data
    const [building, setBuilding] = useState<Building | null>(null);
    const [floor, setFloor] = useState<Floor | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [department, setDepartment] = useState<Department | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    
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

    // โหลดข้อมูลจาก sessionStorage ตอนโหลดหน้าเสร็จ
    useEffect(() => {
        // ถ้าเช็คแล้ว ให้ skip (ป้องกันการเช็คซ้ำใน React Strict Mode)
        if (hasCheckedStorage.current) {
            return;
        }
        // ตั้งค่าเป็น true เพื่อป้องกันการเช็คซ้ำและปัญหา redirect/race condition
        hasCheckedStorage.current = true;

        const borrowDataStr = sessionStorage.getItem('borrowData');
        
        if (!borrowDataStr) {
            router.push(ROUTES.NEW_BORROW);
            return;
        }

        try {
            //String to Object
            const data: BorrowPageData = JSON.parse(borrowDataStr);
            
            // ตรวจสอบว่า employeeId ถูกต้อง
            if (data.employeeId && data.employeeId > 0) {
                setEmployeeId(data.employeeId);
                // ลบข้อมูลออกจาก sessionStorage หลังจากโหลดแล้ว
                sessionStorage.removeItem('borrowData');
            } else {
                alert('ไม่พบข้อมูลผู้ยืม กรุณาเริ่มใหม่');
                sessionStorage.removeItem('borrowData');
                router.push(ROUTES.NEW_BORROW);
            }
        } catch (error) {
            console.error('Error parsing borrow data:', error);
            sessionStorage.removeItem('borrowData');
            alert('เกิดข้อผิดพลาดในการอ่านข้อมูล กรุณาเริ่มใหม่');
            router.push(ROUTES.NEW_BORROW);
        }
    }, [router]); // ทำงานแค่ครั้งเดียวเมื่อ component mount

    // ดึงข้อมูล employee เมื่อ employeeId มีค่า
    useEffect(() => {
        const fetchEmployee = async () => {
            if (employeeId > 0) {
                setEmployeeLoading(true);
                try {
                    const employeeData = await api.employee.selectEmployee(employeeId);
                    setEmployee(employeeData);
                } catch (error) {
                    console.error('Error fetching employee:', error);
                    alert('ไม่สามารถดึงข้อมูลพนักงานได้ กรุณาลองอีกครั้ง');
                    sessionStorage.removeItem('borrowData');
                    router.push(ROUTES.NEW_BORROW);
                } finally {
                    setEmployeeLoading(false);
                }
            }
        };

        fetchEmployee();
    }, [employeeId, router]);

    // ดึงข้อมูล location จาก employee (ถ้า employee มี departmentId)
    useEffect(() => {
        const fetchLocationData = async () => {
            if (employee && employee.departmentId) {
                setLocationLoading(true);
                try {
                    const departments = await api.department.getAll();
                    const departmentData = departments.find(d => d.id === employee.departmentId);
                    setDepartment(departmentData || null);

                    if (departmentData) {
                        const buildings = await api.building.filter(departmentData.id);
                        if (buildings.length > 0) {
                            const buildingData = buildings[0];
                            setBuilding(buildingData);

                            const floors = await api.floor.getByBuilding(buildingData.id);
                            if (floors.length > 0) {
                                const floorData = floors[0];
                                setFloor(floorData);

                                const rooms = await api.room.getByFloor(floorData.id);
                                if (rooms.length > 0) {
                                    setRoom(rooms[0]);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching location data:', error);
                } finally {
                    setLocationLoading(false);
                }
            }
        };

        fetchLocationData();
    }, [employee]);

  
    const searchEquipment = async (itemIndex: number, searchValue: string) => {
        // ถ้า searchValue ว่าง → ล้างข้อมูลอุปกรณ์ทั้งหมด (ยกเว้น notes)
        if (!searchValue.trim()) {
            setBorrowItems(prev => {
                const newItems = [...prev];
                newItems[itemIndex] = {
                    searchValue: '',
                    equipmentId: 0,
                    equipmentName: '',
                    brand: '',
                    model: '',
                    notes: newItems[itemIndex].notes
                };
                return newItems;
            });
            return;
        }

        try {
            const data = await api.borrow.searchEquipment(searchValue.trim());
            
            if (data.length === 0) {
                // ไม่เจออุปกรณ์
                setBorrowItems(prev => {
                    const newItems = [...prev];
                    newItems[itemIndex] = {
                        searchValue: searchValue,
                        equipmentId: 0,
                        equipmentName: '',
                        brand: '',
                        model: '',
                        notes: newItems[itemIndex].notes,
                        searchError: 'ไม่พบอุปกรณ์ที่ตรงกับ License Key หรือ Serial Number นี้'
                    };
                    return newItems;
                });
            } else {
                // เจออุปกรณ์ - auto-fill
                const equipment = data[0];
                setBorrowItems(prev => {
                    const newItems = [...prev];
                    newItems[itemIndex] = {
                        searchValue: searchValue,
                        equipmentId: equipment.id,
                        equipmentName: equipment.equipmentName || '',
                        brand: equipment.brand || '',
                        model: equipment.model || '',
                        notes: newItems[itemIndex].notes,
                        searchError: undefined // ลบ error เมื่อเจอ
                    };
                    return newItems;
                });
            }
        } catch (error) {
            console.error('Error searching equipment:', error);
            setBorrowItems(prev => {
                const newItems = [...prev];
                newItems[itemIndex] = {
                    searchValue: searchValue,
                    equipmentId: 0,
                    equipmentName: '',
                    brand: '',
                    model: '',
                    notes: newItems[itemIndex].notes,
                    searchError: 'เกิดข้อผิดพลาดในการค้นหา กรุณาลองอีกครั้ง'
                };
                return newItems;
            });
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
            setBorrowItems(borrowItems.filter((_, i) => i !== index));
        }
    };

    const updateBorrowItem = (index: number, field: keyof BorrowItem, value: string) => {
        setBorrowItems(prev => {
            const newItems = [...prev];
            newItems[index] = {
                ...newItems[index],
                [field]: value,
                // ถ้า searchValue ว่าง → จะล้างข้อมูลอุปกรณ์ทั้งหมด (ยกเว้น notes)
                ...(field === 'searchValue' && !value.trim() ? {
                    equipmentId: 0,
                    equipmentName: '',
                    brand: '',
                    model: '',
                    searchError: undefined
                } : {}),
                // ลบ error เมื่อผู้ใช้แก้ไข searchValue
                ...(field === 'searchValue' ? { searchError: undefined } : {})
            };
            return newItems;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate
            if (!borrowDate || !dueDate) {
                alert('กรุณาเลือกวันที่ยืมและวันที่คืน');
                setLoading(false);
                return;
            }

            if (new Date(dueDate) < new Date(borrowDate)) {
                alert('วันที่คืนต้องอยู่หลังวันที่ยืม');
                setLoading(false);
                return;
            }

            if (!approverName.trim()) {
                alert('กรุณากรอกชื่อผู้อนุมัติ');
                setLoading(false);
                return;
            }

            const hasInvalidItems = borrowItems.some(
                item => !item.searchValue.trim() || !item.equipmentId || item.equipmentId === 0
            );
            if (hasInvalidItems) {
                alert('กรุณาค้นหาอุปกรณ์ให้ครบทุกรายการ (ต้องพบอุปกรณ์ที่ตรงกับ License Key หรือ Serial Number)');
                setLoading(false);
                return;
            }

            if (!employeeId || employeeId === 0) {
                alert('ไม่พบข้อมูลผู้ยืม กรุณาเริ่มใหม่');
                router.push(ROUTES.NEW_BORROW);
                setLoading(false);
                return;
            }

            const borrowData: BorrowCreateData = {
                employeeId: employeeId,
                referenceDoc: referenceDoc.trim() || null,
                borrowDate: borrowDate,
                dueDate: dueDate,
                approverName: approverName?.trim() || null,
                equipmentIds: borrowItems
                    .filter(item => item.equipmentId && item.equipmentId > 0)
                    .map(item => item.equipmentId)
            };

            // ส่งข้อมูลไปยัง backend
            await api.borrow.create(borrowData);

            alert('บันทึกการยืมเรียบร้อยแล้ว!');
            router.push(ROUTES.BORROW_EQUIPMENT);
        } catch (error: any) {
            console.error('Error submitting borrow:', error);
            alert(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        borrowDate,
        dueDate,
        referenceDoc,
        approverName,
        borrowItems,
        employeeId,
        employee,
        employeeLoading,
        isLocked,
        building,
        floor,
        room,
        department,
        locationLoading,
        setBorrowDate,
        setDueDate,
        setReferenceDoc,
        setApproverName,
        addBorrowItem,
        removeBorrowItem,
        updateBorrowItem,
        searchEquipment,
        handleSubmit,
    };
}

