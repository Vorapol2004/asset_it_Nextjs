'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import RouteProtection from '@/component/auth/RouteProtection';
import {
    Package, Plus, Trash2, Save, Calendar, FileText,
    ArrowLeft, Search, User, Mail, Phone, Briefcase, Building2, DoorOpen, Layers, Lock, UserCheck, ChevronUp
} from 'lucide-react';
import { useBorrow } from '@/hooks/useBorrow';
import { ROUTES } from '@/constants/routes';

export default function BorrowPage() {
    const router = useRouter();
    const {
        loading,
        borrowDate,
        dueDate,
        referenceDoc,
        approverName,
        borrowItems,
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
    } = useBorrow();

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
        <RouteProtection allowedRoles="authenticated">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push(ROUTES.BORROW_EQUIPMENT)}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        กลับ
                    </button>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <Package className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">กรอกข้อมูลการยืม</h1>
                                <p className="text-gray-600">กรอกวันที่และรายการอุปกรณ์ที่ต้องการยืม</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* ข้อมูลผู้ยืม */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <User className="h-6 w-6 mr-2 text-blue-600" />
                                ข้อมูลผู้ยืม
                            </h2>
                            {isLocked && (
                                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg border border-purple-200">
                                    <Lock className="h-4 w-4" />
                                    <span className="text-sm font-medium">ไม่สามารถแก้ไขได้</span>
                                </div>
                            )}
                        </div>
                        {employeeLoading ? (
                            <div className="text-center py-4">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                                <p className="mt-2 text-gray-600 text-sm">กำลังโหลดข้อมูลผู้ยืม...</p>
                            </div>
                            
                        ) : employee ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        ชื่อ-นามสกุล
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={`${employee.firstName} ${employee.lastName}`}
                                            readOnly
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {employee.email && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            อีเมล
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={employee.email}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}

                                {employee.phone && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            เบอร์โทรศัพท์
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={employee.phone}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}

                                {employee.roleName && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            ตำแหน่ง
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={employee.roleName}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}

                                {employee.departmentName && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            แผนก
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={employee.departmentName}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                ไม่พบข้อมูลผู้ยืม
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Building2 className="h-6 w-6 mr-2 text-blue-600" />
                                สถานที่และหน่วยงาน
                            </h2>
                            {isLocked && (
                                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg border border-purple-200">
                                    <Lock className="h-4 w-4" />
                                    <span className="text-sm font-medium">ไม่สามารถแก้ไขได้</span>
                                </div>
                            )}
                        </div>
                        {employee ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {employee.departmentName && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            แผนก
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={employee.departmentName}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}

                                {employee.buildingName && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            ตึก
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={employee.buildingName}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}

                                {employee.floorName && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            ชั้น
                                        </label>
                                        <div className="relative">
                                            <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={employee.floorName}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}

                                {employee.roomName && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            ห้อง
                                        </label>
                                        <div className="relative">
                                            <DoorOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={employee.roomName}
                                                readOnly
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                ไม่พบข้อมูลสถานที่
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-blue-100 flex items-center">
                            <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                            วันที่
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    วันที่ยืม <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={borrowDate}
                                        onChange={(e) => setBorrowDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    วันที่คืน <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        min={borrowDate ? (() => {
                                            const date = new Date(borrowDate);
                                            date.setDate(date.getDate() + 1);
                                            return date.toISOString().split('T')[0];
                                        })() : ''}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                                {borrowDate && dueDate && new Date(dueDate) <= new Date(borrowDate) && (
                                    <p className="text-xs text-red-600 mt-1">วันที่คืนต้องหลังวันที่ยืม</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    เอกสารอ้างอิง
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={referenceDoc}
                                        onChange={(e) => setReferenceDoc(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        placeholder="เลขที่เอกสาร (ถ้ามี)"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    ผู้อนุมัติ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={approverName}
                                        onChange={(e) => setApproverName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        placeholder="ชื่อผู้อนุมัติ"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-blue-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Package className="h-6 w-6 mr-2 text-blue-600" />
                                รายการอุปกรณ์
                            </h2>
                            <button
                                type="button"
                                onClick={addBorrowItem}
                                className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                เพิ่มรายการ
                            </button>
                        </div>

                        <div className="space-y-4 mt-6">
                            {borrowItems.map((item, index) => (
                                <div key={`borrow-item-${index}`} className="border-2 border-gray-300 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-gray-900 text-lg">รายการที่ {index + 1}</h3>
                                        {borrowItems.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBorrowItem(index)}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Field ค้นหา License Key หรือ Serial Number */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                License Key หรือ Serial Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item.searchValue || ''}
                                                    onChange={(e) => updateBorrowItem(index, 'searchValue', e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            if (item.searchValue.trim()) {
                                                                searchEquipment(index, item.searchValue);
                                                            }
                                                        }
                                                    }}
                                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                                    placeholder="กรอก License Key หรือ Serial Number"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (item.searchValue.trim()) {
                                                            searchEquipment(index, item.searchValue);
                                                        }
                                                    }}
                                                    disabled={!item.searchValue.trim()}
                                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                                                >
                                                    <Search className="h-5 w-5" />
                                                </button>
                                            </div>
                                            {item.equipmentId > 0 && (
                                                <p className="mt-2 text-sm text-green-600 font-semibold">✅ พบอุปกรณ์ - ข้อมูลจะถูกเติมอัตโนมัติ</p>
                                            )}
                                            {item.searchError && (
                                                <p className="mt-2 text-sm text-red-600 font-semibold">❌ {item.searchError}</p>
                                            )}
                                        </div>

                                        {/* ชื่ออุปกรณ์ (Auto-fill) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ชื่ออุปกรณ์ <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.equipmentName || ''}
                                                readOnly
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                                placeholder="จะแสดงอัตโนมัติเมื่อค้นหาเจอ"
                                            />
                                        </div>

                                        {/* ยี่ห้อ (Auto-fill) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ยี่ห้อ
                                            </label>
                                            <input
                                                type="text"
                                                value={item.brand || ''}
                                                readOnly
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                                placeholder="จะแสดงอัตโนมัติเมื่อค้นหาเจอ"
                                            />
                                        </div>

                                        {/* รุ่น (Auto-fill) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                รุ่น
                                            </label>
                                            <input
                                                type="text"
                                                value={item.model || ''}
                                                readOnly
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-gray-50 cursor-not-allowed"
                                                placeholder="จะแสดงอัตโนมัติเมื่อค้นหาเจอ"
                                            />
                                        </div>

                                        {/* หมายเหตุ */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                <FileText className="inline h-4 w-4 mr-1 text-blue-600" />
                                                หมายเหตุ
                                            </label>
                                            <textarea
                                                value={item.notes || ''}
                                                onChange={(e) => updateBorrowItem(index, 'notes', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 outline-none focus:border-blue-500"
                                                rows={3}
                                                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* สรุปจำนวนรายการ */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileText className="h-6 w-6 text-white mr-3" />
                                <span className="text-white font-bold text-xl">จำนวนรายการที่ยืม:</span>
                            </div>
                            <span className="text-4xl font-bold text-white">{borrowItems.length} รายการ</span>
                        </div>
                    </div>

                    {/* ปุ่มบันทึก/ยกเลิก */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.push(ROUTES.BORROW_EQUIPMENT)}
                            disabled={loading}
                            className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center shadow-lg font-semibold"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกการยืม'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 flex items-center justify-center group cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-6 w-6 group-hover:animate-bounce" />
                </button>
            )}
        </div>
        </RouteProtection>
    );
}

