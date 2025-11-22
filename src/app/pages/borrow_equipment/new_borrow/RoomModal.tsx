'use client';

import { useState, useEffect } from 'react';
import { X, Save, DoorOpen, AlertCircle, Trash2 } from 'lucide-react';
import { Room, Floor } from '@/types/type';

interface RoomModalProps {
    isOpen: boolean;
    room?: Room | null; // null = เพิ่มใหม่, มีค่า = แก้ไข
    selectedFloor: Floor | null; // ชั้นที่เลือก (ใช้สำหรับเพิ่มใหม่)
    floors: Floor[]; // รายการชั้นทั้งหมด (ใช้สำหรับแก้ไข)
    onClose: () => void;
    onSave: (data: { roomName: string; floorId: number }) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

export function RoomModal({
    isOpen,
    room,
    selectedFloor,
    floors,
    onClose,
    onSave,
    onDelete,
}: RoomModalProps) {
    const [roomName, setRoomName] = useState('');
    const [floorId, setFloorId] = useState<number>(0);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!room;
    const canChangeFloor = isEditMode; // แก้ไขได้เมื่ออยู่ในโหมดแก้ไข

    useEffect(() => {
        if (isOpen) {
            if (room) {
                setRoomName(room.roomName || '');
                setFloorId(room.floorId || 0);
            } else {
                setRoomName('');
                setFloorId(selectedFloor?.id || 0);
            }
            setError(null);
        }
    }, [isOpen, room, selectedFloor]);

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

        if (!roomName.trim()) {
            setError('กรุณากรอกชื่อห้อง');
            return;
        }

        if (!floorId || floorId === 0) {
            setError('กรุณาเลือกชั้น');
            return;
        }

        try {
            setSaving(true);
            await onSave({
                roomName: roomName.trim(),
                floorId,
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
        if (!room || !onDelete) return;

        const confirmDelete = window.confirm(
            `ต้องการลบห้อง "${room.roomName}" หรือไม่?\n\n⚠️ การกระทำนี้ไม่สามารถยกเลิกได้\n\n⚠️ หากมีข้อมูลที่เกี่ยวข้อง (เช่น Employee) จะไม่สามารถลบได้`
        );

        if (!confirmDelete) return;

        try {
            setDeleting(true);
            setError(null);
            await onDelete(room.id);
            onClose();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบข้อมูล';
            setError(errorMessage);
        } finally {
            setDeleting(false);
        }
    };

    if (!isOpen) return null;

    const currentFloor = floors.find(f => f.id === floorId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <DoorOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditMode ? 'แก้ไขห้อง' : 'เพิ่มห้องใหม่'}
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
                        {/* ชั้น */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                ชั้น <span className="text-red-500">*</span>
                            </label>
                            {canChangeFloor ? (
                                <select
                                    value={floorId}
                                    onChange={(e) => setFloorId(Number(e.target.value))}
                                    disabled={saving}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                >
                                    <option value={0}>-- เลือกชั้น --</option>
                                    {floors.map(f => (
                                        <option key={f.id} value={f.id}>{f.floorName}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium">
                                    {currentFloor?.floorName || 'ไม่ระบุ'}
                                </div>
                            )}
                            {!canChangeFloor && (
                                <p className="text-xs text-gray-500 mt-1">
                                    ห้องนี้จะอยู่ในชั้น: {currentFloor?.floorName || 'ไม่ระบุ'}
                                </p>
                            )}
                        </div>

                        {/* ชื่อห้อง */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                ชื่อห้อง <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                disabled={saving}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="เช่น ห้อง 101, ห้องประชุมใหญ่"
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
                                {deleting ? 'กำลังลบ...' : 'ลบห้อง'}
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

