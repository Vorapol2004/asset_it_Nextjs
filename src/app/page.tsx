'use client';

import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Package } from 'lucide-react';
import footer from "@/component/Footer/Footer";
import Utcclogo from "@/component/img/Utcclogo.png";
import React from "react";
import Footer from "@/component/Footer/Footer";

/**
 * Landing Page - หน้าต้อนรับ
 */
export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src={Utcclogo.src}
                                alt="Logo"
                                className="h-8 w-8 mr-2"
                            />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                ระบบยืมอุปกรณ์
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push('/login')}
                                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-blue-100 p-6 rounded-full">
                            <img
                                src={Utcclogo.src}
                                alt="Logo"
                                className="h-24 w-24"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        ระบบบันทึกการยืมอุปกรณ์
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        จัดการและติดตามการยืม-คืนอุปกรณ์อย่างมีประสิทธิภาพ
                        <br />
                        ง่าย รวดเร็ว และปลอดภัย
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center text-lg shadow-lg cursor-pointer"
                        >
                            <LogIn className="h-6 w-6 mr-2" />
                            Login
                        </button>
                        <button
                            onClick={() => router.push('/register')}
                            className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-lg border-2 border-gray-300 transition-all transform hover:scale-105 flex items-center justify-center text-lg cursor-pointer"
                        >
                            <UserPlus className="h-6 w-6 mr-2" />
                            Register
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                        <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            จัดการอุปกรณ์
                        </h3>
                        <p className="text-gray-600">
                            เพิ่มและจัดการอุปกรณ์ได้ง่าย
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogIn className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            ยืม-คืนง่าย
                        </h3>
                        <p className="text-gray-600">
                            บันทึกการยืมและคืนได้อย่างรวดเร็ว
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                        <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            ติดตามประวัติ
                        </h3>
                        <p className="text-gray-600">
                            ดูประวัติการยืมทั้งหมดได้ทันที
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}