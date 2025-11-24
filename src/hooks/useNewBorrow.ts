import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Building, Floor, Room, Department, Role, Employee } from '@/types/type';
import { ROUTES } from '@/constants/routes';

export function useNewBorrow() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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

    // Borrower info
    const [borrowerFirstName, setBorrowerFirstName] = useState('');
    const [borrowerLastName, setBorrowerLastName] = useState('');
    const [borrowerEmail, setBorrowerEmail] = useState('');
    const [borrowerPhone, setBorrowerPhone] = useState('');
    const [borrowDate, setBorrowDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [referenceDoc, setReferenceDoc] = useState('');
    const [emailError, setEmailError] = useState<string>('');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);


    useEffect(() => {
        fetchDepartments();
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchBuildings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDepartment]);

    useEffect(() => {
        fetchFloors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBuilding]);

    useEffect(() => {
        fetchRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFloor]);

    // เช็ค email ซ้ำเมื่อมีการเปลี่ยนแปลง
    useEffect(() => {
        // ถ้า email ว่าง ให้ล้าง error และหยุดการเช็ค
        if (!borrowerEmail.trim()) {
            setEmailError('');
            setIsCheckingEmail(false);
            return;
        }

        // เช็ครูปแบบ email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(borrowerEmail.trim())) {
            setEmailError('');
            setIsCheckingEmail(false);
            return;
        }

        // Debounce: รอ 500ms หลังจากผู้ใช้หยุดพิมพ์
        setIsCheckingEmail(true);
        const timeoutId = setTimeout(async () => {
            try {
                const results = await api.employee.search(borrowerEmail.trim());
                // เช็คว่ามี employee ที่มี email ตรงกันหรือไม่
                const duplicate = results.some(emp => 
                    emp.email && emp.email.toLowerCase() === borrowerEmail.trim().toLowerCase()
                );
                
                if (duplicate) {
                    setEmailError('อีเมลนี้มีอยู่ในระบบแล้ว');
                } else {
                    setEmailError('');
                }
            } catch (error) {
                console.error('Error checking email:', error);
                // ไม่แสดง error ถ้าเกิดปัญหาในการเช็ค
                setEmailError('');
            } finally {
                setIsCheckingEmail(false);
            }
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            setIsCheckingEmail(false);
        };
    }, [borrowerEmail]);


    
    const fetchBuildings = async () => {
        if (!selectedDepartment || selectedDepartment === 0) {
            setBuildings([]);
            return;
        }
        try {
            const data = await api.building.filter(selectedDepartment);
            setBuildings(data);
            setSelectedBuilding(0);
            setFloors([]);
            setSelectedFloor(0);
            setRooms([]);
            setSelectedRoom(0);
        } catch (error) {
            console.error('Error fetching buildings:', error);
        }
    };

    
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
            setSelectedFloor(0);
            setRooms([]);
            setSelectedRoom(0);
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    
    const fetchRooms = async () => {
        if (!selectedFloor || selectedFloor === 0) {
            setRooms([]);
            setSelectedRoom(0);
            return;
        }
        try {
            const data = await api.room.getByFloor(selectedFloor);
            setRooms(data);
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

    // Functions สำหรับเพิ่ม/แก้ไข Department, Building, Floor, Room
    const createDepartment = async (data: { departmentName: string }) => {
        const newDept = await api.department.create(data);
        await fetchDepartments(); // Refresh list
        return newDept;
    };

    const updateDepartment = async (id: number, data: { departmentName?: string }) => {
        const updated = await api.department.update(id, data);
        await fetchDepartments(); // Refresh list
        return updated;
    };

    const createBuilding = async (data: { buildingName: string; departmentId: number }) => {
        const newBuilding = await api.building.create(data);
        await fetchBuildings(); // Refresh list
        // Auto-select building ที่เพิ่มใหม่
        if (newBuilding.id) {
            setSelectedBuilding(newBuilding.id);
        }
        return newBuilding;
    };

    const updateBuilding = async (id: number, data: { buildingName?: string; departmentId?: number }) => {
        const updated = await api.building.update(id, data);
        await fetchBuildings(); // Refresh list
        return updated;
    };

    const createFloor = async (data: { floorName: string; buildingId: number }) => {
        const newFloor = await api.floor.create(data);
        await fetchFloors(); // Refresh list
        // Auto-select floor ที่เพิ่มใหม่
        if (newFloor.id) {
            setSelectedFloor(newFloor.id);
        }
        return newFloor;
    };

    const updateFloor = async (id: number, data: { floorName?: string; buildingId?: number }) => {
        const updated = await api.floor.update(id, data);
        await fetchFloors(); // Refresh list
        return updated;
    };

    const createRoom = async (data: { roomName: string; floorId: number }) => {
        const newRoom = await api.room.create(data);
        await fetchRooms(); // Refresh list
        // Auto-select room ที่เพิ่มใหม่
        if (newRoom.id) {
            setSelectedRoom(newRoom.id);
        }
        return newRoom;
    };

    const updateRoom = async (id: number, data: { roomName?: string; floorId?: number }) => {
        const updated = await api.room.update(id, data);
        await fetchRooms(); // Refresh list
        return updated;
    };

    // Delete functions
    const deleteDepartment = async (id: number) => {
        await api.department.delete(id);
        await fetchDepartments(); // Refresh list
        // ถ้าลบแผนกที่เลือกอยู่ ให้ reset
        if (selectedDepartment === id) {
            setSelectedDepartment(0);
            setBuildings([]);
            setSelectedBuilding(0);
            setFloors([]);
            setSelectedFloor(0);
            setRooms([]);
            setSelectedRoom(0);
        }
    };

    const deleteBuilding = async (id: number) => {
        await api.building.delete(id);
        await fetchBuildings(); // Refresh list
        // ถ้าลบตึกที่เลือกอยู่ ให้ reset
        if (selectedBuilding === id) {
            setSelectedBuilding(0);
            setFloors([]);
            setSelectedFloor(0);
            setRooms([]);
            setSelectedRoom(0);
        }
    };

    const deleteFloor = async (id: number) => {
        await api.floor.delete(id);
        await fetchFloors(); // Refresh list
        // ถ้าลบชั้นที่เลือกอยู่ ให้ reset
        if (selectedFloor === id) {
            setSelectedFloor(0);
            setRooms([]);
            setSelectedRoom(0);
        }
    };

    const deleteRoom = async (id: number) => {
        await api.room.delete(id);
        await fetchRooms(); // Refresh list
        // ถ้าลบห้องที่เลือกอยู่ ให้ reset
        if (selectedRoom === id) {
            setSelectedRoom(0);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            
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

            // หา roleId จาก roleName
            const selectedRole = roles.find(r => r.roleName === borrowerRole);
            if (!selectedRole) {
                alert('ไม่พบตำแหน่งที่เลือก');
                setLoading(false);
                return;
            }

            
            const employeeData: Partial<Employee> & { roomId?: number } = {
                firstName: borrowerFirstName.trim(),
                lastName: borrowerLastName.trim(),
                email: borrowerEmail.trim(),
                phone: borrowerPhone.trim(),
                description: null,
                roleId: selectedRole.id,
                departmentId: selectedDepartment,
                ...(selectedRoom && selectedRoom > 0 ? { roomId: selectedRoom } : {}),
            };

            const employee = await api.employee.create(employeeData);

            if (!employee.id || employee.id === 0) {
                throw new Error('ไม่ได้รับข้อมูล employee ID หลังจากสร้าง');
            }
            
            const employeeId = employee.id;

            // เก็บ employeeId ไปหน้า borrow (object to string)
            sessionStorage.setItem('borrowData', JSON.stringify({ employeeId }));
            
            router.push(ROUTES.BORROW);
        } catch (error: unknown) {
            console.error('Error creating employee:', error);
            
            const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
            
            alert(`${errorMessage}\n\nกรุณาตรวจสอบ:\n- ข้อมูลที่กรอกครบถ้วนหรือไม่\n- อีเมลซ้ำกับที่มีอยู่แล้วหรือไม่\n- API backend ทำงานปกติหรือไม่`);
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
        borrowerFirstName,
        borrowerLastName,
        borrowerEmail,
        borrowerPhone,
        borrowDate,
        dueDate,
        referenceDoc,
        emailError,
        isCheckingEmail,

        // Setters
        setBorrowerRole,
        setSelectedDepartment,
        setSelectedBuilding,
        setSelectedFloor,
        setSelectedRoom,
        setBorrowerFirstName,
        setBorrowerLastName,
        setBorrowerEmail,
        setBorrowerPhone,
        setBorrowDate,
        setDueDate,
        setReferenceDoc,

        // Methods
        handleSubmit,

        // CRUD Methods
        createDepartment,
        updateDepartment,
        deleteDepartment,
        createBuilding,
        updateBuilding,
        deleteBuilding,
        createFloor,
        updateFloor,
        deleteFloor,
        createRoom,
        updateRoom,
        deleteRoom,
        fetchDepartments,
        fetchBuildings,
        fetchFloors,
        fetchRooms,
    };
}

