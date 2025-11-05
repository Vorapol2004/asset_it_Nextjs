'use client';

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
} from 'lucide-react';
import { useBorrowHistory } from '@/hooks/useBorrowHistory';

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
        STATUS_MAP,
        searchTerm,
        selectedStatus,
        selectedRole,
        selectedType,
        loading,
        error,
        setSearchTerm,
        setSelectedStatus,
        setSelectedRole,
        setSelectedType,
        setSelected,
        applyFilters,
        handleClearFilters,
        returnEquipmentItem,
    } = useBorrowHistory();

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                                    {statuses.map((status) => (
                                        <option key={status.id} value={status.id}>
                                            {status.borrowStatusName}
                                        </option>
                                    ))}
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
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.roleName}>
                                            {role.roleName}
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
                                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">ชื่อผู้ยืม</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">ตำแหน่ง</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">วันที่ยืม</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">จำนวนอุปกรณ์</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase">สถานะ</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase">จัดการ</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {groupedRecords.map((group, i) => {
                                    const status = STATUS_MAP[group.borrowStatusId];
                                    const StatusIcon = STATUS_ICONS[group.borrowStatusId];
                                    return (
                                        <tr key={group.id} className={`hover:bg-green-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-green-600">#{group.id}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-semibold text-gray-900">{group.employeeName}</div>
                                                <div className="text-xs text-gray-500">{group.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{group.roleName || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {new Date(group.borrowDate).toLocaleDateString('th-TH')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                                    {group.items.length} รายการ
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 w-fit ${status?.color || 'bg-gray-100 text-gray-700'}`}>
                                                    {StatusIcon && <StatusIcon className="h-3 w-3" />}
                                                    {status?.label || group.borrowStatusName}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => setSelected(group)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 mx-auto transition-colors"
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
                <div className="fixed inset-0 bg-opacity-50 flex backdrop-blur items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center rounded-t-xl">
                            <div>
                                <h2 className="text-2xl font-bold">รายละเอียดการยืม</h2>
                                <p className="text-sm opacity-90 mt-1">รหัส: #{selected.id}</p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* ข้อมูลผู้ยืม */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">ผู้ยืม</p>
                                    <p className="font-semibold text-gray-900">{selected.employeeName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">อีเมล</p>
                                    <p className="font-semibold text-gray-900">{selected.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">ตำแหน่ง</p>
                                    <p className="font-semibold text-gray-900">{selected.roleName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">วันที่ยืม</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(selected.borrowDate).toLocaleDateString('th-TH')}
                                    </p>
                                </div>
                            </div>

                            {selected.referenceDoc && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2 font-medium">วัตถุประสงค์</p>
                                    <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {selected.referenceDoc}
                                    </p>
                                </div>
                            )}

                            {/* รายการอุปกรณ์ทั้งหมด */}
                            <div>
                                <p className="text-sm text-gray-600 mb-3 font-semibold">
                                    รายการอุปกรณ์ ({selected.items.length} รายการ)
                                </p>
                                <div className="space-y-3">
                                    {selected.items.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {item.equipmentTypeName?.toLowerCase() === 'hardware' ? (
                                                        <Cpu className="h-4 w-4 text-blue-600" />
                                                    ) : (
                                                        <Key className="h-4 w-4 text-purple-600" />
                                                    )}
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        item.equipmentTypeName?.toLowerCase() === 'hardware'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {item.equipmentTypeName}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="font-semibold text-gray-900 mb-2">
                                                {`${item.brand || ''} ${item.model || ''}`.trim() || item.equipmentName || 'ไม่ระบุชื่อ'}
                                            </p>

                                            {item.serialNumber && (
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-600">Serial Number:</p>
                                                    <p className="text-sm font-mono font-semibold text-gray-900">{item.serialNumber}</p>
                                                </div>
                                            )}

                                            {item.licenseKey && (
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-600">License Key:</p>
                                                    <p className="text-sm font-mono font-semibold text-purple-900 bg-purple-50 p-2 rounded">
                                                        {item.licenseKey}
                                                    </p>
                                                </div>
                                            )}

                                            {item.dueDate && (
                                                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    กำหนดคืน: {new Date(item.dueDate).toLocaleDateString('th-TH')}
                                                </p>
                                            )}

                                            {item.returnDate ? (
                                                <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    คืนแล้ว: {new Date(item.returnDate).toLocaleDateString('th-TH')}
                                                </p>
                                            ) : (
                                                <button
                                                    onClick={async () => {
                                                        await returnEquipmentItem(item.borrowEquipmentId);
                                                        setSelected(null);
                                                    }}
                                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                                                >
                                                    <Undo2 className="h-4 w-4" /> คืนอุปกรณ์นี้
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 rounded-b-xl">
                            <button
                                onClick={() => setSelected(null)}
                                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
