'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import { Package, Calendar, Hash, FileText, Plus, Trash2, Save, Laptop, Key } from 'lucide-react';
import { api } from '@/lib/api';

interface EquipmentItem {
    id: string;
    name: string;
    type: 'hardware' | 'license';
    quantity: number;
    unitPrice: number;
    supplier: string;
    description: string;
}

export default function AddEquipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [purchaseDate, setPurchaseDate] = useState('');
    const [lotNumber, setLotNumber] = useState('');
    const [items, setItems] = useState<EquipmentItem[]>([
        {
            id: '1',
            name: '',
            type: 'hardware',
            quantity: 1,
            unitPrice: 0,
            supplier: '',
            description: ''
        }
    ]);

    const addItem = () => {
        setItems([
            ...items,
            {
                id: Date.now().toString(),
                name: '',
                type: 'hardware',
                quantity: 1,
                unitPrice: 0,
                supplier: '',
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

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.addEquipmentLot({
                lotNumber,
                purchaseDate,
                items
            });

            alert('เพิ่มอุปกรณ์สำเร็จ!');
            router.push('/pages/home');
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
                    <p className="text-gray-600">เพิ่มข้อมูล Lot อุปกรณ์ที่มหาวิทยาลัยจัดซื้อ</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Lot Information Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center pb-3 border-b-2 border-blue-100">
                            <FileText className="h-6 w-6 mr-2 text-blue-600" />
                            ข้อมูล Lot
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Lot Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Hash className="inline h-4 w-4 mr-1 text-blue-600" />
                                    ชื่อ Lot / เลขที่ Lot
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lotNumber}
                                    onChange={(e) => setLotNumber(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                                    placeholder="เช่น LOT2025-001 หรือ จัดซื้อเดือนมกราคม"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">สามารถใส่เป็นข้อความหรือเลขล็อตก็ได้</p>
                            </div>

                            {/* Purchase Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1 text-blue-600" />
                                    วันที่จัดซื้อ
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Equipment Items */}
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Equipment Name */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ชื่อรายการ <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
                                                placeholder="เช่น Notebook Dell Latitude"
                                                required
                                            />
                                        </div>

                                        {/* Type */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ประเภท <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={item.type}
                                                onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
                                            >
                                                <option value="hardware">Hardware</option>
                                                <option value="license">License</option>
                                            </select>
                                        </div>

                                        {/* Quantity */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                จำนวน <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-bold"
                                                required
                                            />
                                        </div>

                                        {/* Unit Price */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ราคาต่อหน่วย (บาท) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unitPrice}
                                                onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-bold"
                                                required
                                            />
                                        </div>

                                        {/* Supplier */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ผู้จัดจำหน่าย
                                            </label>
                                            <input
                                                type="text"
                                                value={item.supplier}
                                                onChange={(e) => updateItem(item.id, 'supplier', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
                                                placeholder="บริษัท ABC จำกัด"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2 lg:col-span-3">
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                รายละเอียด
                                            </label>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                                placeholder="ระบุรายละเอียดเพิ่มเติม เช่น สเปค, model, รุ่น..."
                                            />
                                        </div>

                                        {/* Subtotal */}
                                        <div className="md:col-span-2 lg:col-span-3 bg-blue-600 p-4 rounded-lg shadow-md">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-white">รวมรายการนี้:</span>
                                                <span className="text-2xl font-bold text-white">
                          {(item.quantity * item.unitPrice).toLocaleString('th-TH', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                          })} บาท
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">มูลค่ารวมทั้งหมด</h2>
                            <div className="text-4xl font-bold text-white">
                                {calculateTotal().toLocaleString('th-TH', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })} บาท
                            </div>
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