'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, User, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Navbar from '../../../component/Navbar/Navbar';

// Mock data for borrow history
const mockBorrowHistory = [
    {
        id: 1,
        borrowerName: "สมชาย ใจดี",
        studentId: "64010001",
        equipment: "โปรเจคเตอร์ Epson EB-S41",
        equipmentCode: "PROJ-001",
        borrowDate: "2024-01-15",
        returnDate: "2024-01-17",
        dueDate: "2024-01-20",
        status: "returned",
        notes: "อุปกรณ์ปกติ คืนตามกำหนด"
    },
    {
        id: 2,
        borrowerName: "สมหญิง รักเรียน",
        studentId: "64010002",
        equipment: "กล้อง DSLR Canon EOS 850D",
        equipmentCode: "CAM-005",
        borrowDate: "2024-01-18",
        returnDate: null,
        dueDate: "2024-01-25",
        status: "borrowed",
        notes: "ยืมสำหรับโปรเจคถ่ายภาพ"
    },
    {
        id: 3,
        borrowerName: "วิชัย ขยันเรียน",
        studentId: "64010003",
        equipment: "ไมโครโฟน Wireless Shure",
        equipmentCode: "MIC-012",
        borrowDate: "2024-01-20",
        returnDate: null,
        dueDate: "2024-01-22",
        status: "overdue",
        notes: "ใช้งานสำหรับการนำเสนอ"
    },
    {
        id: 4,
        borrowerName: "มาลี สวยงาม",
        studentId: "64010004",
        equipment: "แท็บเล็ต iPad Air",
        equipmentCode: "TAB-008",
        borrowDate: "2024-01-12",
        returnDate: "2024-01-15",
        dueDate: "2024-01-19",
        status: "returned",
        notes: "ใช้งานปกติ"
    },
    {
        id: 5,
        borrowerName: "ประชา ดีงาม",
        studentId: "64010005",
        equipment: "ลำโพงบลูทูธ JBL Charge 5",
        equipmentCode: "SPK-003",
        borrowDate: "2024-01-22",
        returnDate: null,
        dueDate: "2024-01-24",
        status: "borrowed",
        notes: "ใช้งานสำหรับกิจกรรม"
    }
];

export default function BorrowHistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');

    // Filter logic
    const filteredHistory = mockBorrowHistory.filter(item => {
        const matchesSearch =
            item.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.studentId.includes(searchTerm) ||
            item.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'returned':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        คืนแล้ว
                    </span>
                );
            case 'borrowed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="h-3 w-3 mr-1" />
                        กำลังยืม
                    </span>
                );
            case 'overdue':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        เกินกำหนด
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        ไม่ทราบสถานะ
                    </span>
                );
        }
    };

    const formatDate = (dateString: string | number | Date | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/*เรียกใช้ Nav*/}
            <Navbar />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ประวัติการยืม-คืนอุปกรณ์</h1>
                            <p className="text-gray-600 mt-1">ดูประวัติการยืมและคืนอุปกรณ์ทั้งหมด</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">ข้อมูลทั้งหมด</div>
                            <div className="text-2xl font-bold text-blue-600">{filteredHistory.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อ, รหัสนักศึกษา, หรืออุปกรณ์..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 "
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">สถานะทั้งหมด</option>
                                <option value="borrowed">กำลังยืม</option>
                                <option value="returned">คืนแล้ว</option>
                                <option value="overdue">เกินกำหนด</option>
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-700" />
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2  appearance-none text-gray-700"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                            >
                                <option value="all">ช่วงเวลาทั้งหมด</option>
                                <option value="today">วันนี้</option>
                                <option value="week">สัปดาห์นี้</option>
                                <option value="month">เดือนนี้</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {mockBorrowHistory.length}
                        </div>
                        <div className="text-sm text-gray-600">รายการทั้งหมด</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {mockBorrowHistory.filter(item => item.status === 'returned').length}
                        </div>
                        <div className="text-sm text-gray-600">คืนแล้ว</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {mockBorrowHistory.filter(item => item.status === 'borrowed').length}
                        </div>
                        <div className="text-sm text-gray-600">กำลังยืม</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {mockBorrowHistory.filter(item => item.status === 'overdue').length}
                        </div>
                        <div className="text-sm text-gray-600">เกินกำหนด</div>
                    </div>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ผู้ยืม
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    อุปกรณ์
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    วันที่ยืม
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    กำหนดคืน
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    วันที่คืน
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    สถานะ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    หมายเหตุ
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.borrowerName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.studentId}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-green-600" />
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.equipment}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.equipmentCode}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(item.borrowDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(item.dueDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(item.returnDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {item.notes}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredHistory.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูล</h3>
                            <p className="text-gray-500">ไม่มีประวัติการยืมที่ตรงกับการค้นหา</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}