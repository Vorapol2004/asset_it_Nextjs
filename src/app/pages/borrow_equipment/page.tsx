'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Package,
    ArrowLeft,
    Calendar,
    User,
    Plus,
    Trash2,
    Key,
    Monitor,
    Save,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from "@/component/Navbar/Navbar";
import Footer from "@/component/Footer/Footer";

export default function BorrowEquipmentPage() {
    const router = useRouter();

    // State สำหรับ Borrow Transactions
    const [borrowTransactions, setBorrowTransactions] = useState([]);

    // State สำหรับข้อมูล Equipment และ License
    const [equipmentList, setEquipmentList] = useState([]);
    const [licenseList, setLicenseList] = useState([]);

    // Mock Data
    const mockEquipment = [
        { id: 1, name: 'Dell OptiPlex 3080', serialNumber: 'EQP-001', category: 'คอมพิวเตอร์', status: 'ว่าง' },
        { id: 2, name: 'HP LaserJet Pro M404dn', serialNumber: 'EQP-002', category: 'อุปกรณ์สำนักงาน', status: 'ว่าง' },
        { id: 3, name: 'Canon EOS R6 Mark II', serialNumber: 'EQP-003', category: 'อุปกรณ์ถ่ายภาพ', status: 'ว่าง' },
        { id: 4, name: 'MacBook Pro 16"', serialNumber: 'EQP-004', category: 'คอมพิวเตอร์', status: 'ว่าง' },
        { id: 5, name: 'iPad Air', serialNumber: 'EQP-005', category: 'แท็บเล็ต', status: 'ว่าง' }
    ];

    const mockLicenses = [
        { id: 1, name: 'Microsoft Office 365', serialNumber: 'LIC-001', type: 'Software License', status: 'ว่าง' },
        { id: 2, name: 'Adobe Creative Suite', serialNumber: 'LIC-002', type: 'Software License', status: 'ว่าง' },
        { id: 3, name: 'Windows 11 Pro', serialNumber: 'LIC-003', type: 'OS License', status: 'ว่าง' },
        { id: 4, name: 'AutoCAD 2024', serialNumber: 'LIC-004', type: 'Software License', status: 'ว่าง' }
    ];

    useEffect(() => {
        setEquipmentList(mockEquipment);
        setLicenseList(mockLicenses);

        // เพิ่ม Borrow Transaction เริ่มต้น
        addNewBorrowTransaction();
    }, []);

    // ฟังก์ชันสำหรับจัดการ Borrow Transaction ใหญ่
    const addNewBorrowTransaction = () => {
        const newTransaction = {
            id: Date.now(),
            borrowerName: '',
            borrowerPhone: '',
            borrowerEmail: '',
            borrowDate: new Date().toISOString().split('T')[0],
            returnDate: '',
            purpose: '',
            notes: '',
            borrowItems: [] // รายการการยืมย่อย
        };
        setBorrowTransactions([...borrowTransactions, newTransaction]);
    };

    const removeBorrowTransaction = (transactionId) => {
        setBorrowTransactions(borrowTransactions.filter(t => t.id !== transactionId));
    };

    const updateBorrowTransaction = (transactionId, field, value) => {
        // @ts-ignore
        setBorrowTransactions(borrowTransactions.map(transaction =>
            transaction.id === transactionId
                ? { ...transaction, [field]: value }
                : transaction
        ));
    };

    // ฟังก์ชันสำหรับจัดการ Borrow Items ย่อย
    const addBorrowItem = (transactionId) => {
        const newItem = {
            id: Date.now(),
            type: 'equipment', // equipment หรือ license
            itemId: '',
            quantity: 1,
            notes: ''
        };

        // @ts-ignore
        setBorrowTransactions(borrowTransactions.map(transaction =>
            transaction.id === transactionId
                ? {
                    ...transaction,
                    borrowItems: [...transaction.borrowItems, newItem]
                }
                : transaction
        ));
    };

    const removeBorrowItem = (transactionId, itemId) => {
        // @ts-ignore
        setBorrowTransactions(borrowTransactions.map(transaction =>
            transaction.id === transactionId
                ? {
                    ...transaction,
                    borrowItems: transaction.borrowItems.filter(item => item.id !== itemId)
                }
                : transaction
        ));
    };

    const updateBorrowItem = (transactionId, itemId, field, value) => {
        setBorrowTransactions(borrowTransactions.map(transaction =>
            transaction.id === transactionId
                ? {
                    ...transaction,
                    borrowItems: transaction.borrowItems.map(item =>
                        item.id === itemId
                            ? { ...item, [field]: value }
                            : item
                    )
                }
                : transaction
        ));
    };

    const getItemOptions = (type) => {
        return type === 'equipment' ? equipmentList : licenseList;
    };

    const getSelectedItemDetails = (type, itemId) => {
        const items = getItemOptions(type);
        return items.find(item => item.id.toString() === itemId.toString());
    };

    const handleSubmitAll = async () => {
        // Validate
        const validTransactions = borrowTransactions.filter(t =>
            t.borrowerName.trim() &&
            t.borrowerPhone.trim() &&
            t.returnDate &&
            t.purpose.trim() &&
            t.borrowItems.length > 0 &&
            t.borrowItems.every(item => item.itemId)
        );

        if (validTransactions.length === 0) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วนและเพิ่มรายการยืมอย่างน้อย 1 รายการ');
            return;
        }

        console.log('Submitting borrow transactions:', validTransactions);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert(`บันทึกการยืมเรียบร้อยแล้ว! จำนวน ${validTransactions.length} รายการ`);

        // Reset form
        setBorrowTransactions([]);
        addNewBorrowTransaction();
    };

    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={handleGoBack}
                                className="mr-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <ArrowLeft className="h-6 w-6 text-white" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-white">การยืม-คืนอุปกรณ์</h1>
                                <p className="text-blue-100 mt-2">สร้างใบยืมอุปกรณ์และ License</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={addNewBorrowTransaction}
                                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                เพิ่มใบยืมใหม่
                            </button>
                            <button
                                onClick={handleSubmitAll}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
                            >
                                <Save className="h-5 w-5 mr-2" />
                                บันทึกทั้งหมด
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {borrowTransactions.map((transaction, transactionIndex) => (
                        <div key={transaction.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Transaction Header */}
                            <div className="bg-blue-50 border-b border-blue-100 p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-blue-800 flex items-center">
                                        <Package className="h-6 w-6 mr-2" />
                                        ใบยืมที่ {transactionIndex + 1}
                                    </h2>
                                    {borrowTransactions.length > 1 && (
                                        <button
                                            onClick={() => removeBorrowTransaction(transaction.id)}
                                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                {/* ข้อมูลผู้ยืม */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                        <User className="h-5 w-5 mr-2 text-blue-600" />
                                        ข้อมูลผู้ยืม
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ชื่อผู้ยืม <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={transaction.borrowerName}
                                                onChange={(e) => updateBorrowTransaction(transaction.id, 'borrowerName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="นาย/นางสาว ..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={transaction.borrowerPhone}
                                                onChange={(e) => updateBorrowTransaction(transaction.id, 'borrowerPhone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="08X-XXX-XXXX"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                อีเมล
                                            </label>
                                            <input
                                                type="email"
                                                value={transaction.borrowerEmail}
                                                onChange={(e) => updateBorrowTransaction(transaction.id, 'borrowerEmail', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="example@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                วันที่ยืม <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={transaction.borrowDate}
                                                onChange={(e) => updateBorrowTransaction(transaction.id, 'borrowDate', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                วันที่กำหนดคืน <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={transaction.returnDate}
                                                onChange={(e) => updateBorrowTransaction(transaction.id, 'returnDate', e.target.value)}
                                                min={transaction.borrowDate}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                วัตถุประสงค์ <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={transaction.purpose}
                                                onChange={(e) => updateBorrowTransaction(transaction.id, 'purpose', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="เช่น ใช้สำหรับการประชุม"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            หมายเหตุ
                                        </label>
                                        <textarea
                                            value={transaction.notes}
                                            onChange={(e) => updateBorrowTransaction(transaction.id, 'notes', e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="หมายเหตุเพิ่มเติม..."
                                        />
                                    </div>
                                </div>

                                {/* รายการยืม */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-800 flex items-center">
                                            <Package className="h-5 w-5 mr-2 text-blue-600" />
                                            รายการที่ต้องการยืม ({transaction.borrowItems.length} รายการ)
                                        </h3>
                                        <button
                                            onClick={() => addBorrowItem(transaction.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center text-sm"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            เพิ่มรายการ
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {transaction.borrowItems.map((item, itemIndex) => (
                                            <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h4 className="font-medium text-gray-800">รายการที่ {itemIndex + 1}</h4>
                                                    <button
                                                        onClick={() => removeBorrowItem(transaction.id, item.id)}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            ประเภท <span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            value={item.type}
                                                            onChange={(e) => {
                                                                updateBorrowItem(transaction.id, item.id, 'type', e.target.value);
                                                                updateBorrowItem(transaction.id, item.id, 'itemId', ''); // Reset item selection
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value="equipment">อุปกรณ์</option>
                                                            <option value="license">License</option>
                                                        </select>
                                                    </div>

                                                    <div className="lg:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            เลือกรายการ <span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            value={item.itemId}
                                                            onChange={(e) => updateBorrowItem(transaction.id, item.id, 'itemId', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value="">เลือก{item.type === 'equipment' ? 'อุปกรณ์' : 'License'}</option>
                                                            {getItemOptions(item.type)
                                                                .filter(option => option.status === 'ว่าง')
                                                                .map(option => (
                                                                    <option key={option.id} value={option.id}>
                                                                        {option.name} ({option.serialNumber})
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        {item.itemId && (
                                                            <div className="mt-2 flex items-center text-sm text-gray-600">
                                                                {item.type === 'equipment' ? (
                                                                    <Monitor className="h-4 w-4 mr-1" />
                                                                ) : (
                                                                    <Key className="h-4 w-4 mr-1" />
                                                                )}
                                                                {getSelectedItemDetails(item.type, item.itemId)?.serialNumber}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            จำนวน
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateBorrowItem(transaction.id, item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>

                                                    <div className="lg:col-span-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            หมายเหตุเพิ่มเติม
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.notes}
                                                            onChange={(e) => updateBorrowItem(transaction.id, item.id, 'notes', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="หมายเหตุสำหรับรายการนี้..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {transaction.borrowItems.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                                <p>ยังไม่มีรายการที่ต้องการยืม</p>
                                                <button
                                                    onClick={() => addBorrowItem(transaction.id)}
                                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    เพิ่มรายการแรก
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {borrowTransactions.length === 0 && (
                        <div className="text-center py-16">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีใบยืม</h3>
                            <p className="text-gray-500 mb-6">เริ่มต้นสร้างใบยืมอุปกรณ์ของคุณ</p>
                            <button
                                onClick={addNewBorrowTransaction}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center mx-auto"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                สร้างใบยืมใหม่
                            </button>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}