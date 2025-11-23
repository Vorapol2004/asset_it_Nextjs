'use client';

import { useRouter } from 'next/navigation';
import { LogIn, Package, History } from 'lucide-react';
import Image from 'next/image';
import LogoUtcc from "@/component/img/Utcclogo.png";
import React from "react";
import Footer from "@/component/Footer/Footer";

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <nav className="bg-white shadow-sm flex-none">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                    {/* Logo + Text */}
                    <div className="flex items-center">
                        <div className="relative h-10 w-10 mr-3 flex-shrink-0">
                            <Image
                                src={LogoUtcc}
                                alt="UTCC Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            UTCC IAMS
                        </span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center items-center px-4">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="relative h-24 w-24">
                        <Image
                            src={LogoUtcc}
                            alt="UTCC Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
                    UTCC IT Asset Management System
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 text-center">
                    จัดการและติดตามการยืม-คืนอุปกรณ์ภายในมหาวิทยาลัยหอการค้าไทย
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md text-lg transition-all transform hover:scale-105 flex items-center justify-center shadow-md cursor-pointer"
                    >
                        <LogIn className="h-6 w-6 mr-2" />
                        Login
                    </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-md transition-shadow">
                        <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            จัดการอุปกรณ์
                        </h3>
                        <p className="text-sm text-gray-600">
                            เพิ่มและจัดการอุปกรณ์ได้ง่าย
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-md transition-shadow">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogIn className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            ยืม-คืนง่าย
                        </h3>
                        <p className="text-sm text-gray-600">
                            บันทึกการยืมและคืนได้รวดเร็ว
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-md transition-shadow">
                        <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            ติดตามประวัติ
                        </h3>
                        <p className="text-sm text-gray-600">
                            ตรวจสอบประวัติการยืมได้ทันที
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

