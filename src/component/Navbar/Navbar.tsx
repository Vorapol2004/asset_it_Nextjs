'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import Image from 'next/image';
import Utcclogo from '../img/Utcclogo.png';
import { Package, Menu, X, Home, History, PlusCircle, LogOut, User, Laptop, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAuthContext } from '@/app/context/AuthContext';
import { ROUTES, NAV_ITEMS } from '@/constants/routes';
import { Users } from 'lucide-react';

const Navbar = memo(function Navbar() {
    const { user, loading, logout, isAuthenticated, isAdmin } = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const toggleUserMenu = useCallback(() => {
        setIsUserMenuOpen(prev => !prev);
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setIsUserMenuOpen(false);
            setIsMenuOpen(false);
            // ใช้ window.location.href เพื่อ redirect โดยตรงไปหน้า landing page
            // ไม่ผ่าน RouteProtection ที่อาจจะ redirect ไป login
            window.location.href = ROUTES.HOME_LANDING || '/';
        } catch (error) {
            console.error('Logout failed:', error);
            // แม้จะ error ก็ redirect ไปหน้า landing page
            window.location.href = ROUTES.HOME_LANDING || '/';
        }
    }, [logout]);

    // ปิด user menu เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isUserMenuOpen) {
                const target = event.target as HTMLElement;
                if (!target.closest('.user-menu-container')) {
                    setIsUserMenuOpen(false);
                }
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    // Icon mapping
    const getIcon = (iconName: string) => {
        const icons: Record<string, React.ReactNode> = {
            Home: <Home className="h-4 w-4 mr-1" />,
            Package: <Package className="h-4 w-4 mr-1" />,
            PlusCircle: <PlusCircle className="h-4 w-4 mr-1" />,
            History: <History className="h-4 w-4 mr-1" />,
            Laptop: <Laptop className="h-4 w-4 mr-1" />,
            Settings: <Settings className="h-4 w-4 mr-1" />,
            Users: <Users className="h-4 w-4 mr-1" />,
        };
        return icons[iconName] || null;
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 xl:px-4">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo */}
                    <Link href={ROUTES.HOME} className="flex items-center cursor-pointer min-w-0 flex-shrink-0">
                        <div className="relative h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 mr-2 sm:mr-2.5 flex-shrink-0">
                            <Image
                                src={Utcclogo}
                                alt="UTCC Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                            <span className="hidden sm:inline">UTCC IAMS</span>
                            <span className="sm:hidden">UTCCIAMS</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center flex-1 justify-end min-w-0">
                        <div className="flex items-center space-x-1 lg:space-x-2 flex-wrap justify-end max-w-full">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                                >
                                    {getIcon(item.icon)}
                                    <span className="hidden lg:inline">{item.label}</span>
                                </Link>
                            ))}
                            {/* แสดง User Management สำหรับ Admin เท่านั้น */}
                            {isAdmin && (
                                <Link
                                    href={ROUTES.USER_MANAGEMENT}
                                    className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                                >
                                    <Users className="h-4 w-4 lg:mr-1" />
                                    <span className="hidden xl:inline">จัดการ Users</span>
                                </Link>
                            )}
                        </div>

                        {/* User Menu - แสดงเมื่อ authenticated */}
                        {isAuthenticated ? (
                            <div className="relative ml-2 lg:ml-3 user-menu-container flex-shrink-0">
                                <button
                                    onClick={toggleUserMenu}
                                    className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                                >
                                    <User className="h-4 w-4 lg:mr-1" />
                                    <span className="hidden xl:inline max-w-[120px] lg:max-w-[150px] truncate">
                                        {loading ? 'Loading...' : user?.email || 'Account'}
                                    </span>
                                </button>

                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={toggleUserMenu}
                                        />

                                        <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                                            {user && (
                                                <div className="px-4 py-2 border-b border-gray-200">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                                                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                                                </div>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                            >
                                                <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            // แสดงปุ่ม Login ถ้ายังไม่ได้ login
                            <Link
                                href={ROUTES.LOGIN}
                                className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors cursor-pointer ml-2 lg:ml-3 whitespace-nowrap flex-shrink-0"
                            >
                                <User className="h-4 w-4 lg:mr-1" />
                                <span className="hidden xl:inline">Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex-shrink-0 ml-2">
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:bg-blue-700 p-2 rounded-md cursor-pointer transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-blue-500">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
                            {isAuthenticated && user && (
                                <div className="px-3 py-2 text-blue-100 text-sm border-b border-blue-600 mb-2">
                                    <p className="font-semibold truncate">{user.email}</p>
                                    <p className="text-xs">ID: {user.id}</p>
                                </div>
                            )}

                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="flex items-center text-blue-200 hover:text-white hover:bg-blue-600 block px-3 py-2.5 rounded-md text-base font-medium cursor-pointer transition-colors"
                                    onClick={closeMenu}
                                >
                                    {getIcon(item.icon)}
                                    <span className="ml-2">{item.label}</span>
                                </Link>
                            ))}
                            {/* แสดง User Management สำหรับ Admin เท่านั้น */}
                            {isAdmin && (
                                <Link
                                    href={ROUTES.USER_MANAGEMENT}
                                    className="flex items-center text-blue-200 hover:text-white hover:bg-blue-600 block px-3 py-2.5 rounded-md text-base font-medium cursor-pointer transition-colors"
                                    onClick={closeMenu}
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    <span>จัดการ Users</span>
                                </Link>
                            )}

                            {isAuthenticated && (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-blue-200 hover:text-white hover:bg-blue-600 w-full px-3 py-2.5 rounded-md text-base font-medium cursor-pointer transition-colors"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
});

export default Navbar;

//มีการใช้ memo มาช่วยการ Re-render ในส่วนของ navbar ที่ใช้ในหลายหน้า