'use client';

import React, { useState } from 'react';
import Utcclogo from '../img/Utcclogo.png';
import { Package, Menu, X, Home, History, PlusCircle } from 'lucide-react'; // เพิ่ม PlusCircle
import Link from 'next/link';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img
                            src={Utcclogo.src}   // URL รูปของคุณ
                            alt="Logo"
                            className="h-8 w-8 mr-2"                // กำหนดขนาดเทียบกับ icon เดิม
                        />
                        <span className="text-xl font-bold text-white">Asset IT support</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {/* หน้าแรก */}
                            <Link
                                href="/"
                                className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <Home className="h-4 w-4 mr-1" />
                                หน้าแรก
                            </Link>

                            {/* การยืมอุปกรณ์ */}
                            <Link
                                href="/pages/borrow_equipment"
                                className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <Package className="h-4 w-4 mr-1" />
                                การยืมอุปกรณ์
                            </Link>

                            {/* เพิ่มอุปกรณ์ */}
                            <Link
                                href="/pages/add_equipment"
                                className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <PlusCircle className="h-4 w-4 mr-1" />
                                เพิ่มอุปกรณ์
                            </Link>

                            {/* ประวัติการยืม */}
                            <Link
                                href="/pages/borrow_history"
                                className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <History className="h-4 w-4 mr-1" />
                                ประวัติการยืม
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:bg-blue-700 p-2 rounded-md"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
                            <Link
                                href="/"
                                className="flex items-center text-blue-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Home className="h-4 w-4 mr-2" />
                                หน้าแรก
                            </Link>

                            <Link
                                href="/pages/borrow_equipment"
                                className="flex items-center text-blue-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Package className="h-4 w-4 mr-2" />
                                การยืมอุปกรณ์
                            </Link>

                            <Link
                                href="/pages/add_equipment"
                                className="flex items-center text-blue-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                เพิ่มอุปกรณ์
                            </Link>

                            <Link
                                href="/pages/borrow_history"
                                className="flex items-center text-blue-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <History className="h-4 w-4 mr-2" />
                                ประวัติการยืม
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
