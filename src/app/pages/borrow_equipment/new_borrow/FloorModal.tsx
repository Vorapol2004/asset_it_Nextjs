'use client';

import { useState, useEffect } from 'react';
import { X, Save, Layers, AlertCircle, Trash2 } from 'lucide-react';
import { Floor, Building } from '@/types/type';

interface FloorModalProps {
    isOpen: boolean;
    floor?: Floor | null; // null = เพิ่มใหม่, มีค่า = แก้ไข
    selectedBuilding: Building | null; // ตึกที่เลือก (ใช้สำหรับเพิ่มใหม่)
    buildings: Building[]; // รายการตึกทั้งหมด (ใช้สำหรับแก้ไข)
    onClose: () => void;
    onSave: (data: { floorName: string; buildingId: number }) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

export function FloorModal({
    isOpen,
    floor,
    selectedBuilding,
    buildings,
    onClose,
    onSave,
    onDelete,
}: FloorModalProps) {
    const [floorName, setFloorName] = useState('');
    const [buildingId, setBuildingId] = useState<number>(0);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!floor;
    const canChangeBuilding = isEditMode; // แก้ไขได้เมื่ออยู่ในโหมดแก้ไข

    useEffect(() => {
        if (isOpen) {
            if (floor) {
                setFloorName(floor.floorName || '');
                setBuildingId(floor.buildingId || 0);
            } else {
                setFloorName('');
                setBuildingId(selectedBuilding?.id || 0);
            }
            setError(null);
        }
    }, [isOpen, floor, selectedBuilding]);

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

        if (!floorName.trim()) {
            setError('กรุณากรอกชื่อชั้น');
            return;
        }

        if (!buildingId || buildingId === 0) {
            setError('กรุณาเลือกตึก');
            return;
        }

        try {
            setSaving(true);
            await onSave({
                floorName: floorName.trim(),
                buildingId,
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
        if (!floor || !onDelete) return;

        const confirmDelete = window.confirm(
            `ต้องการลบชั้น "${floor.floorName}" หรือไม่?\n\n⚠️ การกระทำนี้ไม่สามารถยกเลิกได้\n\n⚠️ หากมีห้องที่เกี่ยวข้อง จะไม่สามารถลบได้`
        );

        if (!confirmDelete) return;

        try {
            setDeleting(true);
            setError(null);
            await onDelete(floor.id);
            onClose();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบข้อมูล';
            setError(errorMessage);
        } finally {
            setDeleting(false);
        }
    };

    if (!isOpen) return null;

    const currentBuilding = buildings.find(b => b.id === buildingId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Layers className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditMode ? 'แก้ไขชั้น' : 'เพิ่มชั้นใหม่'}
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
                        {/* ตึก */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                ตึก <span className="text-red-500">*</span>
                            </label>
                            {canChangeBuilding ? (
                                <select
                                    value={buildingId}
                                    onChange={(e) => setBuildingId(Number(e.target.value))}
                                    disabled={saving}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                >
                                    <option value={0}>-- เลือกตึก --</option>
                                    {buildings.map(b => (
                                        <option key={b.id} value={b.id}>{b.buildingName}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium">
                                    {currentBuilding?.buildingName || 'ไม่ระบุ'}
                                </div>
                            )}
                            {!canChangeBuilding && (
                                <p className="text-xs text-gray-500 mt-1">
                                    ชั้นนี้จะอยู่ในตึก: {currentBuilding?.buildingName || 'ไม่ระบุ'}
                                </p>
                            )}
                        </div>

                        {/* ชื่อชั้น */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                ชื่อชั้น <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={floorName}
                                onChange={(e) => setFloorName(e.target.value)}
                                disabled={saving}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="เช่น ชั้น 1, ชั้น 2, ชั้นใต้ดิน"
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
                                {deleting ? 'กำลังลบ...' : 'ลบชั้น'}
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

