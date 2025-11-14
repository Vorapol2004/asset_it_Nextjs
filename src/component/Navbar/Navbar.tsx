'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Utcclogo from '../img/Utcclogo.png';
import { Package, Menu, X, Home, History, PlusCircle, LogOut, User, Laptop, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAuthContext } from '@/app/context/AuthContext';
import { ROUTES, NAV_ITEMS } from '@/constants/routes';

const Navbar = memo(function Navbar() {
    const router = useRouter();
    const { user, loading, logout, isAuthenticated } = useAuthContext();
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
            router.push(ROUTES.HOME_LANDING || '/');
        } catch (error) {
            console.error('Logout failed:', error);
            // แม้จะ error ก็ redirect ไปหน้า home
            router.push(ROUTES.HOME_LANDING || '/');
        }
    }, [logout, router]);

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
        };
        return icons[iconName] || null;
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href={ROUTES.HOME} className="flex items-center cursor-pointer">
                        <div className="relative h-8 w-8 mr-2">
                            <Image
                                src={Utcclogo}
                                alt="Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-xl font-bold text-white">Asset IT support</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-baseline space-x-2">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                                >
                                    {getIcon(item.icon)}
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* User Menu - แสดงเมื่อ authenticated */}
                        {isAuthenticated ? (
                            <div className="relative ml-3 user-menu-container">
                                <button
                                    onClick={toggleUserMenu}
                                    className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                                >
                                    <User className="h-4 w-4 mr-1" />
                                    <span className="hidden lg:inline">
                                        {loading ? 'Loading...' : user?.username || 'Account'}
                                    </span>
                                </button>

                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={toggleUserMenu}
                                        />

                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                            {user && (
                                                <div className="px-4 py-2 border-b border-gray-200">
                                                    <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                                                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                                                </div>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
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
                                className="flex items-center text-blue-200 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ml-3"
                            >
                                <User className="h-4 w-4 mr-1" />
                                <span className="hidden lg:inline">Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:bg-blue-700 p-2 rounded-md cursor-pointer"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
                            {isAuthenticated && user && (
                                <div className="px-3 py-2 text-blue-100 text-sm border-b border-blue-600 mb-2">
                                    <p className="font-semibold">{user.username}</p>
                                    <p className="text-xs">ID: {user.id}</p>
                                </div>
                            )}

                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="flex items-center text-blue-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                                    onClick={closeMenu}
                                >
                                    {getIcon(item.icon)}
                                    <span className="ml-1">{item.label}</span>
                                </Link>
                            ))}

                            {isAuthenticated && (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-blue-200 hover:text-white w-full px-3 py-2 rounded-md text-base font-medium cursor-pointer"
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