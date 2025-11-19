'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import RouteProtection from '@/component/auth/RouteProtection';
import {
    Package,
    Plus,
    History,
    ArrowRight,
    User,
    MapPin,
    Calendar,
    CheckCircle,
    ClipboardList,
    Search,
} from 'lucide-react';
import {ROUTES} from "@/constants/routes";

export default function BorrowEquipmentLandingPage() {
    const router = useRouter();

    return (
        <RouteProtection allowedRoles="authenticated">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Compact Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                        <Package className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        ระบบยืม-คืนอุปกรณ์
                    </h1>
                    <p className="text-lg text-gray-600">
                        เลือกเมนูด้านล่างเพื่อดำเนินการ
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6">
                    {/* ผู้ยืมใหม่ */}
                    <div
                        onClick={() => router.push(ROUTES.NEW_BORROW)}
                        className="group cursor-pointer"
                    >
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-1 h-full">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>

                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <div className="bg-opacity-20 p-2 rounded-lg inline-block mb-3">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-1">ผู้ยืมใหม่</h2>
                                        <p className="text-blue-100 text-sm">สร้างรายการยืมอุปกรณ์ใหม่</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-center text-sm">
                                        <div className="bg-blue-100 rounded-full p-1 mr-2">
                                            <User className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700">กรอกข้อมูลผู้ยืม</span>
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <div className="bg-blue-100 rounded-full p-1 mr-2">
                                            <MapPin className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700">เลือกสถานที่และหน่วยงาน</span>
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <div className="bg-blue-100 rounded-full p-1 mr-2">
                                            <Package className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700">เลือกอุปกรณ์ที่ต้องการยืม</span>
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <div className="bg-blue-100 rounded-full p-1 mr-2">
                                            <Calendar className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700">กำหนดวันคืนอุปกรณ์</span>
                                    </li>
                                </ul>

                                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all group-hover:gap-3 cursor-pointer">
                                    เริ่มยืมอุปกรณ์
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ผู้ยืมเก่า */}
                    <div
                        onClick={() => router.push(ROUTES.OLD_BORROW)}
                        className="group cursor-pointer"
                    >
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-500 transform hover:-translate-y-1 h-full">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>

                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <div className="bg-opacity-20 p-2 rounded-lg inline-block mb-3">
                                            <History className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-1">ผู้ยืมเก่า</h2>
                                        <p className="text-purple-100 text-sm">ทำรายการสำหรับผู้ยืมเก่า</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-center text-sm">
                                        <div className="bg-purple-100 rounded-full p-1 mr-2">
                                            <ClipboardList className="h-3 w-3 text-purple-600" />
                                        </div>
                                        <span className="text-gray-700">ค้นหาและเลือกชื่อผู้ที่เคยยืม</span>
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <div className="bg-purple-100 rounded-full p-1 mr-2">
                                            <MapPin className="h-3 w-3 text-purple-600" />
                                        </div>
                                        <span className="text-gray-700">เลือกสถานที่และหน่วยงาน</span>
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <div className="bg-purple-100 rounded-full p-1 mr-2">
                                            <Search className="h-3 w-3 text-purple-600" />
                                        </div>
                                        <span className="text-gray-700">ค้นหาและกรองข้อมูล</span>
                                    </li>
                                    <li className="flex items-center text-sm">
                                        <div className="bg-purple-100 rounded-full p-1 mr-2">
                                            <CheckCircle className="h-3 w-3 text-purple-600" />
                                        </div>
                                        <span className="text-gray-700">สะดวกและรวดเร็ว</span>
                                    </li>
                                </ul>

                                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all group-hover:gap-3 cursor-pointer">
                                    สำหรับผู้ยืมเก่า
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </RouteProtection>
    );
}