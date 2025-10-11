'use client';

import { useState } from 'react';
import Navbar from '@/component/Navbar/Navbar';
import {
    Package, CheckCircle, Clock, AlertCircle, Eye, Search, Filter, X,
    Laptop, Key, Mail, Check, AlertTriangle, Calendar
} from 'lucide-react';

interface BorrowItem {
    id: string;
    equipmentName: string;
    serialNumber: string;
    type: 'hardware' | 'license';
    status: 'borrowed' | 'returned';
    returnDate?: string;
    returnNotes?: string;
    condition?: 'good' | 'damaged' | 'lost';
}

interface BorrowRecord {
    id: string;
    borrowerName: string;
    borrowerEmail: string;
    approvedBy: string;
    borrowDate: string;
    returnDate: string;
    actualReturnDate?: string;
    status: 'borrowed' | 'returned' | 'overdue' | 'partial_return';
    purpose: string;
    items: BorrowItem[];
}

const mockBorrowRecords: BorrowRecord[] = [
    {
        id: '1',
        borrowerName: 'สมชาย ใจดี',
        borrowerEmail: 'somchai@example.com',
        approvedBy: 'อาจารย์สมศักดิ์',
        borrowDate: '2025-09-15',
        returnDate: '2025-09-22',
        status: 'borrowed',
        purpose: 'ใช้ในการพัฒนาโปรเจค Senior Project',
        items: [
            {
                id: '1-1',
                equipmentName: 'Notebook Dell Latitude 5420',
                serialNumber: 'DL-2024-001',
                type: 'hardware',
                status: 'borrowed'
            },
            {
                id: '1-2',
                equipmentName: 'Microsoft Office 365',
                serialNumber: 'MS-LIC-2024-050',
                type: 'license',
                status: 'borrowed'
            }
        ]
    },
    {
        id: '2',
        borrowerName: 'สมหญิง รักเรียน',
        borrowerEmail: 'somying@example.com',
        approvedBy: 'อาจารย์สมบัติ',
        borrowDate: '2025-08-20',
        returnDate: '2025-09-05',
        actualReturnDate: '2025-09-04',
        status: 'returned',
        purpose: 'ทำงานวิจัย',
        items: [
            {
                id: '2-1',
                equipmentName: 'iPad Pro 12.9"',
                serialNumber: 'IP-2024-015',
                type: 'hardware',
                status: 'returned',
                returnDate: '2025-09-04',
                condition: 'good',
                returnNotes: 'คืนในสภาพดี ไม่มีปัญหา'
            }
        ]
    },
    {
        id: '3',
        borrowerName: 'วิชัย มั่นใจ',
        borrowerEmail: 'wichai@example.com',
        approvedBy: 'อาจารย์สมพงษ์',
        borrowDate: '2025-08-01',
        returnDate: '2025-08-15',
        status: 'overdue',
        purpose: 'ใช้ในการสอน Workshop',
        items: [
            {
                id: '3-1',
                equipmentName: 'Projector Epson EB-2250U',
                serialNumber: 'EP-2023-008',
                type: 'hardware',
                status: 'borrowed'
            },
            {
                id: '3-2',
                equipmentName: 'HDMI Cable 5m',
                serialNumber: 'HD-2023-025',
                type: 'hardware',
                status: 'borrowed'
            }
        ]
    },
    {
        id: '4',
        borrowerName: 'มานี ขยัน',
        borrowerEmail: 'manee@example.com',
        approvedBy: 'อาจารย์สมชาย',
        borrowDate: '2025-09-10',
        returnDate: '2025-09-24',
        status: 'partial_return',
        purpose: 'งานวิจัยด้าน AI และ Machine Learning',
        items: [
            {
                id: '4-1',
                equipmentName: 'Notebook HP ZBook Studio G8',
                serialNumber: 'HP-2024-012',
                type: 'hardware',
                status: 'returned',
                returnDate: '2025-09-20',
                condition: 'good',
                returnNotes: 'คืนเครื่องแรก สภาพดี'
            },
            {
                id: '4-2',
                equipmentName: 'Adobe Creative Cloud',
                serialNumber: 'AD-LIC-2024-033',
                type: 'license',
                status: 'borrowed'
            },
            {
                id: '4-3',
                equipmentName: 'External SSD 1TB',
                serialNumber: 'SSD-2024-045',
                type: 'hardware',
                status: 'borrowed'
            }
        ]
    },
    {
        id: '5',
        borrowerName: 'ทศพร เก่งกาจ',
        borrowerEmail: 'tossaporn@example.com',
        approvedBy: 'อาจารย์สมศักดิ์',
        borrowDate: '2025-07-15',
        returnDate: '2025-07-30',
        actualReturnDate: '2025-07-30',
        status: 'returned',
        purpose: 'ใช้สำหรับการถ่ายทำ VDO Content',
        items: [
            {
                id: '5-1',
                equipmentName: 'Camera Canon EOS R6',
                serialNumber: 'CN-2023-005',
                type: 'hardware',
                status: 'returned',
                returnDate: '2025-07-30',
                condition: 'good',
                returnNotes: 'ใช้งานเรียบร้อย ทำความสะอาดเรียบร้อยแล้ว'
            },
            {
                id: '5-2',
                equipmentName: 'Microphone Rode VideoMic Pro',
                serialNumber: 'RD-2023-012',
                type: 'hardware',
                status: 'returned',
                returnDate: '2025-07-30',
                condition: 'good',
                returnNotes: 'ใช้งานเรียบร้อย'
            }
        ]
    }
];

export default function BorrowHistoryPage() {
    const [records, setRecords] = useState<BorrowRecord[]>(mockBorrowRecords);
    const [filteredRecords, setFilteredRecords] = useState<BorrowRecord[]>(mockBorrowRecords);
    const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(null);
    const [selectedItem, setSelectedItem] = useState<BorrowItem | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnNotes, setReturnNotes] = useState('');
    const [condition, setCondition] = useState<'good' | 'damaged' | 'lost'>('good');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'borrowed' | 'returned' | 'overdue' | 'partial_return'>('all');
    const [dateFilter, setDateFilter] = useState('');

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        filterRecords(term, statusFilter, dateFilter);
    };

    const handleStatusFilter = (status: typeof statusFilter) => {
        setStatusFilter(status);
        filterRecords(searchTerm, status, dateFilter);
    };

    const handleDateFilter = (date: string) => {
        setDateFilter(date);
        filterRecords(searchTerm, statusFilter, date);
    };

    const filterRecords = (search: string, status: typeof statusFilter, date: string) => {
        let filtered = records;

        if (search) {
            filtered = filtered.filter(record =>
                record.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
                record.borrowerEmail.toLowerCase().includes(search.toLowerCase()) ||
                record.items.some(item => item.equipmentName.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (status !== 'all') {
            filtered = filtered.filter(record => record.status === status);
        }

        if (date) {
            filtered = filtered.filter(record => record.borrowDate === date);
        }

        setFilteredRecords(filtered);
    };

    const handleReturnItem = () => {
        if (!selectedRecord || !selectedItem) return;

        const updatedRecords = records.map(record => {
            if (record.id === selectedRecord.id) {
                const updatedItems = record.items.map(item =>
                    item.id === selectedItem.id
                        ? {
                            ...item,
                            status: 'returned' as const,
                            returnDate: new Date().toISOString().split('T')[0],
                            returnNotes,
                            condition
                        }
                        : item
                );

                // ตรวจสอบสถานะของ record
                const allReturned = updatedItems.every(item => item.status === 'returned');
                const someReturned = updatedItems.some(item => item.status === 'returned');

                let newStatus: 'borrowed' | 'returned' | 'overdue' | 'partial_return' = record.status;
                if (allReturned) {
                    newStatus = 'returned';
                } else if (someReturned) {
                    newStatus = 'partial_return';
                }

                return {
                    ...record,
                    items: updatedItems,
                    status: newStatus,
                    actualReturnDate: allReturned ? new Date().toISOString().split('T')[0] : record.actualReturnDate
                };
            }
            return record;
        });

        setRecords(updatedRecords);
        filterRecords(searchTerm, statusFilter, dateFilter);
        setShowReturnModal(false);
        setReturnNotes('');
        setCondition('good');
        setSelectedItem(null);
        alert('บันทึกการคืนสำเร็จ!');
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            borrowed: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            returned: 'bg-green-100 text-green-800 border-green-300',
            overdue: 'bg-red-100 text-red-800 border-red-300',
            partial_return: 'bg-blue-100 text-blue-800 border-blue-300'
        };

        const icons = {
            borrowed: <Clock className="h-4 w-4 mr-1" />,
            returned: <CheckCircle className="h-4 w-4 mr-1" />,
            overdue: <AlertCircle className="h-4 w-4 mr-1" />,
            partial_return: <Package className="h-4 w-4 mr-1" />
        };

        const labels = {
            borrowed: 'กำลังยืม',
            returned: 'คืนแล้ว',
            overdue: 'เกินกำหนด',
            partial_return: 'คืนบางส่วน'
        };

        return (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 inline-flex items-center ${styles[status as keyof typeof styles]}`}>
                {icons[status as keyof typeof icons]}
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const getConditionBadge = (condition?: string) => {
        if (!condition) return null;

        const styles = {
            good: 'bg-green-100 text-green-800',
            damaged: 'bg-orange-100 text-orange-800',
            lost: 'bg-red-100 text-red-800'
        };

        const icons = {
            good: <Check className="h-3 w-3 mr-1" />,
            damaged: <AlertTriangle className="h-3 w-3 mr-1" />,
            lost: <X className="h-3 w-3 mr-1" />
        };

        const labels = {
            good: 'สภาพดี',
            damaged: 'ชำรุด',
            lost: 'สูญหาย'
        };

        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold inline-flex items-center ${styles[condition as keyof typeof styles]}`}>
                {icons[condition as keyof typeof icons]}
                {labels[condition as keyof typeof labels]}
            </span>
        );
    };

    const getItemStatusBadge = (status: string) => {
        if (status === 'returned') {
            return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">คืนแล้ว</span>;
        }
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">ยืมอยู่</span>;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ประวัติการยืม</h1>
                    <p className="text-gray-600">รายการการยืมอุปกรณ์ทั้งหมด</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                <Search className="inline h-4 w-4 mr-1" />
                                ค้นหา
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="ค้นหาชื่อผู้ยืม, อีเมล, หรือชื่ออุปกรณ์..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                กรองตามวันที่ยืม
                            </label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => handleDateFilter(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                <Filter className="inline h-4 w-4 mr-1" />
                                กรองสถานะ
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleStatusFilter('all')}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                        statusFilter === 'all'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    ทั้งหมด
                                </button>
                                <button
                                    onClick={() => handleStatusFilter('borrowed')}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                        statusFilter === 'borrowed'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    กำลังยืม
                                </button>
                                <button
                                    onClick={() => handleStatusFilter('partial_return')}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                        statusFilter === 'partial_return'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    คืนบางส่วน
                                </button>
                                <button
                                    onClick={() => handleStatusFilter('returned')}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                        statusFilter === 'returned'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    คืนแล้ว
                                </button>
                                <button
                                    onClick={() => handleStatusFilter('overdue')}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                        statusFilter === 'overdue'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    เกินกำหนด
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ปุ่มล้างฟิลเตอร์ */}
                    {(searchTerm || statusFilter !== 'all' || dateFilter) && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setDateFilter('');
                                    setFilteredRecords(records);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium flex items-center"
                            >
                                <X className="h-4 w-4 mr-1" />
                                ล้างฟิลเตอร์
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid gap-4">
                    {filteredRecords.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบข้อมูล</h3>
                            <p className="text-gray-600">ไม่มีรายการที่ตรงกับเงื่อนไขที่ค้นหา</p>
                        </div>
                    ) : (
                        filteredRecords.map(record => (
                            <div key={record.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-green-300 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{record.borrowerName}</h3>
                                            {getStatusBadge(record.status)}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-1 flex items-center">
                                            <Mail className="h-4 w-4 mr-1" />
                                            {record.borrowerEmail}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-1 flex items-center">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            อนุมัติโดย: <span className="font-semibold ml-1">{record.approvedBy}</span>
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            ยืม: <span className="font-semibold">{new Date(record.borrowDate).toLocaleDateString('th-TH')}</span> |
                                            กำหนดคืน: <span className="font-semibold">{new Date(record.returnDate).toLocaleDateString('th-TH')}</span>
                                            {record.actualReturnDate && (
                                                <> | คืนจริง: <span className="font-semibold text-green-600">{new Date(record.actualReturnDate).toLocaleDateString('th-TH')}</span></>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                        <Package className="h-4 w-4 mr-2 text-green-600" />
                                        รายการที่ยืม: ({record.items.length} รายการ)
                                    </h4>
                                    <ul className="space-y-2">
                                        {record.items.map((item) => (
                                            <li key={item.id} className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold inline-flex items-center ${
                                                            item.type === 'hardware' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {item.type === 'hardware' ? (
                                                                <>
                                                                    <Laptop className="h-3 w-3 mr-1" />
                                                                    Hardware
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Key className="h-3 w-3 mr-1" />
                                                                    License
                                                                </>
                                                            )}
                                                        </span>
                                                        {getItemStatusBadge(item.status)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="font-medium">{item.equipmentName}</span>
                                                        <span className="text-gray-500 ml-2">(SN: {item.serialNumber})</span>
                                                    </div>
                                                    {item.status === 'borrowed' && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRecord(record);
                                                                setSelectedItem(item);
                                                                setShowReturnModal(true);
                                                            }}
                                                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium"
                                                        >
                                                            คืนรายการนี้
                                                        </button>
                                                    )}
                                                </div>
                                                {item.status === 'returned' && item.condition && (
                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                        <div className="flex items-center gap-2">
                                                            {getConditionBadge(item.condition)}
                                                            {item.returnNotes && (
                                                                <span className="text-xs text-gray-600">หมายเหตุ: {item.returnNotes}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">วัตถุประสงค์:</span> {record.purpose}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedRecord(record);
                                            setShowDetailModal(true);
                                        }}
                                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center font-medium transition-colors"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        ดูรายละเอียด
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedRecord && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">รายละเอียดการยืม</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">สถานะ:</h3>
                                {getStatusBadge(selectedRecord.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">ผู้ยืม</p>
                                    <p className="font-semibold text-gray-900">{selectedRecord.borrowerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">อีเมล</p>
                                    <p className="font-semibold text-gray-900">{selectedRecord.borrowerEmail}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">ผู้อนุมัติ</p>
                                    <p className="font-semibold text-gray-900">{selectedRecord.approvedBy}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">วันที่ยืม</p>
                                    <p className="font-semibold text-gray-900">{new Date(selectedRecord.borrowDate).toLocaleDateString('th-TH')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">กำหนดคืน</p>
                                    <p className="font-semibold text-gray-900">{new Date(selectedRecord.returnDate).toLocaleDateString('th-TH')}</p>
                                </div>
                                {selectedRecord.actualReturnDate && (
                                    <div>
                                        <p className="text-sm text-gray-600">คืนจริง</p>
                                        <p className="font-semibold text-green-600">{new Date(selectedRecord.actualReturnDate).toLocaleDateString('th-TH')}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">วัตถุประสงค์</p>
                                <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRecord.purpose}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">รายการที่ยืม ({selectedRecord.items.length} รายการ)</p>
                                <div className="space-y-2">
                                    {selectedRecord.items.map((item) => (
                                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold inline-flex items-center ${
                                                        item.type === 'hardware' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {item.type === 'hardware' ? (
                                                            <>
                                                                <Laptop className="h-3 w-3 mr-1" />
                                                                Hardware
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Key className="h-3 w-3 mr-1" />
                                                                License
                                                            </>
                                                        )}
                                                    </span>
                                                    {getItemStatusBadge(item.status)}
                                                    {item.condition && getConditionBadge(item.condition)}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-semibold">{item.equipmentName}</span>
                                                    <span className="text-sm text-gray-600 ml-2">SN: {item.serialNumber}</span>
                                                </div>
                                            </div>
                                            {item.returnNotes && (
                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                    <p className="text-xs text-gray-600">หมายเหตุ: {item.returnNotes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Modal */}
            {showReturnModal && selectedRecord && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
                        <div className="bg-green-600 text-white p-6 rounded-t-xl">
                            <h2 className="text-2xl font-bold">คืนอุปกรณ์</h2>
                            <p className="text-green-100 text-sm mt-1">
                                คืน: {selectedItem.equipmentName}
                            </p>
                            <p className="text-green-100 text-xs">SN: {selectedItem.serialNumber}</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    สภาพอุปกรณ์ <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value as any)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-medium"
                                >
                                    <option value="good">ปกติ - ใช้งานได้ดี</option>
                                    <option value="damaged">ชำรุด - มีความเสียหาย</option>
                                    <option value="lost">สูญหาย</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    หมายเหตุ
                                </label>
                                <textarea
                                    value={returnNotes}
                                    onChange={(e) => setReturnNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="ระบุรายละเอียดเพิ่มเติม เช่น สภาพการใช้งาน, ปัญหาที่พบ (ถ้ามี)..."
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3">
                            <button
                                onClick={() => {
                                    setShowReturnModal(false);
                                    setReturnNotes('');
                                    setCondition('good');
                                    setSelectedItem(null);
                                }}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleReturnItem}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md transition-colors"
                            >
                                บันทึกการคืน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}