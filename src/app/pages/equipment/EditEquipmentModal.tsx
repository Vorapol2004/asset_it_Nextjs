'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    RefreshCw, Package, X, AlertCircle, Save, Trash2
} from 'lucide-react';
import { EquipmentView } from '@/types/type';

interface EditEquipmentModalProps {
    equipment: EquipmentView;
    loading: boolean;
    error: string | null;
    statuses: { id: number; equipmentStatusName: string }[];
    types: { id: number; equipmentTypeName: string }[];
    onClose: () => void;
    onSave: (data: Partial<EquipmentView>) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export function EditEquipmentModal({
    equipment,
    loading,
    error,
    statuses,
    types,
    onClose,
    onSave,
    onDelete,
}: EditEquipmentModalProps) {
    const [formData, setFormData] = useState({
        equipmentName: equipment.equipmentName || '',
        brand: equipment.brand || '',
        model: equipment.model || '',
        serialNumber: equipment.serialNumber || '',
        licenseKey: equipment.licenseKey || '',
        equipmentTypeId: equipment.equipmentTypeId || 0,
        equipmentStatusId: equipment.equipmentStatusId || 0,
    });

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // หา equipment type ที่เลือก
    const selectedType = useMemo(() => {
        return types.find(t => t.id === formData.equipmentTypeId);
    }, [types, formData.equipmentTypeId]);

    // ตรวจสอบว่าเป็น hardware หรือ software
    const isHardware = selectedType?.equipmentTypeName?.toLowerCase() === 'hardware';
    const isSoftware = selectedType?.equipmentTypeName?.toLowerCase() === 'software';

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !saving && !deleting) onClose();
        };//ป้องกันกด ESC
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose, saving, deleting]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.equipmentName.trim()) {
            alert('กรุณากรอกชื่ออุปกรณ์');
            return;
        }

        if (!formData.equipmentTypeId || formData.equipmentTypeId === 0) {
            alert('กรุณาเลือกประเภทอุปกรณ์');
            return;
        }

        if (!formData.equipmentStatusId || formData.equipmentStatusId === 0) {
            alert('กรุณาเลือกสถานะอุปกรณ์');
            return;
        }

        try {
            setSaving(true);
            await onSave({
                equipmentName: formData.equipmentName.trim(),
                brand: formData.brand.trim() || undefined,
                model: formData.model.trim() || undefined,
                serialNumber: formData.serialNumber.trim() || undefined,
                licenseKey: formData.licenseKey.trim() || undefined,
                equipmentTypeId: formData.equipmentTypeId,
                equipmentStatusId: formData.equipmentStatusId,
            });
        } catch {
            // Error handling is done by parent component
        } finally {
            setSaving(false); // reset state
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `ต้องการลบอุปกรณ์ "${equipment.equipmentName}" หรือไม่?\n\n⚠️ การกระทำนี้ไม่สามารถยกเลิกได้`
        );
        
        if (!confirmDelete) return;

        try {
            setDeleting(true);
            await onDelete(equipment.id);
            
        } catch {
            // Error handling is done by parent component
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 backdrop-blur-sm bg-white/30 transition-all"
                onClick={saving || deleting ? undefined : onClose}// ป้องกันกดยกเลิกหรือลบข้อมูลอุปกรณ์ในขณะที่กำลังบันทึกหรือลบ
            />

            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
                    {loading ? (
                        <div className="flex flex-col items-center py-20">
                            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                            <span className="text-gray-600 font-medium">กำลังโหลด...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center py-20 px-6">
                            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
                            <p className="text-gray-600 text-center mb-6">{error}</p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer"
                            >
                                ปิด
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <Package className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                            แก้ไขอุปกรณ์
                                        </h2>
                                        <p className="text-gray-600">รหัสอุปกรณ์: #{equipment.id}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={saving}
                                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* ชื่ออุปกรณ์ */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ชื่ออุปกรณ์ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.equipmentName}
                                        onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-gray-500 focus:border-indigo-500 transition-colors"
                                        required
                                        disabled={saving}
                                    />
                                </div>

                                {/* ยี่ห้อ */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ยี่ห้อ
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-gray-500 focus:border-indigo-500 transition-colors"
                                        disabled={saving}
                                    />
                                </div>

                                {/* รุ่น */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        รุ่น
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-gray-500 focus:border-indigo-500 transition-colors"
                                        disabled={saving}
                                    />
                                </div>

                                {/* Serial Number - แสดงเฉพาะ Hardware */}
                                {isHardware && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Serial Number
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.serialNumber}
                                            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-gray-500 focus:border-indigo-500 transition-colors font-mono"
                                            disabled={saving}
                                        />
                                    </div>
                                )}

                                {/* License Key - แสดงเฉพาะ Software */}
                                {isSoftware && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            License Key
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.licenseKey}
                                            onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-gray-500 focus:border-indigo-500 transition-colors font-mono"
                                            disabled={saving}
                                        />
                                    </div>
                                )}

                                {/* ประเภทอุปกรณ์ */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ประเภทอุปกรณ์ <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.equipmentTypeId}
                                        onChange={(e) => setFormData({ ...formData, equipmentTypeId: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-gray-500 focus:border-indigo-500 transition-colors"
                                        required
                                        disabled={saving}
                                    >
                                        <option value="0">-- เลือกประเภท --</option>
                                        {types.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.equipmentTypeName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* สถานะอุปกรณ์ */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        สถานะอุปกรณ์ <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.equipmentStatusId}
                                        onChange={(e) => setFormData({ ...formData, equipmentStatusId: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none text-gray-500 focus:border-indigo-500 transition-colors"
                                        required
                                        disabled={saving}
                                    >
                                        <option value="0">-- เลือกสถานะ --</option>
                                        {statuses.map((status) => (
                                            <option key={status.id} value={status.id}>
                                                {status.equipmentStatusName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={saving || deleting}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            กำลังลบ...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4" />
                                            ลบอุปกรณ์
                                        </>
                                    )}
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={saving || deleting}
                                        className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving || deleting}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                กำลังบันทึก...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                บันทึก
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

