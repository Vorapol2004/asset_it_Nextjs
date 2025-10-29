'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import { Package, Calendar, Hash, FileText, Plus, Trash2, Save, Laptop, Key } from 'lucide-react';
import { api } from '@/lib/api'; // ✅ เพิ่ม import

interface EquipmentItem {
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
    lotTypeName: string; // ✅ แก้ไขให้ตรงกับ Backend
}

export default function AddEquipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [lotTypes, setLotTypes] = useState<LotType[]>([]);

    // Lot Information
    const [lotName, setLotName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [referenceDoc, setReferenceDoc] = useState('');
    const [lotDescription, setLotDescription] = useState('');
    const [lotTypeId, setLotTypeId] = useState<number>(1);

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

    // ✅ ดึง Lot Types จาก Backend
    useEffect(() => {
        fetchLotTypes();
    }, []);

    const fetchLotTypes = async () => {
        try {
            const data = await api.lot.getTypes();
            setLotTypes(data);
            if (data.length > 0) {
                setLotTypeId(data[0].id);
            }
        } catch (error) {
            console.error('Error fetching lot types:', error);
            // ถ้า API ยังไม่พร้อม ใช้ค่า default
            setLotTypes([
                { id: 1, lotTypeName: 'Purchase' },
                { id: 2, lotTypeName: 'Rent' },
                { id: 3, lotTypeName: 'Borrow' },
                { id: 4, lotTypeName: 'Trial' }
            ]);
        }
    };

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

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    //“อัปเดตฟิลด์ใน item เฉพาะตัวนั้น จากค่าใหม่ที่ผู้ใช้เลือก”
    const updateItem = (id: string, field: keyof EquipmentItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!lotName || !purchaseDate) {
            alert('กรุณากรอกชื่อ LOT และวันที่จัดซื้อ');
            return;
        }

        const hasEmptyFields = items.some(item =>
            !item.equipmentName ||
            (item.type === 'hardware' && !item.serialNumber) ||
            (item.type === 'license' && !item.licenseKey)
        );

        if (hasEmptyFields) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน\n- Hardware ต้องมี Serial Number\n- License ต้องมี License Key');
            return;
        }

        setLoading(true);

        try {
            // ✅ เตรียมข้อมูลตาม Backend Schema
            const lotData = {
                lotName: lotName,
                academicYear: academicYear || null,
                purchaseDate: purchaseDate,
                expireDate: expireDate || null,
                referenceDoc: referenceDoc || null,
                description: lotDescription || null,
                lotTypeId: lotTypeId,
                items: items.map(item => ({
                    equipmentName: item.equipmentName,
                    brand: item.brand || null,
                    model: item.model || null,
                    serialNumber: item.type === 'hardware' ? item.serialNumber : null,
                    licenseKey: item.type === 'license' ? item.licenseKey : null,
                    equipmentTypeId: item.type === 'hardware' ? 2 : 1, // 1=Software/License, 2=Hardware
                    equipmentStatusId: 1, // Default = Available
                }))
            };

            console.log('🚀 Sending data to API:', lotData);

            // ✅ เรียก Backend API
            const result = await api.lot.create(lotData);

            console.log('✅ API Response:', result);

            alert(`เพิ่มอุปกรณ์สำเร็จ!\n- สร้าง LOT: ${result.data?.lotId || 'N/A'}\n- อุปกรณ์: ${result.data?.equipmentCreated || items.length} รายการ`);

            // Redirect ไปหน้า Equipment
            router.push('/pages/equipment');

        } catch (error: any) {
            console.error('❌ Error adding equipment:', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">เพิ่มอุปกรณ์</h1>
                    <p className="text-gray-600">เพิ่มข้อมูล Lot อุปกรณ์ที่มหาวิทยาลัยจัดซื้อ/เช่า/ยืม</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Lot Information Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center pb-3 border-b-2 border-purple-100">
                            <FileText className="h-6 w-6 mr-2 text-purple-600" />
                            ข้อมูล Lot
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Lot Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Hash className="inline h-4 w-4 mr-1 text-purple-600" />
                                    ชื่อ Lot
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lotName}
                                    onChange={(e) => setLotName(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                    placeholder="เช่น LOT2025-001 หรือ จัดซื้อเดือนมกราคม"
                                    required
                                />
                            </div>

                            {/* Lot Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    ประเภท Lot
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    value={lotTypeId}
                                    onChange={(e) => setLotTypeId(Number(e.target.value))}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                    required
                                >
                                    {lotTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.lotTypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Academic Year */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    ปีการศึกษา
                                </label>
                                <input
                                    type="text"
                                    value={academicYear}
                                    onChange={(e) => setAcademicYear(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                    placeholder="เช่น 2568"
                                    maxLength={4}
                                />
                            </div>

                            {/* Purchase Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1 text-purple-600" />
                                    วันที่จัดซื้อ/เช่า
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                    required
                                />
                            </div>

                            {/* Expire Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1 text-purple-600" />
                                    วันหมดอายุ (ถ้ามี)
                                </label>
                                <input
                                    type="date"
                                    value={expireDate}
                                    onChange={(e) => setExpireDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                />
                                <p className="text-xs text-gray-500 mt-1">สำหรับ License หรือสัญญาเช่า</p>
                            </div>

                            {/* Reference Doc */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    เลขที่เอกสารอ้างอิง
                                </label>
                                <input
                                    type="text"
                                    value={referenceDoc}
                                    onChange={(e) => setReferenceDoc(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                    placeholder="เช่น PO-2568-001"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    หมายเหตุ Lot
                                </label>
                                <textarea
                                    value={lotDescription}
                                    onChange={(e) => setLotDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                    placeholder="ระบุรายละเอียดเพิ่มเติมของ Lot..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Equipment Items */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-purple-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Package className="h-6 w-6 mr-2 text-purple-600" />
                                รายการอุปกรณ์
                            </h2>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                เพิ่มรายการ
                            </button>
                        </div>

                        <div className="space-y-4 mt-6">
                            {items.map((item, index) => (
                                <div key={item.id} className="border-2 border-gray-300 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-purple-50 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-gray-900 text-lg">รายการที่ {index + 1}</h3>
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Type */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ประเภท <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={item.type}
                                                onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500"
                                            >
                                                <option value="hardware">Hardware (อุปกรณ์)</option>
                                                <option value="license">License (ใบอนุญาต/ซอฟต์แวร์)</option>
                                            </select>
                                        </div>

                                        {/* Equipment Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ชื่ออุปกรณ์ <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.equipmentName}
                                                onChange={(e) => updateItem(item.id, 'equipmentName', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500"
                                                placeholder="เช่น Notebook Dell Latitude 5420"
                                                required
                                            />
                                        </div>

                                        {/* Brand */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ยี่ห้อ (Brand)
                                            </label>
                                            <input
                                                type="text"
                                                value={item.brand}
                                                onChange={(e) => updateItem(item.id, 'brand', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500"
                                                placeholder="เช่น Dell, HP, Microsoft"
                                            />
                                        </div>

                                        {/* Model */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                รุ่น (Model)
                                            </label>
                                            <input
                                                type="text"
                                                value={item.model}
                                                onChange={(e) => updateItem(item.id, 'model', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500"
                                                placeholder="เช่น Latitude 5420, Office 365"
                                            />
                                        </div>

                                        {/* Serial Number (Hardware) */}
                                        {item.type === 'hardware' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    <Laptop className="inline h-4 w-4 mr-1" />
                                                    Serial Number (SN)
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.serialNumber}
                                                    onChange={(e) => updateItem(item.id, 'serialNumber', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-mono font-medium outline-none focus:border-purple-500"
                                                    placeholder="กรอก Serial Number ของอุปกรณ์"
                                                    required={item.type === 'hardware'}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">ระบุ Serial Number ที่ติดอยู่บนตัวอุปกรณ์</p>
                                            </div>
                                        )}

                                        {/* License Key (License) */}
                                        {item.type === 'license' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    <Key className="inline h-4 w-4 mr-1" />
                                                    License Key
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.licenseKey}
                                                    onChange={(e) => updateItem(item.id, 'licenseKey', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-mono font-medium outline-none focus:border-purple-500"
                                                    placeholder="กรอก License Key หรือ Product Key"
                                                    required={item.type === 'license'}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">ระบุ License Key หรือ Serial ของใบอนุญาต</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 mb-6 border-2 border-purple-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Package className="h-6 w-6 text-white mr-3" />
                                <span className="text-white font-bold text-xl">จำนวนอุปกรณ์ทั้งหมด:</span>
                            </div>
                            <span className="text-4xl font-bold text-white">{items.length} รายการ</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center shadow-lg font-semibold"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}