'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import {
    Package, Plus, Trash2, Save, User, Calendar, FileText, CheckCircle,
    Laptop, Key, Mail, Pin  // เพิ่ม icons ใหม่
} from 'lucide-react';

interface BorrowItem {
    id: string;
    type: 'hardware' | 'license';
    equipmentId: string;
    equipmentName: string;
    serialNumber: string;
    notes: string;
}

interface Equipment {
    id: string;
    name: string;
    type: 'hardware' | 'license';
    availableQuantity: number;
}

const mockEquipmentList: Equipment[] = [
    { id: '1', name: 'Notebook Dell Latitude 5420', type: 'hardware', availableQuantity: 5 },
    { id: '2', name: 'Notebook HP ZBook Studio G8', type: 'hardware', availableQuantity: 3 },
    { id: '3', name: 'iPad Pro 12.9"', type: 'hardware', availableQuantity: 8 },
    { id: '4', name: 'Projector Epson EB-2250U', type: 'hardware', availableQuantity: 2 },
    { id: '5', name: 'Camera Canon EOS R6', type: 'hardware', availableQuantity: 1 },
    { id: '6', name: 'Microphone Rode VideoMic Pro', type: 'hardware', availableQuantity: 4 },
    { id: '7', name: 'External SSD 1TB', type: 'hardware', availableQuantity: 10 },
    { id: '8', name: 'HDMI Cable 5m', type: 'hardware', availableQuantity: 15 },
    { id: '9', name: 'Microsoft Office 365', type: 'license', availableQuantity: 50 },
    { id: '10', name: 'Adobe Creative Cloud', type: 'license', availableQuantity: 20 },
    { id: '11', name: 'Windows 11 Pro', type: 'license', availableQuantity: 30 },
    { id: '12', name: 'AutoCAD 2024', type: 'license', availableQuantity: 10 },
];

export default function BorrowEquipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [equipmentList] = useState<Equipment[]>(mockEquipmentList);

    const [borrowerName, setBorrowerName] = useState('');
    const [borrowerEmail, setBorrowerEmail] = useState('');
    const [approvedBy, setApprovedBy] = useState('');
    const [borrowDate, setBorrowDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [purpose, setPurpose] = useState('');

    const [borrowItems, setBorrowItems] = useState<BorrowItem[]>([
        {
            id: '1',
            type: 'hardware',
            equipmentId: '',
            equipmentName: '',
            serialNumber: '',
            notes: ''
        }
    ]);

    const updateBorrowItem = (id: string, field: keyof BorrowItem, value: any) => {
        setBorrowItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const updateMultipleFields = (id: string, updates: Partial<BorrowItem>) => {
        setBorrowItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, ...updates } : item
            )
        );
    };

    const addBorrowItem = () => {
        setBorrowItems([
            ...borrowItems,
            {
                id: Date.now().toString(),
                type: 'hardware',
                equipmentId: '',
                equipmentName: '',
                serialNumber: '',
                notes: ''
            }
        ]);
    };

    const removeBorrowItem = (id: string) => {
        if (borrowItems.length > 1) {
            setBorrowItems(borrowItems.filter(item => item.id !== id));
        }
    };

    const getFilteredEquipment = (type: 'hardware' | 'license') => {
        return equipmentList.filter(eq => eq.type === type && eq.availableQuantity > 0);
    };

    const handleEquipmentChange = (itemId: string, equipmentId: string) => {
        const equipment = equipmentList.find(eq => eq.id === equipmentId);
        if (equipment) {
            updateMultipleFields(itemId, {
                equipmentId: equipmentId,
                equipmentName: equipment.name
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const missingSerials = borrowItems.filter(item => !item.serialNumber);
        if (missingSerials.length > 0) {
            alert('กรุณากรอก Serial Number/License Serial ให้ครบทุกรายการ');
            return;
        }

        setLoading(true);

        try {
            console.log('Borrow Request:', {
                borrowerName,
                borrowerEmail,
                approvedBy,
                borrowDate,
                returnDate,
                purpose,
                items: borrowItems
            });

            alert('บันทึกการยืมสำเร็จ! (Mockup Mode)');
            router.push('/pages/borrow_history');
        } catch (error) {
            console.error('Error creating borrow request:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกการยืม');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ยืมอุปกรณ์</h1>
                    <p className="text-gray-600">บันทึกข้อมูลการยืมอุปกรณ์ของผู้ใช้งาน</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center pb-3 border-b-2 border-green-100">
                            <User className="h-6 w-6 mr-2 text-green-600" />
                            ข้อมูลผู้ยืม
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    ชื่อผู้ยืม <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={borrowerName}
                                    onChange={(e) => setBorrowerName(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                                    placeholder="ชื่อ-นามสกุล"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                    <Mail className="h-4 w-4 mr-1 text-green-600" />
                                    อีเมล <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={borrowerEmail}
                                    onChange={(e) => setBorrowerEmail(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <CheckCircle className="inline h-4 w-4 mr-1 text-green-600" />
                                    ผู้อนุมัติ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={approvedBy}
                                    onChange={(e) => setApprovedBy(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                                    placeholder="ชื่อผู้อนุมัติการยืม"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1 text-green-600" />
                                    วันที่ยืม <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={borrowDate}
                                    onChange={(e) => setBorrowDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1 text-green-600" />
                                    วันที่คืน (กำหนด) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 font-medium"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    วัตถุประสงค์การยืม <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                                    placeholder="ระบุวัตถุประสงค์ในการยืมอุปกรณ์"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-green-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Package className="h-6 w-6 mr-2 text-green-600" />
                                รายการยืม
                            </h2>
                            <button
                                type="button"
                                onClick={addBorrowItem}
                                className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                เพิ่มรายการ
                            </button>
                        </div>

                        <div className="space-y-4 mt-6">
                            {borrowItems.map((item, index) => (
                                <div key={item.id} className="border-2 border-gray-300 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-green-50 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-gray-900 text-lg">รายการที่ {index + 1}</h3>
                                        {borrowItems.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBorrowItem(item.id)}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ประเภท <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={item.type}
                                                onChange={(e) => {
                                                    const newType = e.target.value as 'hardware' | 'license';
                                                    updateMultipleFields(item.id, {
                                                        type: newType,
                                                        equipmentId: '',
                                                        equipmentName: ''
                                                    });
                                                }}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900 font-medium cursor-pointer"
                                            >
                                                <option value="hardware">
                                                    Hardware (อุปกรณ์)
                                                </option>
                                                <option value="license">
                                                    License (ใบอนุญาต)
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                เลือกรายการ <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={item.equipmentId}
                                                onChange={(e) => handleEquipmentChange(item.id, e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900 font-medium cursor-pointer"
                                                required
                                            >
                                                <option value="">-- เลือก{item.type === 'hardware' ? 'อุปกรณ์' : 'License'} --</option>
                                                {getFilteredEquipment(item.type).map(eq => (
                                                    <option key={eq.id} value={eq.id}>
                                                        {eq.name} (คงเหลือ: {eq.availableQuantity})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                {item.type === 'hardware' ? 'Serial Number (SN)' : 'License Serial'}
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.serialNumber}
                                                onChange={(e) => updateBorrowItem(item.id, 'serialNumber', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900 font-medium"
                                                placeholder={item.type === 'hardware' ? 'กรอก Serial Number ของอุปกรณ์' : 'กรอก License Serial/Key'}
                                                required
                                            />
                                            <p className="text-xs text-gray-600 mt-1 font-medium flex items-center">
                                                <Pin className="h-3 w-3 mr-1" />
                                                {item.type === 'hardware'
                                                    ? 'ระบุ Serial Number ที่ติดอยู่บนตัวอุปกรณ์'
                                                    : 'ระบุ License Key หรือ Serial ของใบอนุญาต'}
                                            </p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                หมายเหตุ
                                            </label>
                                            <textarea
                                                value={item.notes}
                                                onChange={(e) => updateBorrowItem(item.id, 'notes', e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                                                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 mb-6 border-2 border-green-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileText className="h-6 w-6 text-white mr-3" />
                                <span className="text-white font-bold text-xl">จำนวนรายการที่ยืม:</span>
                            </div>
                            <span className="text-4xl font-bold text-white">{borrowItems.length} รายการ</span>
                        </div>
                    </div>

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
                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center shadow-lg font-semibold"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกการยืม'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}