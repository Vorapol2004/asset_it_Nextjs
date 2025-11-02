'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import {
    Package, Plus, Trash2, Save, User, Calendar, FileText,
    Mail, Phone, Building2, DoorOpen, Briefcase, UserCheck, ArrowLeft, Key, Laptop
} from 'lucide-react';
import { useNewBorrow } from '@/hooks/useNewBorrow';
import { ROUTES } from '@/constants/routes';

export default function NewBorrowPage() {
    const router = useRouter();
    const {
        loading,
        buildings,
        rooms,
        departments,
        borrowerRole,
        selectedDepartment,
        selectedBuilding,
        selectedRoom,
        approverName,
        borrowerFirstName,
        borrowerLastName,
        borrowerEmail,
        borrowerPhone,
        borrowDate,
        dueDate,
        referenceDoc,
        borrowItems,
        setBorrowerRole,
        setSelectedDepartment,
        setSelectedBuilding,
        setSelectedRoom,
        setApproverName,
        setBorrowerFirstName,
        setBorrowerLastName,
        setBorrowerEmail,
        setBorrowerPhone,
        setBorrowDate,
        setDueDate,
        setReferenceDoc,
        addBorrowItem,
        removeBorrowItem,
        updateBorrowItem,
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
                                <h1 className="text-3xl font-bold text-gray-900">ยืมอุปกรณ์</h1>
                                <p className="text-gray-600">กรอกข้อมูลการยืมอุปกรณ์</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* ข้อมูลผู้ยืม */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-blue-100 flex items-center">
                            <User className="h-6 w-6 mr-2 text-blue-600" />
                            ข้อมูลผู้ยืม
                        </h2>
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
                                    <option value="อาจารย์">อาจารย์</option>
                                    <option value="พนักงาน">พนักงาน</option>
                                    <option value="ส่วนกลาง">ส่วนกลาง</option>
                                    <option value="อื่นๆ">อื่นๆ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* สถานที่และหน่วยงาน */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-blue-100 flex items-center">
                            <Building2 className="h-6 w-6 mr-2 text-blue-600" />
                            สถานที่และหน่วยงาน
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium cursor-pointer outline-none focus:border-blue-500"
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
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium cursor-pointer outline-none focus:border-blue-500"
                                        required
                                        disabled={selectedDepartment === 0}
                                    >
                                        <option value={0}>-- เลือกตึก --</option>
                                        {buildings.map(b => (
                                            <option key={b.id} value={b.id}>{b.buildingName}</option>
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
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium cursor-pointer outline-none focus:border-blue-500"
                                        required
                                        disabled={selectedBuilding === 0}
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

                    {/* วันที่ */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b-2 border-blue-100 flex items-center">
                            <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                            วันที่
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    วันที่ยืม <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={borrowDate}
                                        onChange={(e) => setBorrowDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    วันที่คืน <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    เอกสารอ้างอิง
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={referenceDoc}
                                        onChange={(e) => setReferenceDoc(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                        placeholder="เลขที่เอกสาร (ถ้ามี)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* รายการอุปกรณ์ */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-blue-100">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Package className="h-6 w-6 mr-2 text-blue-600" />
                                รายการอุปกรณ์
                            </h2>
                            <button
                                type="button"
                                onClick={addBorrowItem}
                                className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                เพิ่มรายการ
                            </button>
                        </div>

                        <div className="space-y-4 mt-6">
                            {borrowItems.map((item, index) => (
                                <div key={`borrow-item-${index}`} className="border-2 border-gray-300 rounded-xl p-5 bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-gray-900 text-lg">รายการที่ {index + 1}</h3>
                                        {borrowItems.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBorrowItem(index)}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Type */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ประเภท <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={item.equipmentType}
                                                onChange={(e) => updateBorrowItem(index, 'equipmentType', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                            >
                                                <option value="Hardware">Hardware (อุปกรณ์)</option>
                                                <option value="License">License (ใบอนุญาต/ซองซอฟต์แวร์)</option>
                                            </select>
                                        </div>

                                        {/* Equipment Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ชื่ออุปกรณ์ <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={item.equipmentName}
                                                onChange={(e) => updateBorrowItem(index, 'equipmentName', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                                placeholder="เช่น Notebook Dell Latitude 5420"
                                                required
                                            />
                                        </div>

                                        {/* Brand */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                ยี่ห้อ (Brand)
                                            </label>
                                            <input
                                                type="text"
                                                value={item.brand}
                                                onChange={(e) => updateBorrowItem(index, 'brand', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                                placeholder="เช่น Dell, HP, Microsoft"
                                            />
                                        </div>

                                        {/* Model */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                รุ่น (Model)
                                            </label>
                                            <input
                                                type="text"
                                                value={item.model}
                                                onChange={(e) => updateBorrowItem(index, 'model', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                                placeholder="เช่น Latitude 5420, Office 365"
                                            />
                                        </div>

                                        {/* Serial Number (Hardware) */}
                                        {item.equipmentType === 'Hardware' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    <Laptop className="inline h-4 w-4 mr-1" />
                                                    Serial Number (SN)
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.serialNumber || ''}
                                                    onChange={(e) => updateBorrowItem(index, 'serialNumber', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-mono font-medium outline-none focus:border-blue-500"
                                                    placeholder="กรอก Serial Number ของอุปกรณ์"
                                                    required
                                                />
                                                <p className="text-xs text-gray-500 mt-1">ระบุ Serial Number ที่ติดอยู่บนตัวอุปกรณ์</p>
                                            </div>
                                        )}

                                        {/* License Key (License) */}
                                        {item.equipmentType === 'License' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                    <Key className="inline h-4 w-4 mr-1" />
                                                    License Key
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.licenseKey || ''}
                                                    onChange={(e) => updateBorrowItem(index, 'licenseKey', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-mono font-medium outline-none focus:border-blue-500"
                                                    placeholder="กรอก License Key หรือ Product Key"
                                                    required
                                                />
                                                <p className="text-xs text-gray-500 mt-1">ระบุ License Key หรือ Serial ของใบอนุญาต</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* สรุปจำนวนรายการ */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileText className="h-6 w-6 text-white mr-3" />
                                <span className="text-white font-bold text-xl">จำนวนรายการที่ยืม:</span>
                            </div>
                            <span className="text-4xl font-bold text-white">{borrowItems.length} รายการ</span>
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
                            {loading ? 'กำลังบันทึก...' : 'บันทึกการยืม'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
