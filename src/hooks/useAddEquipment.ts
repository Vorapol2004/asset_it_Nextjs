import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

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

interface LotType {
    id: number;
    lotTypeName: string;
}

interface LotData {
    lotName: string;
    academicYear: string;
    purchaseDate: string;
    expireDate: string;
    referenceDoc: string;
    lotDescription: string;
    lotTypeId: number;
    items: EquipmentItem[];
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

    // Lot Types (Master Data)
    const [lotTypes, setLotTypes] = useState<LotType[]>([]);

    // Lot Information
    const [lotName, setLotName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [referenceDoc, setReferenceDoc] = useState('');
    const [lotDescription, setLotDescription] = useState('');
    const [lotTypeId, setLotTypeId] = useState<number>(1);

    // Equipment Items
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

    // ==================== Functions ====================

    /**
     * ดึง Lot Types จาก Backend
     */
    const fetchLotTypes = async () => {
        try {
            const data = await api.lot.getTypes();
            setLotTypes(data);
            if (data.length > 0) {
                setLotTypeId(data[0].id);
            }
        } catch (err) {
            console.error('Error fetching lot types:', err);
            // Fallback ถ้า API ยังไม่พร้อม
            setLotTypes([
                { id: 1, lotTypeName: 'Purchase' },
                { id: 2, lotTypeName: 'Rent' },
                { id: 3, lotTypeName: 'Borrow' },
                { id: 4, lotTypeName: 'Trial' }
            ]);
        }
    };

    /**
     * เพิ่มรายการอุปกรณ์ใหม่
     */
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

    /**
     * ลบรายการอุปกรณ์
     */
    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    /**
     * อัปเดตข้อมูลรายการอุปกรณ์
     */
    const updateItem = (id: string, field: keyof EquipmentItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    /**
     * Validate ข้อมูลก่อนส่ง
     */
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

        return null; // No error
    };

    /**
     * เตรียมข้อมูลสำหรับส่ง Backend
     */
    const prepareSubmitData = () => {
        return {
            lotName: lotName.trim(),
            academicYear: academicYear.trim() || null,
            purchaseDate: purchaseDate,
            expireDate: expireDate || null,
            referenceDoc: referenceDoc.trim() || null,
            description: lotDescription.trim() || null,
            lotTypeId: lotTypeId,
            items: items.map(item => ({
                equipmentName: item.equipmentName.trim(),
                brand: item.brand.trim() || null,
                model: item.model.trim() || null,
                serialNumber: item.type === 'hardware' ? item.serialNumber.trim() : null,
                licenseKey: item.type === 'license' ? item.licenseKey.trim() : null,
                equipmentTypeId: item.type === 'hardware' ? 2 : 1, // 1=Software/License, 2=Hardware
                equipmentStatusId: 1, // Default = Available
            }))
        };
    };

    /**
     * บันทึกข้อมูลอุปกรณ์
     */
    const submitEquipment = async () => {
        // Validate
        const validationError = validateData();
        if (validationError) {
            setError(validationError);
            return false;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // เตรียมข้อมูล
            const lotData = prepareSubmitData();

            console.log('🚀 Sending data to API:', lotData);

            // เรียก API
            const result = await api.lot.create(lotData);

            console.log('✅ API Response:', result);

            // Success
            setSuccess(true);

            // Redirect หลัง 1.5 วินาที
            setTimeout(() => {
                router.push('/pages/equipment');
            }, 1500);

            return true;

        } catch (err: any) {
            console.error('❌ Error adding equipment:', err);
            setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * รีเซ็ตฟอร์ม
     */
    const resetForm = () => {
        setLotName('');
        setAcademicYear('');
        setPurchaseDate('');
        setExpireDate('');
        setReferenceDoc('');
        setLotDescription('');
        setLotTypeId(lotTypes[0]?.id || 1);
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
        setError(null);
        setSuccess(false);
    };

    /**
     * ยกเลิกและกลับหน้าเดิม
     */
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
        lotTypes,

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
        fetchLotTypes,
        addItem,
        removeItem,
        updateItem,
        submitEquipment,
        resetForm,
        cancel,
        setError, // สำหรับล้าง error
    };
}