import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {lot} from "@/lib/api/lot/lot";
import { api } from '@/lib/api';
import { ROUTES } from '@/constants/routes';
// ==================== Types ====================

export interface EquipmentItem {
    id: string;
    equipmentName: string;
    brand: string;
    model: string;
    serialNumber: string;
    licenseKey: string;
    type: 'hardware' | 'license';
    description: string;
    duplicateError?: string; // Error message สำหรับ duplicate
}

// ==================== Custom Hook ====================

/**
 * Custom Hook สำหรับจัดการการเพิ่มอุปกรณ์
 */
export function useAddEquipment() {
    const router = useRouter();

    // ==================== State ====================

    // Loading & Error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // ✅ Dropdown data สำหรับ add_equipment
    const [lotTypes, setLotTypes] = useState<{ id: number; lotTypeName: string }[]>([]);
    const [equipmentTypes, setEquipmentTypes] = useState<{ id: number; equipmentTypeName: string }[]>([]);

    // ✅ โหลดข้อมูล dropdown เมื่อ component mount
    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                // ดึง Lot Types
                const lotTypesData = await api.lot.getTypes();
                if (Array.isArray(lotTypesData)) {
                    setLotTypes(lotTypesData);
                } else {
                    setLotTypes([]);
                }

                // ดึง Equipment Types
                const equipmentTypesData = await api.equipment.getTypes();
                if (Array.isArray(equipmentTypesData)) {
                    setEquipmentTypes(equipmentTypesData);
                } else {
                    setEquipmentTypes([]);
                }
            } catch (err) {
                console.error('Error loading dropdown data:', err);
                setLotTypes([]);
                setEquipmentTypes([]);
            }
        };

        loadDropdownData();
    }, []);

    // Lot Information
    const [lotName, setLotName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [referenceDoc, setReferenceDoc] = useState('');
    const [lotDescription, setLotDescription] = useState('');
    const [lotTypeId, setLotTypeId] = useState<number>(0);

    // Set default lotTypeId when lotTypes loaded
    useEffect(() => {
        if (lotTypes.length > 0 && lotTypeId === 0) {
            setLotTypeId(lotTypes[0].id);
        }
    }, [lotTypes, lotTypeId]);

    // ตรวจสอบว่า expireDate ต้องหลัง purchaseDate
    useEffect(() => {
        if (purchaseDate && expireDate) {
            const purchase = new Date(purchaseDate);
            const expire = new Date(expireDate);
            if (expire <= purchase) {
                setExpireDate(''); // Reset expireDate ถ้าน้อยกว่าหรือเท่ากับ purchaseDate
            }
        }
    }, [purchaseDate, expireDate]);


    // Equipment Items เป็นตัวแรกตอน fetch หน้ามาเพราะถ้าเราไม่มีค่าตรงนี้ก็จะไม่มีให้กรอกลายละเอียดอุปกรณ์
    const [items, setItems] = useState<EquipmentItem[]>([
        {
            id: '1',
            equipmentName: '',
            brand: '',
            model: '',
            serialNumber: '',
            licenseKey: '',
            type: 'hardware',
            description: ''
        }
    ]);

    // เพิ่มรายการอุปกรณ์ใหม่ (auto-fill ชื่ออุปกรณ์, ยี่ห้อ, รุ่น จากรายการแรก)
    const addItem = () => {
        // ดึงข้อมูลจากรายการแรก (index 0) เพื่อ auto-fill
        const firstItem = items[0];
        
        setItems([
            ...items,
            {
                id: Date.now().toString(),
                equipmentName: firstItem?.equipmentName || '',
                brand: firstItem?.brand || '',
                model: firstItem?.model || '',
                serialNumber: '', // ไม่ auto-fill เพราะแต่ละอุปกรณ์มี Serial Number ไม่เหมือนกัน
                licenseKey: '', // ไม่ auto-fill เพราะแต่ละอุปกรณ์มี License Key ไม่เหมือนกัน
                type: firstItem?.type || 'hardware', // auto-fill type จากรายการแรก
                description: firstItem?.description || '' // auto-fill description จากรายการแรก
            }
        ]);
    };

    // ลบรายการอุปกรณ์
    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };
    
    // อัปเดตข้อมูลรายการอุปกรณ์
    const updateItem = (id: string, field: keyof EquipmentItem, value: string) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.id === id ? { ...item, [field]: value, duplicateError: undefined } : item
            );
            
            // ตรวจสอบ duplicate หลังจากอัปเดต
            return updatedItems.map(item => {
                if (item.id === id) {
                    // เช็ค duplicate สำหรับรายการที่เพิ่งอัปเดต
                    let duplicateError: string | undefined = undefined;
                    
                    if (field === 'serialNumber' && value.trim()) {
                        // เช็ค serialNumber ซ้ำ (เฉพาะ hardware)
                        const duplicateSerial = updatedItems.find(
                            other => other.id !== id && 
                            other.type === 'hardware' && 
                            other.serialNumber.trim() && 
                            other.serialNumber.trim().toLowerCase() === value.trim().toLowerCase()
                        );
                        if (duplicateSerial) {
                            duplicateError = 'Serial Number นี้ถูกใช้ในรายการอื่นแล้ว';
                        }
                    } else if (field === 'licenseKey' && value.trim()) {
                        // เช็ค licenseKey ซ้ำ (เฉพาะ license)
                        const duplicateLicense = updatedItems.find(
                            other => other.id !== id && 
                            other.type === 'license' && 
                            other.licenseKey.trim() && 
                            other.licenseKey.trim().toLowerCase() === value.trim().toLowerCase()
                        );
                        if (duplicateLicense) {
                            duplicateError = 'License Key นี้ถูกใช้ในรายการอื่นแล้ว';
                        }
                    }
                    
                    return { ...item, duplicateError };
                }
                return item;
            });
        });
    };

    // Validate ข้อมูลก่อนส่ง
    
    const validateData = (): string | null => {
        // เช็ค Lot Information
        if (!lotName.trim()) {
            return 'กรุณากรอกชื่อ LOT';
        }
        if (!purchaseDate) {
            return 'กรุณาเลือกวันที่จัดซื้อ';
        }

        // เช็ค Equipment Items
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (!item.equipmentName.trim()) {
                return `รายการที่ ${i + 1}: กรุณากรอกชื่ออุปกรณ์`;
            }

            if (item.type === 'hardware' && !item.serialNumber.trim()) {
                return `รายการที่ ${i + 1}: Hardware ต้องมี Serial Number`;
            }

            if (item.type === 'license' && !item.licenseKey.trim()) {
                return `รายการที่ ${i + 1}: License ต้องมี License Key`;
            }
        }

        // เช็ค duplicate Serial Number และ License Key
        const serialNumbers = items
            .filter(item => item.type === 'hardware' && item.serialNumber.trim())
            .map(item => item.serialNumber.trim().toLowerCase());
        const uniqueSerialNumbers = new Set(serialNumbers);
        if (serialNumbers.length !== uniqueSerialNumbers.size) {
            return 'พบ Serial Number ที่ซ้ำกัน กรุณาตรวจสอบและแก้ไข';
        }

        const licenseKeys = items
            .filter(item => item.type === 'license' && item.licenseKey.trim())
            .map(item => item.licenseKey.trim().toLowerCase());
        const uniqueLicenseKeys = new Set(licenseKeys);
        if (licenseKeys.length !== uniqueLicenseKeys.size) {
            return 'พบ License Key ที่ซ้ำกัน กรุณาตรวจสอบและแก้ไข';
        }

        return null;
    };

    const prepareSubmitData = () => {
        return {
            lotName: lotName.trim(),
            academicYear: academicYear.trim() || null,
            purchaseDate: purchaseDate,
            expireDate: expireDate || null,
            referenceDoc: referenceDoc.trim() || null,
            description: lotDescription.trim() || null,
            lotTypeId: lotTypeId,
            // ✅ เปลี่ยนชื่อ field จาก items → equipmentList
            equipmentList: items.map(item => ({
                equipmentName: item.equipmentName.trim(),
                brand: item.brand.trim() || null,
                model: item.model.trim() || null,
                serialNumber: item.type === 'hardware' ? item.serialNumber.trim() : null,
                licenseKey: item.type === 'license' ? item.licenseKey.trim() : null,
                equipmentTypeId: item.type === 'hardware' ? 2 : 1, // 2=Hardware, 1=License
                equipmentStatusId: 1, // Default = Available
            })),
        };
    };

    const submitEquipment = async () => {
        // Clear previous errors
        setError(null);
        setSuccess(false);

        // Validate
        const validationError = validateData();
        if (validationError) {
            setError(validationError);
            return false;
        }

        setLoading(true);

        try {
            // เตรียมข้อมูล
            const lotData = prepareSubmitData();
            const result = await lot.create(lotData);
            setSuccess(true);

            // Redirect หลัง 1.5 วินาที
            setTimeout(() => {
                router.push(ROUTES.EQUIPMENT);
            }, 1500);

            return true;

        } catch (err: any) {
            console.error('❌ Error adding equipment:', err);
            const errorMessage = err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ยกเลิกและกลับหน้าเดิม
    const cancel = () => {
        if (loading) return;

        // ถ้ามีข้อมูลในฟอร์ม → ถามก่อน
        const hasData = lotName || items.some(item => item.equipmentName);
        if (hasData) {
            const confirm = window.confirm('คุณมีข้อมูลที่ยังไม่ได้บันทึก ต้องการยกเลิกหรือไม่?');
            if (!confirm) return;
        }

        router.back();
    };

    return {
        // State
        loading,
        error,
        success,
        
        // Dropdown Data
        lotTypes,
        equipmentTypes,

        // Lot Information
        lotName,
        setLotName,
        academicYear,
        setAcademicYear,
        purchaseDate,
        setPurchaseDate,
        expireDate,
        setExpireDate,
        referenceDoc,
        setReferenceDoc,
        lotDescription,
        setLotDescription,
        lotTypeId,
        setLotTypeId,

        // Equipment Items
        items,

        // Functions
        addItem,
        removeItem,
        updateItem,
        submitEquipment,
        cancel,
        setError,
    };
}