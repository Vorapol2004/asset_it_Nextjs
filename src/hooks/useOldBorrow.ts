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
    }, [editFormData.departmentId]);

    useEffect(() => {
        if (editFormData.buildingId > 0) {
            fetchFloors();
        } else {
            setFloors([]);
            setRooms([]);
            setEditFormData(prev => ({ ...prev, floorId: 0, roomId: 0 }));
        }
    }, [editFormData.buildingId]);

    useEffect(() => {
        if (editFormData.floorId > 0) {
            fetchRooms();
        } else {
            setRooms([]);
            setEditFormData(prev => ({ ...prev, roomId: 0 }));
        }
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

    
    const handleDeleteBorrower = async (employee: EmployeeView) => {
        const confirmed = window.confirm(
            `คุณต้องการลบข้อมูลพนักงาน ${employee.firstName} ${employee.lastName} ใช่หรือไม่?\n\n` +
            `ข้อมูลที่จะถูกลบ:\n` +
            `- อีเมล: ${employee.email}\n` +
            `การกระทำนี้ไม่สามารถยกเลิกได้`
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            
            await api.employee.delete(employee.id);

            setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
            setFilteredBorrowers(prev => prev.filter(emp => emp.id !== employee.id));

            alert('ลบข้อมูลพนักงานเรียบร้อยแล้ว');
        } catch (error: any) {
            console.error('Error deleting employee:', error);
            alert(`เกิดข้อผิดพลาดในการลบข้อมูล: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
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
        try {
            // ใช้ข้อมูลที่มีอยู่แล้วใน employees array เพื่อแสดง modal ทันที
            setEditingEmployee(employee);
            
            // ตั้งค่า form data จากข้อมูลที่มีอยู่
            setEditFormData({
                firstName: employee.firstName || '',
                lastName: employee.lastName || '',
                email: employee.email || '',
                phone: employee.phone || '',
                roleId: employee.roleId || 0,
                departmentId: employee.departmentId || 0,
                buildingId: 0,
                floorId: 0,
                roomId: 0, // ต้องหา roomId จาก employeeData ถ้ามี
            });

            // เปิด modal ทันที
            setIsEditModalOpen(true);

            // โหลด buildings ใน background (ถ้ามี departmentId)
            if (employee.departmentId) {
                api.building.filter(employee.departmentId)
                    .then((buildingsData) => {
                        setBuildings(buildingsData);
                    })
                    .catch((error) => {
                        console.error('Error fetching buildings:', error);
                        // ไม่ต้องแสดง error เพราะ buildings เป็น optional field
                    });
            }
        } catch (error: any) {
            console.error('Error opening edit modal:', error);
            alert(`เกิดข้อผิดพลาดในการเปิดฟอร์มแก้ไข: ${error.message || 'Unknown error'}`);
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

            await api.employee.update(editingEmployee.id, updateData);

            // Refresh data
            await fetchPreviousBorrowers();

            // Close modal
            setIsEditModalOpen(false);
            setEditingEmployee(null);

            alert('แก้ไขข้อมูลพนักงานเรียบร้อยแล้ว');
        } catch (error: any) {
            console.error('Error updating employee:', error);
            alert(`เกิดข้อผิดพลาดในการแก้ไขข้อมูล: ${error.message || 'Unknown error'}`);
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
        handleDeleteBorrower,
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

