'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import RouteProtection from '@/component/auth/RouteProtection';
import {
    Search, ArrowLeft, User,
    History, ChevronRight, Mail, Phone, Briefcase, Edit, ChevronUp
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useOldBorrow } from '@/hooks/useOldBorrow';
import EditEmployeeModal from './EditEmployeeModal';

export default function OldBorrowPage() {
    const router = useRouter();
    const {
        searchTerm,
        filteredBorrowers,
        loading,
        setSearchTerm,
        handleSelectBorrower,
        // Edit functionality
        isEditModalOpen,
        editingEmployee,
        editFormData,
        setEditFormData,
        departments,
        roles,
        buildings,
        floors,
        rooms,
        handleEditBorrower,
        handleUpdateEmployee,
        handleCloseEditModal,
    } = useOldBorrow();

    const [showScrollTop, setShowScrollTop] = useState(false);

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

    return (
        <RouteProtection allowedRoles="authenticated">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push(ROUTES.BORROW_EQUIPMENT)}
                        className="flex items-center text-purple-600 hover:text-purple-800 mb-4 font-medium transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        กลับ
                    </button>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <History className="h-8 w-8 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">ค้นหาผู้ยืมเก่า</h1>
                                <p className="text-gray-600">เลือกผู้ยืมเก่าเพื่อกรอกข้อมูลอัตโนมัติจากครั้งล่าสุด</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ค้นหาชื่อ, นามสกุล, อีเมล, หรือเบอร์โทรศัพท์..."
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-gray-900 font-medium outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {searchTerm && (
                        <div className="mt-3 text-sm text-gray-600">
                            พบ <span className="font-bold text-purple-600">{filteredBorrowers.length}</span> รายการ
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <User className="h-6 w-6" />
                            ผู้ยืมเก่า ({filteredBorrowers.length} คน)
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : filteredBorrowers.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                                <Search className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่พบข้อมูล</h3>
                            <p className="text-gray-600">
                                {searchTerm ?
                                    'ไม่พบผู้ยืมที่ตรงกับคำค้นหา' :
                                    'ยังไม่มีประวัติการยืม'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredBorrowers.map((employee, index) => {
                                // สร้าง unique key ที่ไม่ซ้ำกัน
                                const uniqueKey = `employee-${employee.id}-${index}-${employee.email || 'noemail'}`;
                                return (
                                <div
                                    key={uniqueKey}
                                    className="p-6 hover:bg-purple-50 transition-all duration-200 cursor-pointer "
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-purple-100 rounded-xl p-3 ">
                                                    <User className="h-6 w-6 text-purple-600" />
                                                </div>

                                                <div className="flex-1">
                                                    {(employee.firstName || employee.lastName) ? (
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                            {employee.firstName || ''} {employee.lastName || ''}
                                                        </h3>
                                                    ) : (
                                                        <h3 className="text-xl font-bold text-gray-500 mb-2 italic">
                                                            ไม่มีชื่อ-นามสกุล
                                                        </h3>
                                                    )}

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                        {employee.email && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <div className="bg-blue-100 p-1.5 rounded-lg">
                                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                                </div>
                                                                <span className="font-medium">{employee.email}</span>
                                                            </div>
                                                        )}
                                                        {employee.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <div className="bg-green-100 p-1.5 rounded-lg">
                                                                    <Phone className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <span className="font-medium">{employee.phone}</span>
                                                            </div>
                                                        )}
                                                        {employee.roleName && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <div className="bg-purple-100 p-1.5 rounded-lg">
                                                                    <Briefcase className="h-4 w-4 text-purple-600" />
                                                                </div>
                                                                <span className="font-medium">{employee.roleName}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {employee.departmentName && (
                                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                                            <p className="text-xs font-semibold text-blue-800 mb-2"> หน่วยงาน </p>
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <Briefcase className="h-3 w-3 text-blue-600" />
                                                                <span className="text-gray-700">{employee.departmentName} ตึก: {employee.buildingName} ชั้น: {employee.floorName} ห้อง: {employee.roomName} </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-4 flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditBorrower(employee);
                                                }}
                                                className="bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
                                            >
                                                <Edit className="h-5 w-5" />
                                                แก้ไข
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectBorrower(employee)}
                                                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-purple-700 transition-all shadow-md hover:shadow-lg group-hover:px-7 cursor-pointer"
                                            >
                                                เลือก
                                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <EditEmployeeModal
                isOpen={isEditModalOpen}
                editingEmployee={editingEmployee}
                editFormData={editFormData}
                loading={loading}
                departments={departments}
                roles={roles}
                buildings={buildings}
                floors={floors}
                rooms={rooms}
                onFormDataChange={setEditFormData}
                onUpdate={handleUpdateEmployee}
                onClose={handleCloseEditModal}
            />

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110 flex items-center justify-center group cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-6 w-6 group-hover:animate-bounce" />
                </button>
            )}
        </div>
        </RouteProtection>
    );
}
