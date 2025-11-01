'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/component/Navbar/Navbar';
import {
    RefreshCw, Package, Search, X, ChevronDown, Eye,
    Calendar, FileText, Tag, AlertCircle, Trash2
} from 'lucide-react';
import { useEquipment } from '@/hooks/useEquipment';
import { useMasterData } from '@/hooks/useMasterData';
import { EquipmentView } from '@/types/type';

export default function EquipmentPage() {
    const {
        equipments,
        loading,
        error,
        showModal,
        selectedEquipment,
        loadingDetail,
        errorDetail,
        fetchEquipments,
        applyFilters,
        openDetailModal,
        closeDetailModal,
        retryFetchDetail,
        deleteEquipment,
    } = useEquipment();


    // ✅ State สำหรับ UI เท่านั้น
    const { statuses, equipmentTypes: types } = useMasterData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');

    // ✅ UI Handlers
    const handleApplyFilters = async () => {
        await applyFilters({
            typeId: selectedType !== 'all' ? Number(selectedType) : undefined,
            statusId: selectedStatus !== 'all' ? Number(selectedStatus) : undefined,
            keyword: searchTerm.trim() || undefined,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedType('all');
        applyFilters({});
    };

    useEffect(() => {
        handleApplyFilters();
    }, [selectedStatus, selectedType]);

    useEffect(() => {
        handleApplyFilters(); // โหลดทั้งหมดตอนเริ่มต้น
    }, []); //รันครั้งเดียวตอน mount

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการอุปกรณ์</h1>
                        <p className="text-gray-600">ทั้งหมด {equipments.length} รายการ</p>
                    </div>
                    <button
                        onClick={() => {
                            handleClearFilters();
                            fetchEquipments();
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        รีเฟรช
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Search + Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
                    {/* Search */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                            ค้นหา
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อ, ยี่ห้อ, รุ่น, Serial Number, License Key..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleApplyFilters();
                                        }
                                    }}
                                    disabled={loading}
                                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg outline-none text-gray-700 font-medium placeholder:text-gray-400 focus:border-indigo-500 disabled:opacity-50 disabled:bg-gray-50 transition-colors"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleApplyFilters}
                                disabled={loading}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                            >
                                <Search className="h-5 w-5" />
                                ค้นหา
                            </button>
                        </div>
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* สถานะ */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                สถานะ
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg outline-none text-gray-700 font-medium bg-white focus:border-indigo-500 disabled:opacity-50 disabled:bg-gray-50 appearance-none cursor-pointer transition-colors"
                                >
                                    <option value="all">ทั้งหมด</option>
                                    {statuses?.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.equipmentStatusName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* ประเภท */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                ประเภท
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg outline-none text-gray-700 font-medium bg-white focus:border-indigo-500 disabled:opacity-50 disabled:bg-gray-50 appearance-none cursor-pointer transition-colors"
                                >
                                    <option value="all">ทั้งหมด</option>
                                    {types.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.equipmentTypeName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* ปุ่มล้างฟิลเตอร์ */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleClearFilters}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                            ล้างฟิลเตอร์
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {(() => {
                        if (loading) {
                            return (
                                <div className="flex flex-col items-center py-20">
                                    <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                    <span className="text-gray-600 font-medium">กำลังโหลด...</span>
                                </div>
                            );
                        }

                        if (equipments.length === 0) {
                            return (
                                <div className="flex flex-col items-center py-20">
                                    <Package className="w-16 h-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">ไม่พบอุปกรณ์</h3>
                                    <p className="text-gray-500">ไม่มีรายการที่ตรงกับเงื่อนไขที่เลือก</p>
                                </div>
                            );
                        }

                        return (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ">ชื่ออุปกรณ์</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ">ยี่ห้อ/รุ่น</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">LOT</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">ปีการศึกษา</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">ประเภท</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">สถานะ</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">ลบ</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {equipments.map((eq, i) => (
                                        <tr key={eq.id} className={`hover:bg-indigo-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>

                                            <td className="px-6 py-3">
                                                <span className="font-semibold text-gray-900">{eq.equipmentName}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="text-gray-700">
                                                    {eq.brand || '-'} {eq.model && `/ ${eq.model}`}
                                                </span>
                                            </td>

                                            <td className="px-6 py-3">
                                                {eq.lotName ? (
                                                    <span className="text-gray-700 font-medium">{eq.lotName}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-3">
                                                {eq.academicYear ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                                        {eq.academicYear}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    eq.equipmentTypeName === 'Hardware'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {eq.equipmentTypeName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    eq.equipmentStatusName === 'Available'
                                                        ? 'bg-green-100 text-green-800'
                                                        : eq.equipmentStatusName === 'In Use'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : eq.equipmentStatusName === 'Under Maintenance'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : eq.equipmentStatusName === 'Damaged'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {eq.equipmentStatusName}
                                                </span>
                                            </td>

                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => deleteEquipment(eq.id)}
                                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium text-sm cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    ลบ
                                                </button>
                                            </td>


                                            {/* ✅ เรียกใช้ฟังก์ชันจาก Hook */}
                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => openDetailModal(eq.id)}
                                                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto font-medium text-sm cursor-pointer"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    ดูรายละเอียด
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ✅ Modal ใช้ State และ Functions จาก Hook */}
            {showModal && (
                <EquipmentDetailModal
                    equipment={selectedEquipment}
                    loading={loadingDetail}
                    error={errorDetail}
                    onClose={closeDetailModal}
                    onRetry={() => selectedEquipment && retryFetchDetail(selectedEquipment.id)}
                />
            )}
        </div>
    );
}

// ✅ Modal Component (เพิ่ม Error Handling)
function EquipmentDetailModal({
                                  equipment,
                                  loading,
                                  error,
                                  onClose,
                                  onRetry,
                              }: {
    equipment: EquipmentView | null;
    loading: boolean;
    error: string | null;
    onClose: () => void;
    onRetry: () => void;
}) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!equipment && !loading && !error) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 backdrop-blur-sm bg-white/30 transition-all"
                onClick={onClose}
            />

            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">

                    {(() => {
                        // ✅ กำลังโหลด
                        if (loading) {
                            return (
                                <div className="flex flex-col items-center py-20">
                                    <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                    <span className="text-gray-600 font-medium">กำลังโหลด...</span>
                                </div>
                            );
                        }

                        // ✅ เกิด Error
                        if (error) {
                            return (
                                <div className="flex flex-col items-center py-20 px-6">
                                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
                                    <p className="text-gray-600 text-center mb-6">{error}</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={onRetry}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
                                        >
                                            ลองอีกครั้ง
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer"
                                        >
                                            ปิด
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        // ✅ ไม่มีข้อมูล
                        if (!equipment) {
                            return null;
                        }

                        // ✅ แสดงข้อมูล
                        return (
                            <>
                                {/* Header */}
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <Package className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                {equipment.equipmentName}
                                            </h2>
                                            <p className="text-gray-600">รหัสอุปกรณ์: #{equipment.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                            equipment.equipmentStatusName === 'Available'
                                                ? 'bg-green-100 text-green-800'
                                                : equipment.equipmentStatusName === 'In Use'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : equipment.equipmentStatusName === 'Under Maintenance'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : equipment.equipmentStatusName === 'Damaged'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {equipment.equipmentStatusName}
                                        </span>
                                        <button
                                            onClick={onClose}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* ข้อมูลทั่วไป */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Tag className="h-5 w-5 text-indigo-600" />
                                            ข้อมูลทั่วไป
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InfoItem label="ประเภท">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    equipment.equipmentTypeName === 'Hardware'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {equipment.equipmentTypeName}
                                                </span>
                                            </InfoItem>
                                            <InfoItem label="ยี่ห้อ" value={equipment.brand} />
                                            <InfoItem label="รุ่น" value={equipment.model} />

                                            {equipment.serialNumber && (
                                                <InfoItem label="Serial Number">
                                                    <span className="font-mono text-sm text-gray-900 bg-gray-100 px-3 py-1 rounded">
                                                        {equipment.serialNumber}
                                                    </span>
                                                </InfoItem>
                                            )}

                                            {equipment.licenseKey && (
                                                <InfoItem label="License Key">
                                                    <span className="font-mono text-sm text-purple-900 bg-purple-50 px-3 py-1 rounded">
                                                        {equipment.licenseKey}
                                                    </span>
                                                </InfoItem>
                                            )}
                                        </div>
                                    </div>

                                    {/* ข้อมูล LOT */}
                                    {equipment.lotName && (
                                        <div className="pt-6 border-t border-gray-200">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-indigo-600" />
                                                ข้อมูล LOT
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <InfoItem label="ชื่อ LOT" value={equipment.lotName} />
                                                <InfoItem label="ประเภท LOT" value={equipment.lotTypeName} />

                                                {equipment.academicYear && (
                                                    <InfoItem label="ปีการศึกษา">
                                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
                                                            {equipment.academicYear}
                                                        </span>
                                                    </InfoItem>
                                                )}

                                                {equipment.referenceDoc && (
                                                    <InfoItem label="เอกสารอ้างอิง" value={equipment.referenceDoc} />
                                                )}

                                                {equipment.purchaseDate && (
                                                    <InfoItem label="วันที่จัดซื้อ">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Calendar className="h-4 w-4 text-indigo-600" />
                                                            {new Date(equipment.purchaseDate).toLocaleDateString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </InfoItem>
                                                )}

                                                {equipment.expireDate && (
                                                    <InfoItem label="วันหมดอายุ">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Calendar className="h-4 w-4 text-red-600" />
                                                            {new Date(equipment.expireDate).toLocaleDateString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </InfoItem>
                                                )}

                                                {equipment.description && (
                                                    <div className="md:col-span-2">
                                                        <InfoItem label="รายละเอียด" value={equipment.description} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium transition-colors cursor-pointer"
                                    >
                                        ปิด
                                    </button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}

function InfoItem({
                      label,
                      value,
                      children
                  }: {
    label: string;
    value?: string | null;
    children?: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
                {label}
            </label>
            {children || (
                <p className="text-gray-900 font-medium">
                    {value || '-'}
                </p>
            )}
        </div>
    );
}