'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/component/Navbar/Navbar';
import {
    Package,
    Calendar,
    Hash,
    FileText,
    Plus,
    Trash2,
    Save,
    Laptop,
    Key,
    CheckCircle,
    AlertCircle,
    X,
    ChevronUp
} from 'lucide-react';
import { useAddEquipment } from '@/hooks/useAddEquipment';

export default function AddEquipmentPage() {
    const {
        loading,
        error,
        success,
        lotTypes,
        equipmentTypes,
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
        items,
        addItem,
        removeItem,
        updateItem,
        submitEquipment,
        cancel,
        setError,
    } = useAddEquipment();

    // ✅ Submit ฟอร์ม
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitEquipment();
    };

    const [showScrollTop, setShowScrollTop] = useState(false);

    // Scroll to Top 
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">เพิ่มอุปกรณ์</h1>
                    <p className="text-gray-600">เพิ่มข้อมูล Lot อุปกรณ์ที่มหาวิทยาลัยจัดซื้อ/เช่า/ยืม</p>
                </div>

                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start animate-fade-in">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-green-800">บันทึกข้อมูลสำเร็จ!</h3>
                            <p className="text-green-700 text-sm mt-1">
                                เพิ่มอุปกรณ์ {items.length} รายการสำเร็จ กำลังนำคุณกลับไปหน้ารายการ...
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start animate-fade-in">
                        <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-800">เกิดข้อผิดพลาด</h3>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-400 hover:text-red-600 ml-4"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

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
                                    disabled={loading}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                    value={lotTypeId || ''}
                                    onChange={(e) => setLotTypeId(Number(e.target.value))}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                >
                                    <option value="">-- เลือกประเภท Lot --</option>
                                    {lotTypes.length > 0 ? (
                                        lotTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.lotTypeName}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>กำลังโหลด...</option>
                                    )}
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
                                    disabled={loading}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                    disabled={loading}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                    disabled={loading}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">สำหรับ License หรือ สัญญาเช่า</p>
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
                                    disabled={loading}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                    disabled={loading}
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                disabled={loading}
                                className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                                                disabled={loading}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                value={item.type.toLowerCase()}
                                                onChange={(e) => {
                                                    const raw = e.target.value.toLowerCase();
                                                    const normalizedType = raw === 'software' ? 'license' : raw; // 🟢 map software → license
                                                    updateItem(item.id, 'type', normalizedType);
                                                }}
                                                disabled={loading}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                {equipmentTypes.length > 0 ? (
                                                    equipmentTypes.map((type) => (
                                                        <option key={type.id} value={type.equipmentTypeName.toLowerCase()}>
                                                            {type.equipmentTypeName}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>กำลังโหลด...</option>
                                                )}
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
                                                disabled={loading}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                                disabled={loading}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                                disabled={loading}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                placeholder="เช่น Latitude 5420, Office 365"
                                            />
                                        </div>

                                        {/* Serial Number (Hardware) */}
                                        <div className="md:col-span-2" hidden={item.type !== 'hardware'}>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                <Laptop className="inline h-4 w-4 mr-1" />
                                                Serial Number (SN)
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.serialNumber}
                                                onChange={(e) => updateItem(item.id, 'serialNumber', e.target.value)}
                                                disabled={loading}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-mono outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                placeholder="กรอก Serial Number ของอุปกรณ์"
                                            />
                                        </div>


                                        {/* License Key (License) */}
                                        <div className="md:col-span-2" hidden={item.type !== 'license'}>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                <Key className="inline h-4 w-4 mr-1" />
                                                License Key
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.licenseKey}
                                                onChange={(e) => updateItem(item.id, 'licenseKey', e.target.value)}
                                                disabled={loading}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-mono outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                placeholder="กรอก License Key หรือ Product Key"
                                            />
                                        </div>

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
                            onClick={cancel}
                            disabled={loading}
                            className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center shadow-lg font-semibold"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-6 w-6 group-hover:animate-bounce" />
                </button>
            )}
        </div>
    );
}