import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {lot} from "@/lib/api/lot/lot";
import { api } from '@/lib/api';
import { ROUTES } from '@/constants/routes';
import * as XLSX from 'xlsx';
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
            await lot.create(lotData);
            setSuccess(true);

            // Redirect หลัง 1.5 วินาที
            setTimeout(() => {
                router.push(ROUTES.EQUIPMENT);
            }, 1500);

            return true;

        } catch (err: unknown) {
            console.error('❌ Error adding equipment:', err);
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
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

    // ==================== Excel Import Functions ====================

    /**
     * อ่านไฟล์ Excel และแปลงเป็น EquipmentItem[]
     */
    const importFromExcel = async (file: File): Promise<{ items: EquipmentItem[]; errors: string[] }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const errors: string[] = [];

            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    if (!data) {
                        reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
                        return;
                    }

                    // อ่าน Excel
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    // แปลงเป็น JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                        header: 1,
                        defval: '' // ใช้ค่าว่างแทน undefined
                    }) as unknown[][];

                    if (jsonData.length < 2) {
                        errors.push('ไฟล์ Excel ต้องมี header และข้อมูลอย่างน้อย 1 แถว');
                        resolve({ items: [], errors });
                        return;
                    }

                    // หา header row (แถวแรก)
                    const headerRow = (jsonData[0] || []).map((h: unknown) => String(h || '').trim().toLowerCase());
                    
                    // Map column names (รองรับหลายรูปแบบ)
                    const columnMap: { [key: string]: string } = {
                        'ชื่ออุปกรณ์': 'equipmentName',
                        'ชื่อ': 'equipmentName',
                        'equipmentname': 'equipmentName',
                        'name': 'equipmentName',
                        'ยี่ห้อ': 'brand',
                        'brand': 'brand',
                        'รุ่น': 'model',
                        'model': 'model',
                        'serial number': 'serialNumber',
                        'serialnumber': 'serialNumber',
                        'sn': 'serialNumber',
                        'license key': 'licenseKey',
                        'licensekey': 'licenseKey',
                        'license': 'licenseKey',
                        'key': 'licenseKey',
                        'ประเภท': 'type',
                        'type': 'type',
                    };

                    // สร้าง column index map
                    const columnIndex: { [key: string]: number } = {};
                    headerRow.forEach((header, index) => {
                        const normalizedHeader = header.toLowerCase();
                        for (const [key, value] of Object.entries(columnMap)) {
                            if (normalizedHeader.includes(key.toLowerCase())) {
                                columnIndex[value] = index;
                                break;
                            }
                        }
                    });

                    // แปลงข้อมูลแต่ละแถว
                    const importedItems: EquipmentItem[] = [];
                    for (let i = 1; i < jsonData.length; i++) {
                        const row = jsonData[i];
                        if (!row || row.every((cell: unknown) => !cell || String(cell || '').trim() === '')) {
                            continue; // ข้ามแถวว่าง
                        }

                        // อ่าน equipmentName - ถ้าไม่เจอ column index ลองอ่านจากคอลัมน์แรก
                        let equipmentName = '';
                        if (columnIndex['equipmentName'] !== undefined) {
                            equipmentName = String(row[columnIndex['equipmentName']] || '').trim();
                        } else {
                            // ถ้าไม่เจอ column index ลองอ่านจากคอลัมน์แรก (fallback)
                            equipmentName = String(row[0] || '').trim();
                        }
                        
                        if (!equipmentName) {
                            errors.push(`แถวที่ ${i + 1}: ไม่พบชื่ออุปกรณ์`);
                            continue;
                        }

                        const brand = String(row[columnIndex['brand']] || '').trim();
                        const model = String(row[columnIndex['model']] || '').trim();
                        const serialNumber = String(row[columnIndex['serialNumber']] || '').trim();
                        const licenseKey = String(row[columnIndex['licenseKey']] || '').trim();
                        const typeRaw = String(row[columnIndex['type']] || '').trim().toLowerCase();

                        // กำหนด type (hardware หรือ license)
                        let type: 'hardware' | 'license' = 'hardware';
                        if (typeRaw) {
                            if (typeRaw.includes('license') || typeRaw.includes('software') || typeRaw.includes('ลิขสิทธิ์')) {
                                type = 'license';
                            } else if (typeRaw.includes('hardware') || typeRaw.includes('ฮาร์ดแวร์')) {
                                type = 'hardware';
                            }
                        } else {
                            // ถ้าไม่มี type ให้เดาจากข้อมูลที่มี
                            if (licenseKey && !serialNumber) {
                                type = 'license';
                            } else if (serialNumber && !licenseKey) {
                                type = 'hardware';
                            } else if (licenseKey && serialNumber) {
                                // ถ้ามีทั้งสอง ให้ดูจาก type column หรือ default เป็น hardware
                                type = 'hardware';
                            }
                        }

                        // Validate ตาม type
                        if (type === 'hardware' && !serialNumber) {
                            errors.push(`แถวที่ ${i + 1}: Hardware ต้องมี Serial Number`);
                        }
                        if (type === 'license' && !licenseKey) {
                            errors.push(`แถวที่ ${i + 1}: License ต้องมี License Key`);
                        }

                        importedItems.push({
                            id: Date.now().toString() + '-' + i,
                            equipmentName,
                            brand,
                            model,
                            serialNumber: type === 'hardware' ? serialNumber : '',
                            licenseKey: type === 'license' ? licenseKey : '',
                            type,
                            description: '', // ไม่มี field description ในหน้าบ้าน
                        });
                    }

                    // ตรวจสอบ required columns หลังจากอ่านข้อมูลเสร็จแล้ว
                    if (importedItems.length === 0) {
                        // ถ้าไม่สามารถอ่านข้อมูลได้เลย
                        if (!columnIndex['equipmentName']) {
                            errors.push('ไม่พบคอลัมน์ "ชื่ออุปกรณ์" ในไฟล์ Excel');
                        } else {
                            errors.push('ไม่พบข้อมูลอุปกรณ์ในไฟล์ Excel');
                        }
                    } else {
                        // ถ้าอ่านข้อมูลได้สำเร็จ แสดงว่าเจอ column แล้ว
                        // ลบ error เรื่อง "ไม่พบคอลัมน์" ออกถ้ามี
                        const columnErrorIndex = errors.findIndex(e => e.includes('ไม่พบคอลัมน์'));
                        if (columnErrorIndex !== -1) {
                            errors.splice(columnErrorIndex, 1);
                        }
                    }

                    resolve({ items: importedItems, errors });

                } catch (err: unknown) {
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                    reject(new Error(`เกิดข้อผิดพลาดในการอ่านไฟล์ Excel: ${errorMessage}`));
                }
            };

            reader.onerror = () => {
                reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
            };

            reader.readAsBinaryString(file);
        });
    };

    /**
     * จัดการการ import จาก Excel
     */
    const handleExcelImport = async (file: File, replaceExisting: boolean = false) => {
        try {
            setError(null);
            setLoading(true);

            const result = await importFromExcel(file);

            if (result.items.length > 0) {
                // ตรวจสอบ duplicate ภายในไฟล์ Excel
                const duplicateErrors: string[] = [];
                const serialNumbers = new Set<string>();
                const licenseKeys = new Set<string>();

                result.items.forEach((item, index) => {
                    if (item.type === 'hardware' && item.serialNumber.trim()) {
                        const serialLower = item.serialNumber.trim().toLowerCase();
                        if (serialNumbers.has(serialLower)) {
                            duplicateErrors.push(`แถวที่ ${index + 2}: Serial Number "${item.serialNumber}" ซ้ำในไฟล์ Excel`);
                        } else {
                            serialNumbers.add(serialLower);
                        }
                    }
                    if (item.type === 'license' && item.licenseKey.trim()) {
                        const licenseLower = item.licenseKey.trim().toLowerCase();
                        if (licenseKeys.has(licenseLower)) {
                            duplicateErrors.push(`แถวที่ ${index + 2}: License Key "${item.licenseKey}" ซ้ำในไฟล์ Excel`);
                        } else {
                            licenseKeys.add(licenseLower);
                        }
                    }
                });

                if (duplicateErrors.length > 0) {
                    result.errors.push(...duplicateErrors);
                }

                // ตรวจสอบ duplicate กับข้อมูลเดิม (ถ้าไม่ replace)
                if (!replaceExisting) {
                    const existingItems = items;
                    const duplicateWithExisting: string[] = [];

                    result.items.forEach((newItem, index) => {
                        if (newItem.type === 'hardware' && newItem.serialNumber.trim()) {
                            const duplicate = existingItems.find(
                                existing => existing.type === 'hardware' &&
                                existing.serialNumber.trim().toLowerCase() === newItem.serialNumber.trim().toLowerCase()
                            );
                            if (duplicate) {
                                duplicateWithExisting.push(`แถวที่ ${index + 2}: Serial Number "${newItem.serialNumber}" ซ้ำกับข้อมูลเดิม`);
                            }
                        }
                        if (newItem.type === 'license' && newItem.licenseKey.trim()) {
                            const duplicate = existingItems.find(
                                existing => existing.type === 'license' &&
                                existing.licenseKey.trim().toLowerCase() === newItem.licenseKey.trim().toLowerCase()
                            );
                            if (duplicate) {
                                duplicateWithExisting.push(`แถวที่ ${index + 2}: License Key "${newItem.licenseKey}" ซ้ำกับข้อมูลเดิม`);
                            }
                        }
                    });

                    if (duplicateWithExisting.length > 0) {
                        result.errors.push(...duplicateWithExisting);
                    }
                }

                // รวม errors ทั้งหมด
                const allErrors = [...result.errors, ...duplicateErrors];
                if (allErrors.length > 0) {
                    setError(`พบข้อผิดพลาดบางส่วน:\n${allErrors.slice(0, 5).join('\n')}${allErrors.length > 5 ? `\n... และอีก ${allErrors.length - 5} ข้อผิดพลาด` : ''}\n\nจะเพิ่มข้อมูลที่ถูกต้อง ${result.items.length} รายการ`);
                }

                if (replaceExisting) {
                    // แทนที่รายการเดิม
                    setItems(result.items);
                } else {
                    // เพิ่มต่อท้ายรายการเดิม (กรอง duplicate ออก)
                    setItems(prevItems => {
                        const newItems = result.items.filter(newItem => {
                            if (newItem.type === 'hardware' && newItem.serialNumber.trim()) {
                                return !prevItems.some(
                                    existing => existing.type === 'hardware' &&
                                    existing.serialNumber.trim().toLowerCase() === newItem.serialNumber.trim().toLowerCase()
                                );
                            }
                            if (newItem.type === 'license' && newItem.licenseKey.trim()) {
                                return !prevItems.some(
                                    existing => existing.type === 'license' &&
                                    existing.licenseKey.trim().toLowerCase() === newItem.licenseKey.trim().toLowerCase()
                                );
                            }
                            return true;
                        });
                        return [...prevItems, ...newItems];
                    });
                }
            } else {
                // ไม่มีข้อมูลที่ถูกต้อง
                if (result.errors.length > 0) {
                    setError(result.errors.join('\n'));
                } else {
                    setError('ไม่พบข้อมูลอุปกรณ์ในไฟล์ Excel');
                }
            }

            return { success: true, itemsCount: result.items.length, errors: result.errors };

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอ่านไฟล์ Excel';
            setError(errorMessage);
            return { success: false, itemsCount: 0, errors: [errorMessage] };
        } finally {
            setLoading(false);
        }
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
        
        // Excel Import
        handleExcelImport,
    };
}