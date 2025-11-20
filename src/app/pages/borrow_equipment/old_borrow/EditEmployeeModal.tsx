'use client';

import { Edit, X } from 'lucide-react';
import { EmployeeView, Department, Role, Building, Floor, Room } from '@/types/type';

interface EditFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roleId: number;
    departmentId: number;
    buildingId: number;
    floorId: number;
    roomId: number;
}

interface EditEmployeeModalProps {
    isOpen: boolean;
    editingEmployee: EmployeeView | null;
    editFormData: EditFormData;
    loading: boolean;
    departments: Department[];
    roles: Role[];
    buildings: Building[];
    floors: Floor[];
    rooms: Room[];
    onFormDataChange: (data: EditFormData) => void;
    onUpdate: () => void;
    onClose: () => void;
}

export default function EditEmployeeModal({
    isOpen,
    editingEmployee,
    editFormData,
    loading,
    departments,
    roles,
    buildings,
    floors,
    rooms,
    onFormDataChange,
    onUpdate,
    onClose,
}: EditEmployeeModalProps) {
    if (!isOpen || !editingEmployee) return null;

    const handleInputChange = (field: keyof EditFormData, value: string | number) => {
        onFormDataChange({ ...editFormData, [field]: value });
    };

    const handleDepartmentChange = (departmentId: number) => {
        onFormDataChange({
            ...editFormData,
            departmentId,
            buildingId: 0,
            floorId: 0,
            roomId: 0,
        });
    };

    const handleBuildingChange = (buildingId: number) => {
        onFormDataChange({
            ...editFormData,
            buildingId,
            floorId: 0,
            roomId: 0,
        });
    };

    const handleFloorChange = (floorId: number) => {
        onFormDataChange({
            ...editFormData,
            floorId,
            roomId: 0,
        });
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-opacity-20 p-2 rounded-lg">
                            <Edit className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">แก้ไขข้อมูลพนักงาน</h2>
                            <p className="text-blue-100 text-sm">
                                {editingEmployee.firstName} {editingEmployee.lastName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white bg-blue-700 hover:bg-blue-800 p-2 rounded-lg cursor-pointer transition-colors duration-300"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* ชื่อ-นามสกุล */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                ชื่อ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={editFormData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 transition-colors"
                                placeholder="กรอกชื่อ"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                นามสกุล <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={editFormData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 transition-colors"
                                placeholder="กรอกนามสกุล"
                                required
                            />
                        </div>
                    </div>

                    {/* อีเมล */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            อีเมล <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={editFormData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 transition-colors"
                            placeholder="กรอกอีเมล"
                            required
                        />
                    </div>

                    {/* เบอร์โทรศัพท์ */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={editFormData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 transition-colors"
                            placeholder="กรอกเบอร์โทรศัพท์"
                            required
                        />
                    </div>

                    {/* ตำแหน่ง */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ตำแหน่ง <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={editFormData.roleId}
                            onChange={(e) => handleInputChange('roleId', Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="0">-- เลือกตำแหน่ง --</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.roleName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* แผนก */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            แผนก <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={editFormData.departmentId}
                            onChange={(e) => handleDepartmentChange(Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 transition-colors"
                            required
                        >
                            <option value="0">-- เลือกแผนก --</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.departmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ตึก */}
                    {editFormData.departmentId > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                ตึก
                            </label>
                            <select
                                value={editFormData.buildingId}
                                onChange={(e) => handleBuildingChange(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="0">-- เลือกตึก --</option>
                                {buildings.map(building => (
                                    <option key={building.id} value={building.id}>
                                        {building.buildingName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* ชั้น */}
                    {editFormData.buildingId > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                ชั้น
                            </label>
                            <select
                                value={editFormData.floorId}
                                onChange={(e) => handleFloorChange(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="0">-- เลือกชั้น --</option>
                                {floors.map(floor => (
                                    <option key={floor.id} value={floor.id}>
                                        {floor.floorName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* ห้อง */}
                    {editFormData.floorId > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                ห้อง
                            </label>
                            <select
                                value={editFormData.roomId}
                                onChange={(e) => handleInputChange('roomId', Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="0">-- เลือกห้อง --</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.roomName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-xl flex items-center justify-end gap-3 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="button"
                        onClick={onUpdate}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <Edit className="h-5 w-5 text-white cursor-pointer" />
                                บันทึกการแก้ไข
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
