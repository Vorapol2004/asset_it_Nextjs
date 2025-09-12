'use client';

import { Search, Package, PlusCircle } from 'lucide-react';
import Navbar from '../component/Navbar/Navbar';
import Footer from '../component/Footer/Footer';

// Main Home Component
export default function HomePage() {
    const handleSearchClick = () => {
        // Navigate to search page
        console.log('Navigate to Search Page');
        // ใน Next.js จะใช้ router.push('/search')
        window.location.href = '/search';
    };

    const handleBorrowReturnClick = () => {
        // Navigate to borrow_equipment page
        console.log('Navigate to Borrow Equipment Page');
        // ใน Next.js จะใช้ router.push('/borrow_equipment')
        window.location.href = '/borrow_equipment';
    };

    const handleAddEquipmentClick = () => {
        // Navigate to add_equipment page
        console.log('Navigate to Add Equipment Page');
        // ใน Next.js จะใช้ router.push('/add_equipment')
        window.location.href = '/add_equipment';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            ระบบบันทึกการยืมอุปกรณ์
                        </h1>
                        <p className="text-xl text-blue-100">
                            จัดการและติดตามการยืม-คืนอุปกรณ์อย่างมีประสิทธิภาพ
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content - ปุ่มหลักทั้ง 3 ตัว */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* ปุ่มค้นหาผู้ยืม */}
                    <div
                        onClick={handleSearchClick}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-6 border-l-4 border-green-500"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-100 p-4 rounded-full">
                                <Search className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">ค้นหาผู้ยืม</h3>
                        <p className="text-gray-600 text-center text-sm">
                            ค้นหาข้อมูลผู้ที่มายืมอุปกรณ์และดูรายละเอียดการยืม
                        </p>
                    </div>

                    {/* ปุ่มการยืม-คืนอุปกรณ์ */}
                    <div
                        onClick={handleBorrowReturnClick}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-6 border-l-4 border-blue-500"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <Package className="h-12 w-12 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">การยืม-คืนอุปกรณ์</h3>
                        <p className="text-gray-600 text-center text-sm">
                            จัดการการยืมและการคืนอุปกรณ์ต่างๆ
                        </p>
                    </div>

                    {/* ปุ่มเพิ่มอุปกรณ์ */}
                    <div
                        onClick={handleAddEquipmentClick}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-6 border-l-4 border-purple-500"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-purple-100 p-4 rounded-full">
                                <PlusCircle className="h-12 w-12 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">เพิ่มอุปกรณ์</h3>
                        <p className="text-gray-600 text-center text-sm">
                            เพิ่มอุปกรณ์ใหม่เข้าสู่ระบบ
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                        <div className="text-gray-600">อุปกรณ์ที่ยืมออกไป</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                        <div className="text-gray-600">อุปกรณ์ทั้งหมด</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                        <div className="text-gray-600">การยืมในวันนี้</div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}