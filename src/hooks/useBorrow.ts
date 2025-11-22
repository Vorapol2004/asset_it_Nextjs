import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { BorrowCreateData, EmployeeView } from '@/types/type';
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

    // ตรวจสอบว่า dueDate ต้องหลัง borrowDate
    useEffect(() => {
        if (borrowDate && dueDate) {
            const borrow = new Date(borrowDate);
            const due = new Date(dueDate);
            if (due <= borrow) {
                setDueDate(''); // Reset dueDate ถ้าน้อยกว่าหรือเท่ากับ borrowDate
            }
        }
    }, [borrowDate, dueDate]);

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
            //String to Object เก็บไว้ในตัวแปร data
            const data: BorrowPageData = JSON.parse(borrowDataStr);
            
            //ฝากข้อมูลไว้ใน state employeeId
            if (data.employeeId && data.employeeId > 0) {
                setEmployeeId(data.employeeId);
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

    // ใช้ EmployeeId ดึงข้อมูล Employee
    useEffect(() => {
        const fetchEmployee = async () => {
            if (employeeId > 0) {
                setEmployeeLoading(true);
                try {
                    const employeeData = await api.employee.selectEmployee(employeeId);
                    setEmployee(employeeData);
                    // ลบข้อมูลออกจาก sessionStorage หลังจากดึงข้อมูล employee สำเร็จแล้ว
                    sessionStorage.removeItem('borrowData');
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
                
                // เช็คว่าอุปกรณ์นี้ถูกเพิ่มในรายการอื่นแล้วหรือไม่ (เช็คที่หน้าบ้าน)
                setBorrowItems(prev => {
                    // เช็คว่า equipmentId นี้มีอยู่ในรายการอื่นแล้วหรือไม่ (ยกเว้นรายการปัจจุบัน)
                    const isDuplicate = prev.some((item, index) => 
                        index !== itemIndex && 
                        item.equipmentId > 0 && 
                        item.equipmentId === equipment.id
                    );
                    
                    if (isDuplicate) {
                        // อุปกรณ์ซ้ำ - แสดง error
                        const newItems = [...prev];
                        newItems[itemIndex] = {
                            searchValue: searchValue,
                            equipmentId: 0,
                            equipmentName: '',
                            brand: '',
                            model: '',
                            notes: newItems[itemIndex].notes,
                            searchError: 'อุปกรณ์นี้ถูกเพิ่มในรายการแล้ว ไม่สามารถเพิ่มซ้ำได้'
                        };
                        return newItems;
                    } else {
                        // ไม่ซ้ำ - auto-fill ข้อมูล
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
                    }
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

    //ถ้าอุปกรณ์มีมากกว่า 1 ชิ้นจะอนุญาติให้ลบได้
    const removeBorrowItem = (index: number) => {
        if (borrowItems.length > 1) {
            setBorrowItems(borrowItems.filter((_, i) => i !== index));
            //สร้าง array ใหม่ที่ตัด element ตำแหน่ง index ทิ้ง
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

            // เช็คอุปกรณ์ซ้ำอีกครั้งก่อนส่ง (validation ที่หน้าบ้าน - backup check)
            const equipmentIds = borrowItems
                .filter(item => item.equipmentId && item.equipmentId > 0)
                .map(item => item.equipmentId);
            const uniqueEquipmentIds = new Set(equipmentIds);
            if (equipmentIds.length !== uniqueEquipmentIds.size) {
                alert('พบอุปกรณ์ที่ซ้ำกันในรายการ กรุณาลบรายการที่ซ้ำออก');
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
        } catch (error: unknown) {
            console.error('Error submitting borrow:', error);
            const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
            alert(errorMessage);
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

