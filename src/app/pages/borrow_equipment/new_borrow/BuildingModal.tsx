'use client';

import { useState, useEffect } from 'react';
import { X, Save, Building2, AlertCircle, Trash2 } from 'lucide-react';
import { Building, Department } from '@/types/type';

interface BuildingModalProps {
    isOpen: boolean;
    building?: Building | null; // null = เพิ่มใหม่, มีค่า = แก้ไข
    selectedDepartment: Department | null; // แผนกที่เลือก (ใช้สำหรับเพิ่มใหม่)
    departments: Department[]; // รายการแผนกทั้งหมด (ใช้สำหรับแก้ไข)
    onClose: () => void;
    onSave: (data: { buildingName: string; departmentId: number }) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

export function BuildingModal({
    isOpen,
    building,
    selectedDepartment,
    departments,
    onClose,
    onSave,
    onDelete,
}: BuildingModalProps) {
    const [buildingName, setBuildingName] = useState('');
    const [departmentId, setDepartmentId] = useState<number>(0);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!building;
    const canChangeDepartment = isEditMode; // แก้ไขได้เมื่ออยู่ในโหมดแก้ไข

    useEffect(() => {
        if (isOpen) {
            if (building) {
                setBuildingName(building.buildingName || '');
                // TODO: ถ้า Building interface มี departmentId ให้ใช้ตรงนี้
                // setDepartmentId((building as any).departmentId || 0);
                setDepartmentId(0); // ต้องดึงจาก API หรือ props
            } else {
                setBuildingName('');
                setDepartmentId(selectedDepartment?.id || 0);
            }
            setError(null);
        }
    }, [isOpen, building, selectedDepartment]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !saving && !deleting) onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, saving, deleting, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!buildingName.trim()) {
            setError('กรุณากรอกชื่อตึก');
            return;
        }

        if (!departmentId || departmentId === 0) {
            setError('กรุณาเลือกแผนก');
            return;
        }

        try {
            setSaving(true);
            await onSave({
                buildingName: buildingName.trim(),
                departmentId,
            });
            onClose();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!building || !onDelete) return;

        const confirmDelete = window.confirm(
            `ต้องการลบตึก "${building.buildingName}" หรือไม่?\n\n⚠️ การกระทำนี้ไม่สามารถยกเลิกได้\n\n⚠️ หากมีชั้นหรือห้องที่เกี่ยวข้อง จะไม่สามารถลบได้`
        );

        if (!confirmDelete) return;

        try {
            setDeleting(true);
            setError(null);
            await onDelete(building.id);
            onClose();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบข้อมูล';
            setError(errorMessage);
        } finally {
            setDeleting(false);
        }
    };

    if (!isOpen) return null;

    const currentDepartment = departments.find(d => d.id === departmentId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditMode ? 'แก้ไขตึก' : 'เพิ่มตึกใหม่'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={saving || deleting}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* แผนก */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                แผนก <span className="text-red-500">*</span>
                            </label>
                            {canChangeDepartment ? (
                                <select
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(Number(e.target.value))}
                                    disabled={saving}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                >
                                    <option value={0}>-- เลือกแผนก --</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.departmentName}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium">
                                    {currentDepartment?.departmentName || 'ไม่ระบุ'}
                                </div>
                            )}
                            {!canChangeDepartment && (
                                <p className="text-xs text-gray-500 mt-1">
                                    ตึกนี้จะอยู่ในแผนก: {currentDepartment?.departmentName || 'ไม่ระบุ'}
                                </p>
                            )}
                        </div>

                        {/* ชื่อตึก */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                ชื่อตึก <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={buildingName}
                                onChange={(e) => setBuildingName(e.target.value)}
                                disabled={saving}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="เช่น ตึก A, ตึกวิทยาศาสตร์"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-6">
                        {isEditMode && onDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={saving || deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {deleting ? 'กำลังลบ...' : 'ลบตึก'}
                            </button>
                        )}
                        <div className="flex justify-end gap-3 ml-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={saving || deleting}
                                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                disabled={saving || deleting}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {saving ? 'กำลังบันทึก...' : isEditMode ? 'บันทึกการแก้ไข' : 'บันทึก'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

