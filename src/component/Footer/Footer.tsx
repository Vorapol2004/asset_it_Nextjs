// component/Footer/Footer.tsx
import React from 'react';
import Image from 'next/image';
import STECHLogo from '../img/STECH_UTCC.png';

const Footer = () => {
    return (
        <footer className="bg-gray-600 text-gray-300 text-sm py-4">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left: Text Content */}
                    <div className="text-center md:text-left">
                        <p>&copy; 2025 UTCC IT Asset Management System</p>
                        <p className="text-gray-400 mt-1">
                            ระบบบันทึกการยืมอุปกรณ์ | พัฒนาโดย STECH UTCC
                        </p>
                    </div>
                    
                    {/* Right: STECH Logo */}
                    <div className="relative h-12 w-auto flex-shrink-0">
                        <Image
                            src={STECHLogo}
                            alt="STECH UTCC"
                            width={120}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
