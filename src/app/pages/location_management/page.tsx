'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/component/Navbar/Navbar';
import RouteProtection from '@/component/auth/RouteProtection';
import {
    Building2, Layers, DoorOpen, Plus, Edit, Trash2,
    RefreshCw, ChevronDown, X, Settings, ChevronUp
} from 'lucide-react';
import { useLocationManagement } from '@/hooks/useLocationManagement';
import { LocationModal } from './LocationModal';

export default function LocationManagementPage() {
    const {
        activeTab,
        setActiveTab,
        loading,
        error,
        setError,
        departments,
        buildings,
        floors,
        rooms,
        showModal,
        editingItem,
        modalType,
        openCreateModal,
        openEditModal,
        closeModal,
        selectedDepartment,
        setSelectedDepartment,
        selectedBuilding,
        setSelectedBuilding,
        loadRooms,
        createDepartment,
        createBuilding,
        createFloor,
        createRoom,
        updateDepartment,
        updateBuilding,
        updateFloor,
        updateRoom,
        deleteDepartment,
        deleteBuilding,
        deleteFloor,
        deleteRoom,
        loadData,
    } = useLocationManagement();

    const [selectedFloor, setSelectedFloor] = useState<number>(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Load rooms when floor changes
    useEffect(() => {
        if (selectedFloor > 0) {
            loadRooms(selectedFloor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFloor]);

    // Scroll to Top 
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const tabs = [
        { id: 'department' as const, label: 'แผนก', icon: Building2 },
        { id: 'building' as const, label: 'ตึก', icon: Building2 },
        { id: 'floor' as const, label: 'ชั้น', icon: Layers },
        { id: 'room' as const, label: 'ห้อง', icon: DoorOpen },
    ];

    const renderTable = () => {
        switch (activeTab) {
            case 'department':
                return (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">ชื่อแผนก</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold uppercase">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {departments.map((dept, i) => (
                                    <tr key={dept.id} className={`hover:bg-indigo-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-3">
                                            <span className="font-semibold text-gray-900">{dept.departmentName}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => openEditModal(dept)}
                                                    className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-1 text-sm"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => deleteDepartment(dept.id)}
                                                    disabled={loading}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'building':
                return (
                    <div className="space-y-4">
                        {/* Department Filter */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                เลือกแผนก
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(Number(e.target.value))}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg outline-none text-gray-700 font-medium bg-white focus:border-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value={0}>-- เลือกแผนก --</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.departmentName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Buildings Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase">ชื่อตึก</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {buildings.map((bldg, i) => (
                                        <tr key={bldg.id} className={`hover:bg-indigo-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-6 py-3">
                                                <span className="font-semibold text-gray-900">{bldg.buildingName}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => openEditModal(bldg)}
                                                        className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-1 text-sm"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        แก้ไข
                                                    </button>
                                                    <button
                                                        onClick={() => deleteBuilding(bldg.id)}
                                                        disabled={loading}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        ลบ
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'floor':
                return (
                    <div className="space-y-4">
                        {/* Building Filter */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                เลือกตึก
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedBuilding}
                                    onChange={(e) => setSelectedBuilding(Number(e.target.value))}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg outline-none text-gray-700 font-medium bg-white focus:border-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value={0}>-- เลือกตึก --</option>
                                    {buildings.map((bldg) => (
                                        <option key={bldg.id} value={bldg.id}>
                                            {bldg.buildingName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Floors Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase">ชื่อชั้น</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {floors.map((floor, i) => (
                                        <tr key={floor.id} className={`hover:bg-indigo-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-6 py-3">
                                                <span className="font-semibold text-gray-900">{floor.floorName}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => openEditModal(floor)}
                                                        className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-1 text-sm"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        แก้ไข
                                                    </button>
                                                    <button
                                                        onClick={() => deleteFloor(floor.id)}
                                                        disabled={loading}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        ลบ
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'room':
                return (
                    <div className="space-y-4">
                        {/* Floor Filter */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                                เลือกชั้น
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedFloor}
                                    onChange={(e) => setSelectedFloor(Number(e.target.value))}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg outline-none text-gray-700 font-medium bg-white focus:border-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value={0}>-- เลือกชั้น --</option>
                                    {floors.map((floor) => (
                                        <option key={floor.id} value={floor.id}>
                                            {floor.floorName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Rooms Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase">ชื่อห้อง</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {rooms.map((room, i) => (
                                        <tr key={room.id} className={`hover:bg-indigo-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-6 py-3">
                                                <span className="font-semibold text-gray-900">{room.roomName}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => openEditModal(room)}
                                                        className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-1 text-sm"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        แก้ไข
                                                    </button>
                                                    <button
                                                        onClick={() => deleteRoom(room.id)}
                                                        disabled={loading}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        ลบ
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <RouteProtection allowedRoles="authenticated">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-3 rounded-xl">
                            <Settings className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการสถานที่</h1>
                            <p className="text-gray-600">จัดการแผนก, ตึก, ชั้น, และห้อง</p>
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        รีเฟรช
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
                        <p className="text-red-700 flex-1">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-400 hover:text-red-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md mb-6 border border-gray-200">
                    <div className="flex border-b border-gray-200">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <button
                                onClick={openCreateModal}
                                disabled={loading || (activeTab === 'building' && selectedDepartment === 0) || (activeTab === 'floor' && selectedBuilding === 0) || (activeTab === 'room' && selectedFloor === 0)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                                เพิ่มใหม่
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center py-20">
                                <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                <span className="text-gray-600 font-medium">กำลังโหลด...</span>
                            </div>
                        ) : (
                            renderTable()
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <LocationModal
                    type={activeTab}
                    mode={modalType}
                    item={editingItem}
                    departments={departments}
                    buildings={buildings}
                    floors={floors}
                    selectedDepartment={selectedDepartment}
                    selectedBuilding={selectedBuilding}
                    selectedFloor={selectedFloor}
                    onClose={closeModal}
                    onCreate={async (data) => {
                        switch (activeTab) {
                            case 'department':
                                await createDepartment(data as { departmentName: string });
                                break;
                            case 'building':
                                await createBuilding(data as { buildingName: string; departmentId: number });
                                break;
                            case 'floor':
                                await createFloor(data as { floorName: string; buildingId: number });
                                break;
                            case 'room':
                                await createRoom(data as { roomName: string; floorId: number });
                                break;
                        }
                    }}
                    onUpdate={async (id: number, data) => {
                        switch (activeTab) {
                            case 'department':
                                await updateDepartment(id, data as { departmentName?: string });
                                break;
                            case 'building':
                                await updateBuilding(id, data as { buildingName?: string; departmentId?: number });
                                break;
                            case 'floor':
                                await updateFloor(id, data as { floorName?: string; buildingId?: number });
                                break;
                            case 'room':
                                await updateRoom(id, data as { roomName?: string; floorId?: number });
                                break;
                        }
                    }}
                />
            )}

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 flex items-center justify-center group cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-6 w-6 group-hover:animate-bounce" />
                </button>
            )}
        </div>
        </RouteProtection>
    );
}

