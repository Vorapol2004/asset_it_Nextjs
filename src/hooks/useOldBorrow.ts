import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { EmployeeView } from '@/types/type';
import { ROUTES } from '@/constants/routes';

export function useOldBorrow() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState<EmployeeView[]>([]); // เก็บข้อมูล employee ทั้งหมดเมื่อโหลด
    const [filteredBorrowers, setFilteredBorrowers] = useState<EmployeeView[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPreviousBorrowers();
    }, []);

    // Search employees using API with debounce
    useEffect(() => {
        const searchEmployees = async () => {
            if (searchTerm.trim() === '') {
                // ถ้า search ว่าง ให้ใช้ข้อมูลที่มีอยู่แล้ว (ไม่ต้องเรียก API ซ้ำ)
                setFilteredBorrowers(employees);
            } else {
                // ใช้ API search
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
        // ใช้ employeeId ตรงๆ ตามที่ backend ส่งมา
        const employeeId = (employee as any).employeeId;
        
        if (!employeeId || employeeId === 0) {
            alert('ไม่พบ ID ของพนักงาน');
            return;
        }
        
        // เก็บ employeeId ไปหน้า borrow
        sessionStorage.setItem('borrowData', JSON.stringify({ employeeId }));
        
        // ไปหน้า borrow
        router.push(ROUTES.BORROW);
    };

    /**
     * ลบ employee
     * @param employee - Employee ที่ต้องการลบ
     */
    const handleDeleteBorrower = async (employee: EmployeeView) => {
        // ยืนยันการลบ
        const confirmed = window.confirm(
            `คุณต้องการลบข้อมูลพนักงาน ${employee.firstName} ${employee.lastName} ใช่หรือไม่?\n\n` +
            `ข้อมูลที่จะถูกลบ:\n` +
            `- อีเมล: ${employee.email}\n` +
            `⚠️ การกระทำนี้ไม่สามารถยกเลิกได้`
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

    return {
        searchTerm,
        filteredBorrowers,
        loading,
        setSearchTerm,
        handleSelectBorrower,
        handleDeleteBorrower,
    };
}

