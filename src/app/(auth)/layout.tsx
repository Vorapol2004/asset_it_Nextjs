'use client';

import {useRouter} from 'next/navigation';
import Image from 'next/image';
import Utcclogo from "@/component/img/Utcclogo.png";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
            {/* Navbar */}
            <nav className="bg-white shadow-sm flex-shrink-0">
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
                                UTCC IAMS
                            </span>
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
