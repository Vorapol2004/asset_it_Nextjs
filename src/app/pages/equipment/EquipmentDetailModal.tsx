'use client';

import { useEffect } from 'react';
import {
    RefreshCw, Package, X, Calendar, FileText, Tag, AlertCircle
} from 'lucide-react';
import { EquipmentView } from '@/types/type';

interface EquipmentDetailModalProps {
    equipment: EquipmentView | null;
    loading: boolean;
    error: string | null;
    onClose: () => void;
    onRetry: () => void;
}

export function EquipmentDetailModal({
    equipment,
    loading,
    error,
    onClose,
    onRetry,
}: EquipmentDetailModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!equipment && !loading && !error) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 backdrop-blur-sm bg-white/30 transition-all"
                onClick={onClose}
            />

            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">

                    {(() => {
                        if (loading) {
                            return (
                                <div className="flex flex-col items-center py-20">
                                    <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                    <span className="text-gray-600 font-medium">กำลังโหลด...</span>
                                </div>
                            );
                        }

                        if (error) {
                            return (
                                <div className="flex flex-col items-center py-20 px-6">
                                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
                                    <p className="text-gray-600 text-center mb-6">{error}</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={onRetry}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
                                        >
                                            ลองอีกครั้ง
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer"
                                        >
                                            ปิด
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        if (!equipment) {
                            return null;
                        }

                        return (
                            <>
                                {/* Header */}
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <Package className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                {equipment.equipmentName || 'ไม่มีชื่ออุปกรณ์'}
                                            </h2>
                                            <p className="text-gray-600">รหัสอุปกรณ์: #{equipment.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                            equipment.equipmentStatusName === 'Available'
                                                ? 'bg-green-100 text-green-800'
                                                : equipment.equipmentStatusName === 'In Use'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : equipment.equipmentStatusName === 'Under Maintenance'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : equipment.equipmentStatusName === 'Damaged'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {equipment.equipmentStatusName}
                                        </span>
                                        <button
                                            onClick={onClose}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* ข้อมูลทั่วไป */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Tag className="h-5 w-5 text-indigo-600" />
                                            ข้อมูลทั่วไป
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InfoItem label="ชื่ออุปกรณ์" value={equipment.equipmentName} />
                                            <InfoItem label="ประเภท">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    equipment.equipmentTypeName === 'Hardware'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {equipment.equipmentTypeName}
                                                </span>
                                            </InfoItem>
                                            <InfoItem label="ยี่ห้อ" value={equipment.brand} />
                                            <InfoItem label="รุ่น" value={equipment.model} />

                                            {equipment.serialNumber && (
                                                <InfoItem label="Serial Number">
                                                    <span className="font-mono text-sm text-gray-900 bg-gray-100 px-3 py-1 rounded">
                                                        {equipment.serialNumber}
                                                    </span>
                                                </InfoItem>
                                            )}

                                            {equipment.licenseKey && (
                                                <InfoItem label="License Key">
                                                    <span className="font-mono text-sm text-purple-900 bg-purple-50 px-3 py-1 rounded">
                                                        {equipment.licenseKey}
                                                    </span>
                                                </InfoItem>
                                            )}
                                        </div>
                                    </div>

                                    {/* ข้อมูล LOT */}
                                    {equipment.lotName && (
                                        <div className="pt-6 border-t border-gray-200">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-indigo-600" />
                                                ข้อมูล LOT
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <InfoItem label="ชื่อ LOT" value={equipment.lotName} />
                                                <InfoItem label="ประเภท LOT" value={equipment.lotTypeName} />

                                                {equipment.academicYear && (
                                                    <InfoItem label="ปีการศึกษา">
                                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
                                                            {equipment.academicYear}
                                                        </span>
                                                    </InfoItem>
                                                )}

                                                {equipment.referenceDoc && (
                                                    <InfoItem label="เอกสารอ้างอิง" value={equipment.referenceDoc} />
                                                )}

                                                {equipment.purchaseDate && (
                                                    <InfoItem label="วันที่จัดซื้อ">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Calendar className="h-4 w-4 text-indigo-600" />
                                                            {new Date(equipment.purchaseDate).toLocaleDateString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </InfoItem>
                                                )}

                                                {equipment.expireDate && (
                                                    <InfoItem label="วันหมดอายุ">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Calendar className="h-4 w-4 text-red-600" />
                                                            {new Date(equipment.expireDate).toLocaleDateString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </InfoItem>
                                                )}

                                                {equipment.description && (
                                                    <div className="md:col-span-2">
                                                        <InfoItem label="รายละเอียด" value={equipment.description} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium transition-colors cursor-pointer"
                                    >
                                        ปิด
                                    </button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}

interface InfoItemProps {
    label: string;
    value?: string | null;
    children?: React.ReactNode;
}

function InfoItem({ label, value, children }: InfoItemProps) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
                {label}
            </label>
            {children || (
                <p className="text-gray-900 font-medium">
                    {value || '-'}
                </p>
            )}
        </div>
    );
}

