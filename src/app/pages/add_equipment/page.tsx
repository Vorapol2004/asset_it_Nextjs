'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import { Package, Calendar, Hash, FileText, Plus, Trash2, Save, Laptop, Key } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

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

export default function AddEquipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Lot Information
    const [lotName, setLotName] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [referenceDoc, setReferenceDoc] = useState('');
    const [lotDescription, setLotDescription] = useState('');
    const [lotType, setLotType] = useState<'Purchase' | 'Rent' | 'Borrow' | 'Trial'>('Purchase');

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

    const updateItem = (id: string, field: keyof EquipmentItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
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
            // TODO: เชื่อม API
            const lotData = {
                lotName,
                academicYear,
                purchaseDate,
                expireDate: expireDate || null,
                referenceDoc: referenceDoc || null,
                description: lotDescription || null,
                lotType,
                items: items.map(item => ({
                    equipmentName: item.equipmentName,
                    brand: item.brand || null,
                    model: item.model || null,
                    serialNumber: item.type === 'hardware' ? item.serialNumber : null,
                    licenseKey: item.type === 'license' ? item.licenseKey : null,
                    equipmentType: item.type === 'hardware' ? 2 : 1, // hardware=2, software/license=1
                    description: item.description || null
                }))
            };

            console.log('Lot Data:', lotData);

            alert('เพิ่มอุปกรณ์สำเร็จ! (Mockup Mode)');
            router.push(ROUTES.HOME);
        } catch (error) {
            console.error('Error adding equipment:', error);
            alert('เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">เพิ่มอุปกรณ์</h1>
                    <p className="text-gray-600">เพิ่มข้อมูล Lot อุปกรณ์ที่มหาวิทยาลัยจัดซื้อ/เช่า/ยืม</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Lot Information Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center pb-3 border-b-2 border-blue-100">
                            <FileText className="h-6 w-6 mr-2 text-blue-600" />
                            ข้อมูล Lot
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Lot Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Hash className="inline h-4 w-4 mr-1 text-blue-600" />
                                    ชื่อ Lot
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lotName}
                                    onChange={(e) => setLotName(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
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
                                    value={lotType}
                                    onChange={(e) => setLotType(e.target.value as any)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
                                    required
                                >
                                    <option value="Purchase">Purchase (จัดซื้อ)</option>
                                    <option value="Rent">Rent (เช่า)</option>
                                    <option value="Borrow">Borrow (ยืม)</option>
                                    <option value="Trial">Trial (ทดลองใช้)</option>
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
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
                                    placeholder="เช่น 2568"
                                />
                            </div>

                            {/* Purchase Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1 text-blue-600" />
                                    วันที่จัดซื้อ/เช่า
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
                                    required
                                />
                            </div>

                            {/* Expire Date (สำหรับ License หรือ Rent) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1 text-blue-600" />
                                    วันหมดอายุ (ถ้ามี)
                                </label>
                                <input
                                    type="date"
                                    value={expireDate}
                                    onChange={(e) => setExpireDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
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
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
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
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 outline-none"
                                    placeholder="ระบุรายละเอียดเพิ่มเติมของ Lot..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Type Items */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-blue-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Package className="h-6 w-6 mr-2 text-blue-600" />
                                รายการอุปกรณ์
                            </h2>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                เพิ่มรายการ
                            </button>
                        </div>

                        <div className="space-y-4 mt-6">
                            {items.map((item, index) => (
                                <div key={item.id} className="border-2 border-gray-300 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm">
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
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
                                            >
                                                <option value="hardware">Hardware (อุปกรณ์)</option>
                                                <option value="license">License (ใบอนุญาต)</option>
                                            </select>
                                        </div>

                                        {/* Type Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ชื่ออุปกรณ์ <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.equipmentName}
                                                onChange={(e) => updateItem(item.id, 'equipmentName', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
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
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
                                                placeholder="เช่น Dell, HP, Lenovo"
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
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
                                                placeholder="เช่น Latitude 5420, ThinkPad X1"
                                            />
                                        </div>

                                        {/* Serial Number (สำหรับ Hardware) */}
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
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
                                                    placeholder="กรอก Serial Number ของอุปกรณ์"
                                                    required={item.type === 'hardware'}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">ระบุ Serial Number ที่ติดอยู่บนตัวอุปกรณ์</p>
                                            </div>
                                        )}

                                        {/* License Key (สำหรับ License) */}
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
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none"
                                                    placeholder="กรอก License Key หรือ Product Key"
                                                    required={item.type === 'license'}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">ระบุ License Key หรือ Serial ของใบอนุญาต</p>
                                            </div>
                                        )}

                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                รายละเอียด
                                            </label>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 outline-none"
                                                placeholder="ระบุรายละเอียดเพิ่มเติม เช่น สเปค, RAM, CPU, ระยะเวลาใช้งาน..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-700">
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
                            className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center shadow-lg font-semibold"
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