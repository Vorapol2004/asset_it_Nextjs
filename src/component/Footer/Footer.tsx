// component/Footer/Footer.tsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 text-sm py-4">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p>&copy; 2025 EquipTrack System</p>
                <p className="text-gray-400 mt-1">
                    ระบบบันทึกการยืมอุปกรณ์ | พัฒนาเพื่อความสะดวกในการจัดการ
                </p>
            </div>
        </footer>
    );
};

export default Footer;
