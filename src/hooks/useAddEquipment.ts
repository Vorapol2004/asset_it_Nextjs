import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {lot} from "@/lib/api/lot/lot";
import { api } from '@/lib/api';
import { API_URL } from '@/lib/config';
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
    const [error] = useState<string | null>(null);
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
                const res = await fetch(`${API_URL}/equipment_type/type`);
                const equipmentTypesData = await res.json();
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

    // เพิ่มรายการอุปกรณ์ใหม่
    const addItem = () => {
        setItems([
            ...items,
            {
                id: Date.now().toString(),
                equipmentName: '',
                brand: '',
                model: '',
                serialNumber: '',
                licenseKey: '',
                type: 'hardware',
                description: ''
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
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
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

        return null;
    };

    
    //เตรียมข้อมูลสำหรับส่ง Backend
    
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

    
    // บันทึกข้อมูลอุปกรณ์
    
    const submitEquipment = async () => {
        // Validate
        const validationError = validateData();
        if (validationError) {
            return false;
        }

        setLoading(true);
        setSuccess(false);

        try {
            // เตรียมข้อมูล
            const lotData = prepareSubmitData();
            console.log('🚀 Sending data to API:', lotData);
            const result = await lot.create(lotData);
            console.log('✅ API Response:', result);
            setSuccess(true);

            // Redirect หลัง 1.5 วินาที
            setTimeout(() => {
                router.push('/pages/equipment');
            }, 1500);

            return true;

        } catch (err: any) {
            console.error('❌ Error adding equipment:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };


    //รีเซ็ตฟอร์ม

    const resetForm = () => {
        setLotName('');
        setAcademicYear('');
        setPurchaseDate('');
        setExpireDate('');
        setReferenceDoc('');
        setLotDescription('');
        setLotTypeId(lotTypes[0]?.id || 0);
        setItems([
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
        setSuccess(false);
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

    // ==================== Return ====================

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
        resetForm,
        cancel,
    };
}