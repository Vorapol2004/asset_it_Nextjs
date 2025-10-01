'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Utcclogo from "@/component/img/Utcclogo.png";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo + Text */}
                        <div
                            className="flex items-center space-x-3 cursor-pointer"
                            onClick={() => router.push('/')}
                        >
                            <div className="relative h-10 w-10 flex-shrink-0">
                                <Image
                                    src={Utcclogo}
                                    alt="UTCC Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                ระบบยืมอุปกรณ์
              </span>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => router.push('/login')}
                                className="text-gray-700 hover:text-gray-900 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base font-medium cursor-pointer"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium cursor-pointer"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}