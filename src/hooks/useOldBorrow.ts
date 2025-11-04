import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { BorrowView } from '@/types/type';
import { ROUTES } from '@/constants/routes';

export interface PreviousBorrower {
    id: number; // Unique ID สำหรับ frontend
    borrowId: number; // ID ของ borrow record จาก backend (ใช้สำหรับลบ)
    borrowerFirstName: string;
    borrowerLastName: string;
    borrowerFullName?: string; // เพิ่ม field สำหรับ full name ที่ backend อาจส่งมา
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
    lastBorrowDate: string;
    borrowCount: number;
}

export function useOldBorrow() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [borrowers, setBorrowers] = useState<PreviousBorrower[]>([]);
    const [filteredBorrowers, setFilteredBorrowers] = useState<PreviousBorrower[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPreviousBorrowers();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredBorrowers(borrowers);
        } else {
            // Use local filter for instant results
            const filtered = borrowers.filter(b =>
                b.borrowerFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.borrowerLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.borrowerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.borrowerPhone.includes(searchTerm)
            );
            setFilteredBorrowers(filtered);
        }
    }, [searchTerm, borrowers]);


    /**
     * ดึงรายการผู้ยืมเก่า
     * TODO: เมื่อ backend มี endpoint /borrow/borrowers หรือ /borrow/distinct-borrowers
     * ให้เรียก endpoint นั้นแทน และลบ logic processing ออก
     * 
     * ปัจจุบันต้อง process ใน frontend เพราะ:
     * - Backend ยังไม่มี endpoint สำหรับ distinct borrowers
     * - ต้อง group ตาม firstName + lastName + email
     * - ต้องนับจำนวนครั้งที่ยืม
     */
    const fetchPreviousBorrowers = async () => {
        setLoading(true);
        try {
            const data = await api.oldBorrow.getPreviousBorrowers();
            
            // TODO: Logic นี้ควรย้ายไป backend
            // Process BorrowView[] to get unique borrowers with their latest borrow info
            const borrowerMap = new Map<string, {
                borrow: BorrowView;
                count: number;
            }>();

            data.forEach((borrow, index) => {
                // ใช้ unique key: firstName + lastName + email + borrow.id เพื่อป้องกัน key ซ้ำ
                const key = `${borrow.firstName}_${borrow.lastName}_${borrow.email}_${borrow.id || index}`;
                
                if (!borrowerMap.has(key)) {
                    borrowerMap.set(key, { borrow, count: 1 });
                } else {
                    const existing = borrowerMap.get(key)!;
                    existing.count++;
                    // Keep the most recent borrow
                    if (new Date(borrow.borrowDate) > new Date(existing.borrow.borrowDate)) {
                        existing.borrow = borrow;
                    }
                }
            });

            const processedBorrowers: PreviousBorrower[] = Array.from(borrowerMap.values()).map(({ borrow, count }, index) => {
                // Map ข้อมูลจาก BorrowView
                const borrowAny = borrow as any;
                
                // ใช้ unique ID เพื่อป้องกัน key ซ้ำ
                // ใช้ combination ของ borrow.id, index, และ email เพื่อให้ unique
                const uniqueId = `${borrow.id || 'unknown'}_${index}_${borrow.email || 'noemail'}`;
                
                // Log ข้อมูลที่ได้จาก backend เพื่อ debug
                if (index === 0) {
                    console.log('📋 Sample borrow data:', borrow);
                    console.log('📋 Available fields:', Object.keys(borrow));
                    console.log('📋 First borrower mapped:', {
                        firstName: borrow.firstName,
                        lastName: borrow.lastName,
                        email: borrow.email,
                        phone: borrowAny.phone || borrowAny.borrowerPhone || borrowAny.phoneNumber,
                        role: borrow.roleName,
                    });
                }
                
                // สร้าง unique ID ที่เป็น number (ใช้ hash ของ email + borrow.id + index)
                const idString = `${borrow.id || 0}_${index}_${borrow.email || 'noemail'}`;
                const uniqueIdNumber = idString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000000;
                
                return {
                    id: uniqueIdNumber || index, // Unique ID as number สำหรับ frontend
                    borrowId: borrow.id || 0, // ID ของ borrow record จาก backend (ใช้สำหรับลบ)
                    borrowerFirstName: borrow.firstName || '',
                    borrowerLastName: borrow.lastName || '',
                    borrowerFullName: borrow.employeeName || `${borrow.firstName || ''} ${borrow.lastName || ''}`.trim(), // ใช้ employeeName ถ้ามี
                    borrowerEmail: borrow.email || '',
                    // ตรวจสอบว่ามี phone field หรือไม่
                    borrowerPhone: borrowAny.phone || borrowAny.borrowerPhone || borrowAny.phoneNumber || '', 
                    borrowerRole: borrow.roleName || 'พนักงาน',
                    // ตรวจสอบว่ามี building fields หรือไม่
                    buildingId: borrowAny.buildingId || borrowAny.building_id || 0,
                    buildingName: borrowAny.buildingName || borrowAny.building_name || '',
                    // ตรวจสอบว่ามี room fields หรือไม่
                    roomId: borrowAny.roomId || borrowAny.room_id || 0,
                    roomName: borrowAny.roomName || borrowAny.room_name || '',
                    // ตรวจสอบว่ามี department fields หรือไม่
                    departmentId: borrowAny.departmentId || borrowAny.department_id || 0,
                    departmentName: borrowAny.departmentName || borrowAny.department_name || '',
                    // ตรวจสอบว่ามี approverName หรือไม่
                    approverName: borrowAny.approverName || borrowAny.approver_name || '',
                    lastBorrowDate: borrow.borrowDate || new Date().toISOString(),
                    borrowCount: count
                };
            });

            setBorrowers(processedBorrowers);
            setFilteredBorrowers(processedBorrowers);
        } catch (error) {
            console.error('Error fetching previous borrowers:', error);
            // Fallback to empty array on error
            setBorrowers([]);
            setFilteredBorrowers([]);
        } finally {
            setLoading(false);
        }
    };


    const handleSelectBorrower = async (borrower: PreviousBorrower) => {
        try {
            console.log('🔍 Selecting borrower:', {
                firstName: borrower.borrowerFirstName,
                lastName: borrower.borrowerLastName,
                email: borrower.borrowerEmail
            });

            let employeeId: number | null = null;

            // TODO: เมื่อ backend พร้อม endpoint สำหรับดึง employeeId จาก borrower
            // ให้เปลี่ยนเป็น:
            // const employeeId = await api.borrow.getEmployeeIdByBorrower(borrower.id);
            // หรือ
            // const employee = await api.employee.getByBorrowerId(borrower.id);
            // employeeId = employee.id;

            // ตอนนี้ใช้วิธี search employee จากชื่อ-นามสกุล
            const employees = await api.employee.search(`${borrower.borrowerFirstName} ${borrower.borrowerLastName}`);
            
            console.log('📋 Found employees:', employees.length, employees);
            
            // ตรวจสอบ structure ของ employee แรก
            if (employees.length > 0) {
                console.log('🔍 First employee structure:', {
                    keys: Object.keys(employees[0]),
                    id: employees[0].id,
                    idType: typeof employees[0].id,
                    fullObject: employees[0]
                });
            }

            // หา employee ที่ตรงกับ borrower
            if (employees.length > 0) {
                // หา employee ที่ตรงกับ email หรือชื่อ-นามสกุล
                // ใช้การ match แบบ case-insensitive และ trim whitespace
                const matchedEmployee = employees.find(emp => {
                    const empEmail = (emp.email || '').trim().toLowerCase();
                    const borrowerEmail = (borrower.borrowerEmail || '').trim().toLowerCase();
                    const empFirstName = (emp.firstName || '').trim().toLowerCase();
                    const empLastName = (emp.lastName || '').trim().toLowerCase();
                    const borrowerFirstName = (borrower.borrowerFirstName || '').trim().toLowerCase();
                    const borrowerLastName = (borrower.borrowerLastName || '').trim().toLowerCase();
                    
                    return empEmail === borrowerEmail || 
                           (empFirstName === borrowerFirstName && empLastName === borrowerLastName);
                });
                if (matchedEmployee) {
                    // ตรวจสอบ employee object ทั้งหมด
                    console.log('🔍 Full matchedEmployee object:', matchedEmployee);
                    console.log('🔍 All keys in matchedEmployee:', Object.keys(matchedEmployee));
                    
                    // ลองหา id จากหลาย field ที่อาจเป็นไปได้
                    const rawId = (matchedEmployee as any).id || 
                                 (matchedEmployee as any).employeeId || 
                                 (matchedEmployee as any).employee_id ||
                                 matchedEmployee.id;
                    
                    // ตรวจสอบและแปลง id ให้เป็น number
                    let numId: number | null = null;
                    if (typeof rawId === 'number' && rawId > 0) {
                        numId = rawId;
                    } else if (typeof rawId === 'string') {
                        const parsed = parseInt(rawId, 10);
                        if (!isNaN(parsed) && parsed > 0) {
                            numId = parsed;
                        }
                    }
                    
                    console.log('✅ Found matching employee:', {
                        rawId,
                        numId,
                        firstName: matchedEmployee.firstName,
                        lastName: matchedEmployee.lastName,
                        email: matchedEmployee.email,
                        hasId: !!matchedEmployee.id,
                        idType: typeof matchedEmployee.id,
                        isValid: !!(numId && numId > 0),
                        allFields: Object.keys(matchedEmployee)
                    });
                    
                    if (numId && numId > 0) {
                        employeeId = numId;
                    } else {
                        console.error('⚠️ Employee found but has no valid ID:', {
                            rawId,
                            numId,
                            employee: matchedEmployee,
                            allFields: Object.keys(matchedEmployee),
                            idFields: {
                                id: (matchedEmployee as any).id,
                                employeeId: (matchedEmployee as any).employeeId,
                                employee_id: (matchedEmployee as any).employee_id
                            }
                        });
                        
                        // ลองหาจาก employees ทั้งหมดที่เจอ
                        for (const emp of employees) {
                            const empId = (emp as any).id || (emp as any).employeeId || (emp as any).employee_id;
                            if (empId) {
                                const parsedId = typeof empId === 'number' ? empId : parseInt(String(empId), 10);
                                if (!isNaN(parsedId) && parsedId > 0) {
                                    employeeId = parsedId;
                                    console.log('🔄 Using employee with valid ID:', {
                                        id: parsedId,
                                        firstName: emp.firstName,
                                        lastName: emp.lastName
                                    });
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    // ใช้ตัวแรกถ้าไม่เจอ
                    if (employees[0]) {
                        const firstId = employees[0].id;
                        const firstNumId = typeof firstId === 'number' ? firstId : (typeof firstId === 'string' ? parseInt(firstId, 10) : null);
                        if (firstNumId && firstNumId > 0) {
                            employeeId = firstNumId;
                            console.log('⚠️ Using first employee (no exact match):', {
                                id: firstNumId,
                                firstName: employees[0].firstName,
                                lastName: employees[0].lastName
                            });
                        } else {
                            console.error('⚠️ First employee has invalid ID:', {
                                rawId: firstId,
                                numId: firstNumId,
                                employee: employees[0]
                            });
                        }
                    }
                }
            }

            console.log('🔍 Final employeeId:', employeeId, 'Type:', typeof employeeId);

            if (!employeeId || employeeId === 0 || employeeId === null || employeeId === undefined) {
                console.error('❌ No employee found or invalid employeeId:', {
                    employeeId,
                    type: typeof employeeId,
                    employeesFound: employees.length,
                    borrower: {
                        firstName: borrower.borrowerFirstName,
                        lastName: borrower.borrowerLastName,
                        email: borrower.borrowerEmail
                    }
                });
                alert('ไม่พบข้อมูลพนักงานในระบบ กรุณาเพิ่มข้อมูลใหม่');
                router.push(ROUTES.NEW_EQUIPMENT);
                return;
            }

            // ส่งแค่ employeeId ไปหน้า borrow
            const borrowData = {
                employeeId: employeeId,
            };

            console.log('📤 Storing borrow data in sessionStorage:', borrowData);
            
            // ตรวจสอบว่า sessionStorage ทำงานได้
            try {
                sessionStorage.setItem('borrowData', JSON.stringify(borrowData));
                const stored = sessionStorage.getItem('borrowData');
                console.log('✅ Stored in sessionStorage:', stored);
                
                if (!stored) {
                    throw new Error('Failed to store data in sessionStorage');
                }
            } catch (storageError) {
                console.error('❌ SessionStorage error:', storageError);
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองอีกครั้ง');
                return;
            }

            // รอสักครู่เพื่อให้แน่ใจว่า sessionStorage ถูก set แล้ว
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // ไปหน้า borrow
            console.log('🚀 Navigating to borrow page');
            router.push(ROUTES.BORROW);
        } catch (error: any) {
            console.error('❌ Error in handleSelectBorrower:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                borrower: borrower
            });
            alert(`เกิดข้อผิดพลาดในการค้นหาข้อมูลพนักงาน: ${error.message || 'Unknown error'}`);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    /**
     * ลบ borrow record
     * @param borrower - Borrower ที่ต้องการลบ
     */
    const handleDeleteBorrower = async (borrower: PreviousBorrower) => {
        // ยืนยันการลบ
        const confirmed = window.confirm(
            `คุณต้องการลบข้อมูลการยืมของ ${borrower.borrowerFirstName} ${borrower.borrowerLastName} ใช่หรือไม่?\n\n` +
            `ข้อมูลที่จะถูกลบ:\n` +
            `- อีเมล: ${borrower.borrowerEmail}\n` +
            `- จำนวนครั้งที่ยืม: ${borrower.borrowCount} ครั้ง\n\n` +
            `⚠️ การกระทำนี้ไม่สามารถยกเลิกได้`
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            
            // ลบ borrow record จาก backend
            // ใช้ borrowId ที่เก็บไว้ใน borrower object
            if (borrower.borrowId && borrower.borrowId > 0) {
                await api.oldBorrow.deleteBorrow(borrower.borrowId);
                console.log('✅ Borrow record deleted successfully:', borrower.borrowId);
            } else {
                throw new Error('ไม่พบ borrowId ที่ถูกต้อง');
            }

            // ลบออกจาก state
            setBorrowers(prev => prev.filter(b => b.id !== borrower.id));
            setFilteredBorrowers(prev => prev.filter(b => b.id !== borrower.id));

            alert('ลบข้อมูลการยืมเรียบร้อยแล้ว');
        } catch (error: any) {
            console.error('❌ Error deleting borrow:', error);
            alert(`เกิดข้อผิดพลาดในการลบข้อมูล: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        searchTerm,
        borrowers,
        filteredBorrowers,
        loading,
        setSearchTerm,
        handleSelectBorrower,
        handleDeleteBorrower,
        formatDate,
    };
}

