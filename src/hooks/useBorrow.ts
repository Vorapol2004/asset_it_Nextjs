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

    // โหลดข้อมูลจาก sessionStorage เมื่อ component mount
    useEffect(() => {
        // ถ้าเช็คแล้ว ให้ skip
        if (hasCheckedStorage.current) {
            return;
        }

        console.log('🔍 Checking sessionStorage for borrowData...');
        
        const checkData = () => {
            // ถ้าเช็คแล้ว ให้ skip
            if (hasCheckedStorage.current || employeeId > 0) {
                return;
            }

            const borrowDataStr = sessionStorage.getItem('borrowData');
            
            if (borrowDataStr) {
                try {
                    console.log('📥 Found borrowData in sessionStorage:', borrowDataStr);
                    const data: BorrowPageData = JSON.parse(borrowDataStr);
                    
                    // ตรวจสอบว่า employeeId ถูกต้อง
                    if (!data.employeeId || data.employeeId === 0) {
                        console.error('❌ Invalid employeeId:', data);
                        hasCheckedStorage.current = true;
                        alert('ไม่พบข้อมูลผู้ยืม กรุณาเริ่มใหม่');
                        sessionStorage.removeItem('borrowData');
                        router.push(ROUTES.NEW_EQUIPMENT);
                        return;
                    }

                    setEmployeeId(data.employeeId);
                    hasCheckedStorage.current = true;
                    console.log('✅ Loaded borrow data successfully:', data);
                    
                    // ลบข้อมูลออกจาก sessionStorage หลังจากโหลดแล้ว
                    sessionStorage.removeItem('borrowData');
                    console.log('🗑️ Removed borrowData from sessionStorage');
                } catch (error) {
                    console.error('❌ Error parsing borrow data:', error);
                    console.error('Raw data:', borrowDataStr);
                    hasCheckedStorage.current = true;
                    sessionStorage.removeItem('borrowData');
                    alert('เกิดข้อผิดพลาดในการอ่านข้อมูล กรุณาเริ่มใหม่');
                    router.push(ROUTES.NEW_EQUIPMENT);
                }
            } else {
                // ถ้าไม่มีข้อมูลให้ redirect (แต่ต้องแน่ใจว่าไม่ได้ redirect ไปแล้ว)
                if (!hasCheckedStorage.current) {
                    console.warn('⚠️ No borrowData found in sessionStorage');
                    hasCheckedStorage.current = true;
                    router.push(ROUTES.NEW_EQUIPMENT);
                }
            }
        };

        // ตรวจสอบทันที
        checkData();
        
        // ตรวจสอบอีกครั้งหลังจาก 200ms (กรณี race condition)
        const timeoutId = setTimeout(() => {
            if (!hasCheckedStorage.current && employeeId === 0) {
                checkData();
            }
        }, 200);

        return () => {
            clearTimeout(timeoutId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ทำงานแค่ครั้งเดียวเมื่อ component mount

    // ดึงข้อมูล employee เมื่อ employeeId มีค่า
    // Backend endpoint: GET /employee/{id}
    useEffect(() => {
        const fetchEmployee = async () => {
            if (employeeId && employeeId > 0) {
                setEmployeeLoading(true);
                try {
                    const employeeData = await api.employee.getById(employeeId);
                    setEmployee(employeeData);
                    console.log('✅ Employee data loaded:', employeeData);
                } catch (error) {
                    console.error('❌ Error fetching employee:', error);
                } finally {
                    setEmployeeLoading(false);
                }
            }
        };

        fetchEmployee();
    }, [employeeId]);

    // ดึงข้อมูล location จาก employee (ถ้า employee มี departmentId)
    useEffect(() => {
        const fetchLocationData = async () => {
            if (employee && employee.departmentId) {
                setLocationLoading(true);
                try {
                    // ดึงข้อมูล department
                    const departments = await api.department.getAll();
                    const departmentData = departments.find(d => d.id === employee.departmentId);
                    setDepartment(departmentData || null);

                    // ถ้ามี department ให้ดึง buildings
                    if (departmentData) {
                        const buildings = await api.building.filter(departmentData.id);
                        // ใช้ building แรก (หรืออาจจะต้องเก็บ buildingId ใน employee)
                        if (buildings.length > 0) {
                            const buildingData = buildings[0];
                            setBuilding(buildingData);

                            // ดึง floors
                            const floors = await api.floor.getByBuilding(buildingData.id);
                            if (floors.length > 0) {
                                const floorData = floors[0];
                                setFloor(floorData);

                                // ดึง rooms
                                const rooms = await api.room.getByFloor(floorData.id);
                                if (rooms.length > 0) {
                                    setRoom(rooms[0]);
                                }
                            }
                        }
                    }
                    
                    console.log('✅ Location data loaded from employee');
                } catch (error) {
                    console.error('❌ Error fetching location data:', error);
                } finally {
                    setLocationLoading(false);
                }
            }
        };

        fetchLocationData();
    }, [employee]);

    /**
     * ค้นหาอุปกรณ์ด้วย keyword (licensekey หรือ serialnumber)
     * Backend: GET /equipment/identifier?keyword={value}
     */
    const searchEquipment = async (itemIndex: number, searchValue: string) => {
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
                        notes: newItems[itemIndex].notes
                    };
                    return newItems;
                });
            } else if (data.length === 1) {
                // เจออุปกรณ์เดียว - auto-fill
                const equipment = data[0];
                setBorrowItems(prev => {
                    const newItems = [...prev];
                    newItems[itemIndex] = {
                        searchValue: searchValue,
                        equipmentId: equipment.id,
                        equipmentName: equipment.equipmentName || '',
                        brand: equipment.brand || '',
                        model: equipment.model || '',
                        notes: newItems[itemIndex].notes
                    };
                    return newItems;
                });
            } else {
                // เจอหลายตัว - ใช้ตัวแรก
                const equipment = data[0];
                setBorrowItems(prev => {
                    const newItems = [...prev];
                    newItems[itemIndex] = {
                        searchValue: searchValue,
                        equipmentId: equipment.id,
                        equipmentName: equipment.equipmentName || '',
                        brand: equipment.brand || '',
                        model: equipment.model || '',
                        notes: newItems[itemIndex].notes
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
                    notes: newItems[itemIndex].notes
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
                [field]: value
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
                router.push(ROUTES.NEW_EQUIPMENT);
                setLoading(false);
                return;
            }

            // สร้าง borrow data ตามรูปแบบที่ backend ต้องการ
            // Backend endpoint: POST /borrow/create
            // Request format:
            // {
            //   "employeeId": Integer,
            //   "referenceDoc": String (optional, nullable),
            //   "borrowDate": "YYYY-MM-DD" (LocalDate),
            //   "dueDate": "YYYY-MM-DD" (LocalDate),
            //   "equipmentIds": [Integer, Integer, ...]
            // }
            const borrowData: BorrowCreateData = {
                employeeId: employeeId,
                referenceDoc: referenceDoc.trim() || null,
                borrowDate: borrowDate,
                dueDate: dueDate,
                equipmentIds: borrowItems
                    .filter(item => item.equipmentId && item.equipmentId > 0)
                    .map(item => item.equipmentId)
            };

            console.log('📤 Submitting borrow data:', borrowData);

            // ส่งข้อมูลไปยัง backend
            const response = await api.borrow.create(borrowData);
            console.log('Borrow created:', response);

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
        addBorrowItem,
        removeBorrowItem,
        updateBorrowItem,
        searchEquipment,
        handleSubmit,
    };
}

