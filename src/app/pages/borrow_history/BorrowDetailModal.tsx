'use client';

import { useEffect } from 'react';
import {
    RefreshCw,
    Cpu,
    Key,
    Undo2,
    Calendar,
    User,
    Mail,
    Phone,
    Briefcase,
    Building2,
    UserCheck,
    CheckCircle,
    ChevronDown,
} from 'lucide-react';

type GroupedBorrow = import('@/types/type').BorrowView;

interface BorrowDetailModalProps {
    selected: GroupedBorrow;
    selectedLoading: boolean;
    returnEquipmentStatuses: { id: number; equipmentStatusName: string }[];
    selectedReturnStatus: Record<string, number>;
    setSelectedReturnStatus: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    onClose: () => void;
    onReturnEquipment: (borrowEquipmentId: number, statusId: number) => Promise<void>;
}

export function BorrowDetailModal({
    selected,
    selectedLoading,
    returnEquipmentStatuses,
    selectedReturnStatus,
    setSelectedReturnStatus,
    onClose,
    onReturnEquipment,
}: BorrowDetailModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !selectedLoading) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose, selectedLoading]);

    return (
        <div className="fixed inset-0 bg-opacity-50 flex backdrop-blur items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center rounded-t-xl">
                    <div>
                        <h2 className="text-2xl font-bold">รายละเอียดการยืม</h2>
                        <p className="text-sm opacity-90 mt-1">Id: {selected.id}</p>
                    </div>
                </div>

                {selectedLoading ? (
                    <div className="flex flex-col items-center py-20">
                        <RefreshCw className="w-12 h-12 text-green-600 animate-spin mb-4" />
                        <span className="text-gray-600 font-medium">กำลังโหลดรายละเอียด...</span>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* ข้อมูลผู้ยืม */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-green-600" />
                                ข้อมูลผู้ยืม
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">ชื่อ-นามสกุล</p>
                                    <p className="font-semibold text-gray-900">
                                        {selected.employee?.firstName && selected.employee?.lastName
                                            ? `${selected.employee.firstName} ${selected.employee.lastName}`.trim()
                                            : selected.employee?.firstName || selected.employee?.lastName || 'ไม่ระบุชื่อ'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        อีเมล
                                    </p>
                                    <p className="font-semibold text-gray-900">{selected.employee?.email || '-'}</p>
                                </div>
                                {selected.employee?.phone && (
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium mb-1 flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            เบอร์โทรศัพท์
                                        </p>
                                        <p className="font-semibold text-gray-900">{selected.employee.phone}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" />
                                        ตำแหน่ง
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {selected.employee?.roleName || '-'}
                                    </p>
                                </div>
                                {selected.employee?.departmentName && (
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium mb-1 flex items-center gap-1">
                                            <Building2 className="h-4 w-4" />
                                            แผนก
                                        </p>
                                        <p className="font-semibold text-gray-900">{selected.employee.departmentName}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        วันที่ยืม
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(selected.borrowDate).toLocaleDateString('th-TH')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">เอกสารอ้างอิง</p>
                                    <p className="font-semibold text-gray-900">
                                        {selected.referenceDoc || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1 flex items-center gap-1">
                                        <UserCheck className="h-4 w-4" />
                                        ชื่อผู้อนุมัติ
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {selected.approverName || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* รายการอุปกรณ์ทั้งหมด */}
                        <div>
                            <p className="text-sm text-gray-600 mb-3 font-semibold">
                                รายการอุปกรณ์ ({selected.equipments?.length ?? 0} รายการ)
                            </p>
                            <div className="space-y-3">
                                {selected.equipments?.map((item, index) => {
                                    // ใช้ borrowEquipmentId เป็น key ถ้ามี ถ้าไม่มีใช้ combination ที่ unique
                                    const uniqueKey = item.borrowEquipmentId 
                                        ? `borrow-equipment-${item.borrowEquipmentId}` 
                                        : `borrow-${selected.id}-equipment-${item.id}-${index}`;
                                    
                                    return (
                                    <div key={uniqueKey} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {item.equipmentTypeName?.toLowerCase() === 'hardware' ? (
                                                    <Cpu className="h-4 w-4 text-blue-600" />
                                                ) : (
                                                    <Key className="h-4 w-4 text-purple-600" />
                                                )}
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    item.equipmentTypeName?.toLowerCase() === 'hardware'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {item.equipmentTypeName}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-600 font-medium">ชื่ออุปกรณ์</p>
                                                <p className="font-semibold text-gray-900">{item.equipmentName}</p>
                                            </div>
                                            {item.brand && (
                                                <div>
                                                    <p className="text-gray-600 font-medium">ยี่ห้อ</p>
                                                    <p className="font-semibold text-gray-900">{item.brand}</p>
                                                </div>
                                            )}
                                            {item.model && (
                                                <div>
                                                    <p className="text-gray-600 font-medium">รุ่น</p>
                                                    <p className="font-semibold text-gray-900">{item.model}</p>
                                                </div>
                                            )}
                                            {item.serialNumber && (
                                                <div>
                                                    <p className="text-gray-600 font-medium">Serial Number</p>
                                                    <p className="font-mono text-sm text-gray-900">{item.serialNumber}</p>
                                                </div>
                                            )}
                                            {item.licenseKey && (
                                                <div>
                                                    <p className="text-gray-600 font-medium">License Key</p>
                                                    <p className="font-mono text-sm text-purple-900">{item.licenseKey}</p>
                                                </div>
                                            )}
                                        </div>

                                        {item.dueDate && (
                                            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                กำหนดคืน: {new Date(item.dueDate).toLocaleDateString('th-TH')}
                                            </p>
                                        )}

                                        {item.returnDate ? (
                                            <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                คืนแล้ว: {new Date(item.returnDate).toLocaleDateString('th-TH')}
                                            </p>
                                        ) : (
                                            <div className="mt-3 space-y-2">
                                                <div>
                                                    <label className="block text-xs text-gray-600 font-medium mb-1">
                                                        เลือกสถานะอุปกรณ์ก่อนคืน
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={selectedReturnStatus[`${selected.id}-${item.borrowEquipmentId}`] || ''}
                                                            onChange={(e) => {
                                                                setSelectedReturnStatus(prev => ({
                                                                    ...prev,
                                                                    [`${selected.id}-${item.borrowEquipmentId}`]: Number(e.target.value)
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg outline-none text-sm text-gray-700 font-medium bg-white focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                                                        >
                                                            <option value="">-- เลือกสถานะ --</option>
                                                            {returnEquipmentStatuses.map((status: { id: number; equipmentStatusName: string }) => (
                                                                <option key={status.id} value={status.id}>
                                                                    {status.equipmentStatusName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        const statusKey = `${selected.id}-${item.borrowEquipmentId}`;
                                                        const statusId = selectedReturnStatus[statusKey];
                                                        if (!statusId) {
                                                            alert('กรุณาเลือกสถานะอุปกรณ์ก่อนคืน');
                                                            return;
                                                        }
                                                        
                                                        await onReturnEquipment(item.borrowEquipmentId, statusId);
                                                        // ลบสถานะที่เลือกออกหลังจากคืนสำเร็จ
                                                        setSelectedReturnStatus(prev => {
                                                            const newState = { ...prev };
                                                            delete newState[statusKey];
                                                            return newState;
                                                        });
                                                    }}
                                                    disabled={!selectedReturnStatus[`${selected.id}-${item.borrowEquipmentId}`]}
                                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors font-medium"
                                                >
                                                    <Undo2 className="h-4 w-4" /> คืนอุปกรณ์นี้
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 rounded-b-xl">
                    <button
                        onClick={onClose}
                        disabled={selectedLoading}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}

