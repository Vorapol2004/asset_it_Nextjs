'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import {
    Package, Save, User, Mail, Phone, Building2, DoorOpen, Briefcase, UserCheck, ArrowLeft, Layers
} from 'lucide-react';
import { useNewBorrow } from '@/hooks/useNewBorrow';
import { ROUTES } from '@/constants/routes';

export default function NewBorrowPage() {
    const router = useRouter();
    const {
        loading,
        buildings,
        floors,
        rooms,
        departments,
        roles,
        borrowerRole,
        selectedDepartment,
        selectedBuilding,
        selectedFloor,
        selectedRoom,
        approverName,
        borrowerFirstName,
        borrowerLastName,
        borrowerEmail,
        borrowerPhone,
        setBorrowerRole,
        setSelectedDepartment,
        setSelectedBuilding,
        setSelectedFloor,
        setSelectedRoom,
        setApproverName,
        setBorrowerFirstName,
        setBorrowerLastName,
        setBorrowerEmail,
        setBorrowerPhone,
        handleSubmit,
    } = useNewBorrow();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push(ROUTES.BORROW_EQUIPMENT)}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        กลับ
                    </button>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <Package className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">สำหรับผู้ยืมใหม่</h1>
                                <p className="text-gray-600">กรอกข้อมูลการยืมอุปกรณ์</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* ข้อมูลผู้ยืม */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <User className="h-6 w-6 mr-2 text-blue-600" />
                                ข้อมูลผู้ยืม
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    ชื่อ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={borrowerFirstName}
                                        onChange={(e) => setBorrowerFirstName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        placeholder="ชื่อผู้ยืม"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    นามสกุล <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={borrowerLastName}
                                        onChange={(e) => setBorrowerLastName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        placeholder="นามสกุลผู้ยืม"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    อีเมล
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={borrowerEmail}
                                        onChange={(e) => setBorrowerEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        placeholder="example@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={borrowerPhone}
                                        onChange={(e) => setBorrowerPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        placeholder="081-234-5678"
                                        required
                                    />
                                </div>
                            </div>

                            {/* ตำแหน่งผู้ยืม */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    <Briefcase className="inline h-4 w-4 mr-1 text-blue-600" />
                                    ตำแหน่งผู้ยืม <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={borrowerRole}
                                    onChange={(e) => setBorrowerRole(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                    required
                                >
                                    <option value="">-- เลือกตำแหน่ง --</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.roleName}>
                                            {role.roleName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* สถานที่และหน่วยงาน */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Building2 className="h-6 w-6 mr-2 text-blue-600" />
                                สถานที่และหน่วยงาน
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* แผนก */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    แผนก <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 cursor-pointer"
                                        required
                                    >
                                        <option value={0}>-- เลือกแผนก --</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.departmentName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ตึก */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    ตึก <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        value={selectedBuilding}
                                        onChange={(e) => setSelectedBuilding(Number(e.target.value))}
                                        disabled={selectedDepartment === 0}
                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 ${
                                            selectedDepartment === 0
                                                ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                                                : 'border-gray-300 cursor-pointer'
                                        }`}
                                        required
                                    >
                                        <option value={0}>-- เลือกตึก --</option>
                                        {buildings.map(b => (
                                            <option key={b.id} value={b.id}>{b.buildingName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ชั้น */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    ชั้น <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        value={selectedFloor}
                                        onChange={(e) => setSelectedFloor(Number(e.target.value))}
                                        disabled={selectedBuilding === 0}
                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 ${
                                            selectedBuilding === 0
                                                ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                                                : 'border-gray-300 cursor-pointer'
                                        }`}
                                        required
                                    >
                                        <option value={0}>-- เลือกชั้น --</option>
                                        {floors.map(f => (
                                            <option key={f.id} value={f.id}>{f.floorName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ห้อง */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    ห้อง <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <DoorOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(Number(e.target.value))}
                                        disabled={selectedFloor === 0}
                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 ${
                                            selectedFloor === 0
                                                ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                                                : 'border-gray-300 cursor-pointer'
                                        }`}
                                        required
                                    >
                                        <option value={0}>-- เลือกห้อง --</option>
                                        {rooms.map(r => (
                                            <option key={r.id} value={r.id}>{r.roomName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ผู้อนุมัติ */}
                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                ผู้อนุมัติ <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={approverName}
                                    onChange={(e) => setApproverName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                    placeholder="ชื่อผู้อนุมัติ"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* ปุ่มบันทึก/ยกเลิก */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.push(ROUTES.BORROW_EQUIPMENT)}
                            disabled={loading}
                            className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center shadow-lg font-semibold"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกและไปต่อ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
