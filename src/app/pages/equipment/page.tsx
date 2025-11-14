'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/component/Navbar/Navbar';
import {
    RefreshCw, Package, Search, X, ChevronDown, Eye,
    Edit, ChevronUp
} from 'lucide-react';
import { useEquipment } from '@/hooks/useEquipment';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import { EditEquipmentModal } from './EditEquipmentModal';

export default function EquipmentPage() {
    const {
        equipments,
        loading,
        error,
        showModal,
        selectedEquipment,
        loadingDetail,
        errorDetail,
        statuses,
        types,
        searchEquipment,
        fetchEquipments,
        applyFilters,
        openDetailModal,
        closeDetailModal,
        retryFetchDetail,
        // Edit Modal
        showEditModal,
        editingEquipment,
        loadingEdit,
        errorEdit,
        openEditModal,
        closeEditModal,
        updateEquipment,
        deleteEquipment,
    } = useEquipment();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [showScrollTop, setShowScrollTop] = useState(false);

    const handleApplyFilters = async () => {
        // ถ้ามี keyword → เรียก search
        if (searchTerm.trim()) {
            await searchEquipment(searchTerm);
        } 
        // ถ้ามี type หรือ status → เรียก filter
        else if (selectedType !== 'all' || selectedStatus !== 'all') {
            await applyFilters({
                typeId: selectedType !== 'all' ? Number(selectedType) : undefined,
                statusId: selectedStatus !== 'all' ? Number(selectedStatus) : undefined,
            });
        }
        // ไม่มี filter → เรียกทั้งหมด
        else {
            await fetchEquipments();
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedType('all');
        applyFilters({});
    };

    // ใช้งานดึงข้อมูลอุปกรณ์ทั้งหมดพร้อมกับการเรียงข้อมูลใหม่เก่า 
    useEffect(() => {
        fetchEquipments();
    }, []);

    // 🔥useEffect filter เมื่อเปลี่ยน status/type
    useEffect(() => {
        applyFilters({
            typeId: selectedType !== 'all' ? Number(selectedType) : undefined,
            statusId: selectedStatus !== 'all' ? Number(selectedStatus) : undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStatus, selectedType]);

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
                                    {statuses && statuses.length > 0 ? (
                                        statuses.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.equipmentStatusName}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>กำลังโหลด...</option>
                                    )}
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
                                    {types && types.length > 0 ? (
                                        types.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.equipmentTypeName}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>กำลังโหลด...</option>
                                    )}
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
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ">ชื่ออุปกรณ์</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ">ยี่ห้อ/รุ่น</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">LOT</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">ปีการศึกษา</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">ประเภท</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">สถานะ</th>
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

                                            <td className="px-6 py-3 text-center">
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
                                                <div className="flex gap-2 w-full">
                                                    <button
                                                        onClick={() => openEditModal(eq.id)}
                                                        className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 font-medium text-sm cursor-pointer"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        แก้ไข
                                                    </button>
                                                    <button
                                                        onClick={() => openDetailModal(eq.id)}
                                                        className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium text-sm cursor-pointer"
                                                    >
                                                        <Eye className="h-4 w-4" />ดูรายละเอียด
                                                    </button>
                                                </div>
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

            {/* Modal ใช้ State และ Functions จาก Hook */}
            {showModal && (
                <EquipmentDetailModal
                    equipment={selectedEquipment}
                    loading={loadingDetail}
                    error={errorDetail}
                    onClose={closeDetailModal}
                    onRetry={() => selectedEquipment && retryFetchDetail(selectedEquipment.id)}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && editingEquipment && (
                <EditEquipmentModal
                    equipment={editingEquipment}
                    loading={loadingEdit}
                    error={errorEdit}
                    statuses={statuses}
                    types={types}
                    onClose={closeEditModal}
                    onSave={async (data) => {
                        await updateEquipment(editingEquipment.id, data);
                    }}
                    onDelete={async (id) => {
                        await deleteEquipment(id);
                        closeEditModal();
                    }}
                />
            )}

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 flex items-center justify-center group cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-6 w-6 group-hover:animate-bounce" />
                </button>
            )}
        </div>
    );

}