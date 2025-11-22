import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { EmployeeView, Employee, Department, Role, Building, Floor, Room } from '@/types/type';
import { ROUTES } from '@/constants/routes';

export function useOldBorrow() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState<EmployeeView[]>([]); 
    const [filteredBorrowers, setFilteredBorrowers] = useState<EmployeeView[]>([]);
    const [loading, setLoading] = useState(false);

    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<EmployeeView | null>(null);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        roleId: 0,
        departmentId: 0,
        buildingId: 0,
        floorId: 0,
        roomId: 0,
    });

    // Dropdown data
    const [departments, setDepartments] = useState<Department[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [floors, setFloors] = useState<Floor[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        fetchPreviousBorrowers();
        fetchDepartments();
        fetchRoles();
    }, []);

    useEffect(() => {
        if (editFormData.departmentId > 0) {
            fetchBuildings();
        } else {
            setBuildings([]);
            setFloors([]);
            setRooms([]);
            setEditFormData(prev => ({ ...prev, buildingId: 0, floorId: 0, roomId: 0 }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editFormData.departmentId]);

    useEffect(() => {
        if (editFormData.buildingId > 0) {
            fetchFloors();
        } else {
            setFloors([]);
            setRooms([]);
            setEditFormData(prev => ({ ...prev, floorId: 0, roomId: 0 }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editFormData.buildingId]);

    useEffect(() => {
        if (editFormData.floorId > 0) {
            fetchRooms();
        } else {
            setRooms([]);
            setEditFormData(prev => ({ ...prev, roomId: 0 }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editFormData.floorId]);

    useEffect(() => {
        const searchEmployees = async () => {
            if (searchTerm.trim() === '') {
                // ถ้า search ว่าง ให้ใช้ข้อมูลที่มีอยู่แล้ว (ไม่ต้องเรียก API ซ้ำ)
                setFilteredBorrowers(employees);
            } else {
                setLoading(true);
                try {
                    const searchResults = await api.employee.search(searchTerm.trim());
                    setFilteredBorrowers(searchResults);
                } catch (error) {
                    console.error('Error searching employees:', error);
                    setFilteredBorrowers([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        // Debounce: รอ 300ms หลังผู้ใช้หยุดพิมพ์
        const timeoutId = setTimeout(() => {
            searchEmployees();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, employees]);

    const fetchPreviousBorrowers = async () => {
        setLoading(true);
        try {
            const employeesData = await api.employee.getAll();
            setEmployees(employeesData); // เก็บข้อมูล employee ทั้งหมด
            setFilteredBorrowers(employeesData); // แสดงผลลัพธ์
        } catch (error) {
            console.error('Error fetching employees:', error);
            setEmployees([]);
            setFilteredBorrowers([]);
        } finally {
            setLoading(false);
        }
    };


    const handleSelectBorrower = async (employee: EmployeeView) => {
        
        const employeeId = employee.id || employee.employeeId;
        
        if (!employeeId || employeeId === 0) {
            alert('ไม่พบ ID ของพนักงาน');
            return;
        }
        
        // เก็บ employeeId ไปหน้า borrow
        sessionStorage.setItem('borrowData', JSON.stringify({ employeeId }));
        
        router.push(ROUTES.BORROW);
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
        }
    };

    const fetchBuildings = async () => {
        if (!editFormData.departmentId || editFormData.departmentId === 0) {
            setBuildings([]);
            return;
        }
        try {
            const data = await api.building.filter(editFormData.departmentId);
            setBuildings(data);
        } catch (error) {
            console.error('Error fetching buildings:', error);
        }
    };

    const fetchFloors = async () => {
        if (!editFormData.buildingId || editFormData.buildingId === 0) {
            setFloors([]);
            return;
        }
        try {
            const data = await api.floor.getByBuilding(editFormData.buildingId);
            setFloors(data);
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    const fetchRooms = async () => {
        if (!editFormData.floorId || editFormData.floorId === 0) {
            setRooms([]);
            return;
        }
        try {
            const data = await api.room.getByFloor(editFormData.floorId);
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleEditBorrower = (employee: EmployeeView) => {
        setEditingEmployee(employee);
        
        // ตั้งค่า roleId - รองรับ null
        const roleId = (employee.roleId !== null && employee.roleId !== undefined) ? employee.roleId : 0;
        // ตั้งค่า departmentId
        const departmentId = employee.departmentId || 0;
        
        setEditFormData({
            firstName: employee.firstName || '',
            lastName: employee.lastName || '',
            email: employee.email || '',
            phone: employee.phone || '',
            roleId: roleId,
            departmentId: departmentId,
            buildingId: 0,
            floorId: 0,
            roomId: 0,
        });
        setIsEditModalOpen(true);

        // Fetch buildings, floors, rooms in background
        if (employee.departmentId && employee.departmentId > 0) {
            api.building.filter(employee.departmentId)
                .then(buildingsData => {
                    setBuildings(buildingsData);
                    const employeeBuildingId = buildingsData.find(b => b.buildingName === employee.buildingName)?.id || 0;
                    setEditFormData(prev => ({ ...prev, buildingId: employeeBuildingId }));

                    if (employeeBuildingId > 0 && employee.floorName) {
                        api.floor.getByBuilding(employeeBuildingId)
                            .then(floorsData => {
                                setFloors(floorsData);
                                const employeeFloorId = floorsData.find(f => f.floorName === employee.floorName)?.id || 0;
                                setEditFormData(prev => ({ ...prev, floorId: employeeFloorId }));

                                if (employeeFloorId > 0 && employee.roomName) {
                                    api.room.getByFloor(employeeFloorId)
                                        .then(roomsData => {
                                            setRooms(roomsData);
                                            const employeeRoomId = roomsData.find(r => r.roomName === employee.roomName)?.id || 0;
                                            setEditFormData(prev => ({ ...prev, roomId: employeeRoomId }));
                                        })
                                        .catch(error => console.error('Error fetching rooms in background:', error));
                                }
                            })
                            .catch(error => console.error('Error fetching floors in background:', error));
                    }
                })
                .catch(error => console.error('Error fetching buildings in background:', error));
        }
    };

    const handleUpdateEmployee = async () => {
        if (!editingEmployee) return;

        try {
            setLoading(true);

            // Validation
            if (!editFormData.firstName.trim() || !editFormData.lastName.trim()) {
                alert('กรุณากรอกชื่อและนามสกุล');
                setLoading(false);
                return;
            }
            if (!editFormData.email.trim()) {
                alert('กรุณากรอกอีเมล');
                setLoading(false);
                return;
            }
            if (!editFormData.phone.trim()) {
                alert('กรุณากรอกเบอร์โทรศัพท์');
                setLoading(false);
                return;
            }
            if (!editFormData.roleId || editFormData.roleId === 0) {
                alert('กรุณาเลือกตำแหน่ง');
                setLoading(false);
                return;
            }
            if (!editFormData.departmentId || editFormData.departmentId === 0) {
                alert('กรุณาเลือกแผนก');
                setLoading(false);
                return;
            }

            // ตรวจสอบ employee id
            const employeeId = editingEmployee?.id || editingEmployee?.employeeId;
            if (!employeeId || employeeId === 0) {
                alert('ไม่พบ ID ของพนักงาน กรุณาปิด modal แล้วเปิดใหม่');
                setLoading(false);
                return;
            }

            // สร้าง employee data สำหรับ update
            const updateData: Partial<Employee> & { roomId?: number } = {
                firstName: editFormData.firstName.trim(),
                lastName: editFormData.lastName.trim(),
                email: editFormData.email.trim(),
                phone: editFormData.phone.trim(),
                roleId: editFormData.roleId,
                departmentId: editFormData.departmentId,
                description: null,
                ...(editFormData.roomId && editFormData.roomId > 0 ? { roomId: editFormData.roomId } : {}),
            };

            await api.employee.update(employeeId, updateData);

            // Refresh data
            await fetchPreviousBorrowers();

            // Close modal
            setIsEditModalOpen(false);
            setEditingEmployee(null);

            alert('แก้ไขข้อมูลพนักงานเรียบร้อยแล้ว');
        } catch (error: unknown) {
            console.error('Error updating employee:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`เกิดข้อผิดพลาดในการแก้ไขข้อมูล: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingEmployee(null);
        setEditFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            roleId: 0,
            departmentId: 0,
            buildingId: 0,
            floorId: 0,
            roomId: 0,
        });
        setBuildings([]);
        setFloors([]);
        setRooms([]);
    };

    return {
        searchTerm,
        filteredBorrowers,
        loading,
        setSearchTerm,
        handleSelectBorrower,
        // Edit functionality
        isEditModalOpen,
        editingEmployee,
        editFormData,
        setEditFormData,
        departments,
        roles,
        buildings,
        floors,
        rooms,
        handleEditBorrower,
        handleUpdateEmployee,
        handleCloseEditModal,
    };
}
