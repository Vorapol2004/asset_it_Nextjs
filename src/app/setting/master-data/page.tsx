'use client';

/**
 * 🎯 Master Data Management (รวมทุกอย่างในหน้าเดียว)
 * Path: /src/app/setting/master-data/page.tsx
 * URL: /setting/master-data
 *
 * Features:
 * - แผนก (Department)
 * - ตึก (Building)
 * - ชั้น (Floor)
 * - ห้อง (Room)
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Briefcase, Building as BuildingIcon, Layers, DoorOpen, ArrowLeft
} from 'lucide-react';
import Navbar from "@/component/Navbar/Navbar";
import DepartmentSection from '@/component/sections/DepartmentSection';
import BuildingSection from '@/component/sections/BuildingSection';
import FloorSection from '@/component/sections/FloorSection';
import RoomSection from '@/component/sections/RoomSection';

type TabType = 'department' | 'building' | 'floor' | 'room';

export default function MasterDataPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('department');

    // Tabs Configuration
    const tabs = [
        { id: 'department' as TabType, label: 'แผนก', icon: Briefcase, color: 'blue' },
        { id: 'building' as TabType, label: 'ตึก', icon: BuildingIcon, color: 'green' },
        { id: 'floor' as TabType, label: 'ชั้น', icon: Layers, color: 'orange' },
        { id: 'room' as TabType, label: 'ห้อง', icon: DoorOpen, color: 'purple' },
    ];

    return (

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-5 mt-5">
                    <button
                        onClick={() => router.push('/pages/home')}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        กลับ
                    </button>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการข้อมูลหลัก</h1>
                        <p className="text-gray-600">จัดการแผนก, ตึก, ชั้น, และห้องในระบบ</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
                    <div className="flex border-b">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                                        isActive
                                            ? `bg-${tab.color}-50 text-${tab.color}-700 border-b-4 border-${tab.color}-600`
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className={`h-5 w-5 ${isActive ? `text-${tab.color}-600` : 'text-gray-500'}`} />
                                    <span className="text-lg">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {activeTab === 'department' && <DepartmentSection />}
                    {activeTab === 'building' && <BuildingSection />}
                    {activeTab === 'floor' && <FloorSection />}
                    {activeTab === 'room' && <RoomSection />}
                </div>
            </div>
        </div>
    );
}
