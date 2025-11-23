'use client';

import { History, Package, PlusCircle, Laptop } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from "@/component/Navbar/Navbar";
import { ROUTES } from '@/constants/routes';
import RouteProtection from '@/component/auth/RouteProtection';

export default function HomePage() {

    const router = useRouter();


    const handleHistoryClick = () => {
        console.log('Navigate to History Page');
        router.push(ROUTES.BORROW_HISTORY);
    };

    const handleBorrowReturnClick = () => {
        console.log('Navigate to Borrow Equipment Page');
        router.push(ROUTES.BORROW_EQUIPMENT);
    };

    const handleAddEquipmentClick = () => {
        console.log('Navigate to Add Equipment Page');
        router.push(ROUTES.ADD_EQUIPMENT);
    };

    const handleEquipmentClick = () => {
        console.log('Navigate to Equipment Page');
        router.push(ROUTES.EQUIPMENT);
    };


    return (
        <RouteProtection allowedRoles="authenticated">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            UTCC IT Asset Management System
                        </h1>
                        <p className="text-xl text-blue-100">
                            UTCC IAMS
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content - ปุ่มหลักทั้ง 4 ตัว */}
            <div className="mt-25 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* ปุ่มอุปกรณ์ */}
                    <div
                        onClick={handleEquipmentClick}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-6 border-l-4 border-indigo-500"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-indigo-100 p-4 rounded-full">
                                <Laptop className="h-12 w-12 text-indigo-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">อุปกรณ์</h3>
                        <p className="text-gray-600 text-center text-sm">
                            ดูรายการอุปกรณ์ทั้งหมดในระบบ
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

                    {/* ปุ่มประวัติการยืม */}
                    <div
                        onClick={handleHistoryClick}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-6 border-l-4 border-green-500"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-100 p-4 rounded-full">
                                <History className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">ประวัติการยืม</h3>
                        <p className="text-gray-600 text-center text-sm">
                            ดูประวัติการยืม-คืนอุปกรณ์ทั้งหมด
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </RouteProtection>
    );
}