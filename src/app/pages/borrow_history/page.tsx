'use client';

import { useState } from 'react';
import Navbar from '@/component/Navbar/Navbar';
import {
    RefreshCw,
    Search,
    Clock,
    CheckCircle,
    AlertCircle,
    Package,
    Eye,
    X,
    Cpu,
    Key,
    Undo2,
    Calendar,
    ChevronDown,
    User,
    Mail,
    Phone,
    Briefcase,
    Building2,
    UserCheck,
} from 'lucide-react';
import { useBorrowHistory } from '@/hooks/useBorrowHistory';
import { BorrowDetailModal } from './BorrowDetailModal';

const STATUS_ICONS: Record<number, React.ElementType> = {
    1: Clock,
    2: CheckCircle,
    3: Package,
    4: AlertCircle,
};

export default function BorrowHistoryPage() {
    const {
        groupedRecords,
        selected,
        statuses,
        roles,
        equipmentTypes,
        equipmentStatuses,
        returnEquipmentStatuses,
        STATUS_MAP,
        searchTerm,
        selectedStatus,
        selectedRole,
        selectedType,
        loading,
        selectedLoading,
        error,
        setSearchTerm,
        setSelectedStatus,
        setSelectedRole,
        setSelectedType,
        setSelected,
        applyFilters,
        handleClearFilters,
        returnEquipmentItem,
        loadBorrowDetails,
    } = useBorrowHistory();

    // State สำหรับเลือกสถานะอุปกรณ์ก่อนคืน (ใช้ combination key: "borrowId-equipmentId")
    const [selectedReturnStatus, setSelectedReturnStatus] = useState<Record<string, number>>({});

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-600 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">ประวัติการยืมอุปกรณ์</h1>
                        <p className="text-gray-600">ทั้งหมด {groupedRecords.length} ธุรกรรม ({groupedRecords.reduce((sum, g) => sum + g.items.length, 0)} รายการอุปกรณ์)</p>
                    </div>
                    <button
                        onClick={() => {
                            handleClearFilters();
                            applyFilters();
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium disabled:opacity-50 transition-colors"
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
                                    placeholder="ค้นหาชื่อผู้ยืม, อุปกรณ์, Serial Number, License Key..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            applyFilters();
                                        }
                                    }}
                                    disabled={loading}
                                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg outline-none text-gray-700 font-medium placeholder:text-gray-400 focus:border-green-500 disabled:opacity-50 disabled:bg-gray-50 transition-colors"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={applyFilters}
                                disabled={loading}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                <Search className="h-5 w-5" />
                                ค้นหา
                            </button>
                        </div>
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* สถานะการยืม */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                สถานะการยืม
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg outline-none text-gray-700 font-medium bg-white focus:border-green-500 disabled:opacity-50 disabled:bg-gray-50 appearance-none cursor-pointer transition-colors"
                                >
                                    <option value="all">ทั้งหมด</option>
                                    {statuses && statuses.length > 0 ? (
                                        statuses.map((status) => (
                                            <option key={status.id} value={status.id}>
                                                {status.borrowStatusName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="all" disabled>กำลังโหลด...</option>
                                    )}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* ตำแหน่ง */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                ตำแหน่ง
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg outline-none text-gray-700 font-medium bg-white focus:border-green-500 disabled:opacity-50 disabled:bg-gray-50 appearance-none cursor-pointer transition-colors"
                                >
                                    <option value="all">ทุกตำแหน่ง</option>
                                    {roles && roles.length > 0 ? (
                                        roles.map((role) => (
                                            <option key={role.id} value={role.roleName}>
                                                {role.roleName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="all" disabled>กำลังโหลด...</option>
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
                            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            ล้างฟิลเตอร์
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center py-20">
                            <RefreshCw className="w-12 h-12 text-green-600 animate-spin mb-4" />
                            <span className="text-gray-600 font-medium">กำลังโหลด...</span>
                        </div>
                    ) : groupedRecords.length === 0 ? (
                        <div className="flex flex-col items-center py-20">
                            <Package className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">ไม่พบข้อมูล</h3>
                            <p className="text-gray-500">ไม่มีรายการที่ตรงกับเงื่อนไขที่เลือก</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-gradient-to-r from-green-600 to-green-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">ชื่อผู้ยืม</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase">ตำแหน่ง</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase">วันที่ยืม</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase">จำนวนอุปกรณ์</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase">สถานะ</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase">จัดการ</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {groupedRecords.map((group, i) => {
                                    const status = STATUS_MAP[group.borrowStatusId];
                                    return (
                                        <tr key={group.id} className={`hover:bg-green-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            
                                            <td className="px-4 py-3 text-left">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {group.employeeName?.trim() || 
                                                     `${group.firstName || ''} ${group.lastName || ''}`.trim() || 
                                                     'ไม่ระบุชื่อ'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 text-center">
                                                {group.roleName || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 text-center">
                                                {new Date(group.borrowDate).toLocaleDateString('th-TH')}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                                    {group.borrowEquipmentCount ?? group.items.length} รายการ
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${status?.color || 'bg-gray-100 text-gray-700'}`}>
                                                        {status?.label || group.borrowStatusName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => loadBorrowDetails(group.id)}
                                                    disabled={selectedLoading}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1 mx-auto transition-colors"
                                                >
                                                    <Eye className="h-4 w-4" /> ดูรายละเอียด
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - แสดงรายการอุปกรณ์ทั้งหมดในธุรกรรม */}
            {selected && (
                <BorrowDetailModal
                    selected={selected}
                    selectedLoading={selectedLoading}
                    returnEquipmentStatuses={returnEquipmentStatuses}
                    selectedReturnStatus={selectedReturnStatus}
                    setSelectedReturnStatus={setSelectedReturnStatus}
                    onClose={() => setSelected(null)}
                    onReturnEquipment={returnEquipmentItem}
                />
            )}
        </div>
    );
}
