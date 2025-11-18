'use client';

import { useState, useEffect } from 'react';
import { X, Save, ChevronDown } from 'lucide-react';
import { Department, Building, Floor, Room } from '@/types/type';

type LocationType = 'department' | 'building' | 'floor' | 'room';
type ModalMode = 'create' | 'edit';

type CreateDepartmentData = { departmentName: string };
type CreateBuildingData = { buildingName: string; departmentId: number };
type CreateFloorData = { floorName: string; buildingId: number };
type CreateRoomData = { roomName: string; floorId: number };

type UpdateDepartmentData = { departmentName?: string };
type UpdateBuildingData = { buildingName?: string; departmentId?: number };
type UpdateFloorData = { floorName?: string; buildingId?: number };
type UpdateRoomData = { roomName?: string; floorId?: number };

type CreateData = CreateDepartmentData | CreateBuildingData | CreateFloorData | CreateRoomData;
type UpdateData = UpdateDepartmentData | UpdateBuildingData | UpdateFloorData | UpdateRoomData;

interface LocationModalProps {
    type: LocationType;
    mode: ModalMode;
    item: Department | Building | Floor | Room | null;
    departments: Department[];
    buildings: Building[];
    floors: Floor[];
    selectedDepartment: number;
    selectedBuilding: number;
    selectedFloor: number;
    onClose: () => void;
    onCreate: (data: CreateData) => Promise<void>;
    onUpdate: (id: number, data: UpdateData) => Promise<void>;
}

export function LocationModal({
    type,
    mode,
    item,
    departments,
    buildings,
    floors,
    selectedDepartment,
    selectedBuilding,
    selectedFloor,
    onClose,
    onCreate,
    onUpdate,
}: LocationModalProps) {
    const [name, setName] = useState('');
    const [departmentId, setDepartmentId] = useState<number>(0);
    const [buildingId, setBuildingId] = useState<number>(0);
    const [floorId, setFloorId] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && item) {
            if (type === 'department') {
                const dept = item as Department;
                setName(dept.departmentName || '');
            } else if (type === 'building') {
                const bldg = item as Building;
                setName(bldg.buildingName || '');
                // Try to get departmentId from building if available
                setDepartmentId(selectedDepartment || 0);
            } else if (type === 'floor') {
                const flr = item as Floor;
                setName(flr.floorName || '');
                setBuildingId(flr.buildingId || selectedBuilding || 0);
            } else if (type === 'room') {
                const rm = item as Room;
                setName(rm.roomName || '');
                setFloorId(rm.floorId || selectedFloor || 0);
            }
        } else {
            // Create mode - set defaults
            setName('');
            setDepartmentId(selectedDepartment || 0);
            setBuildingId(selectedBuilding || 0);
            setFloorId(selectedFloor || 0);
        }
    }, [mode, item, type, selectedDepartment, selectedBuilding, selectedFloor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!name.trim()) {
            setError('กรุณากรอกชื่อ');
            return;
        }

        if (type === 'building' && departmentId === 0) {
            setError('กรุณาเลือกแผนก');
            return;
        }

        if (type === 'floor' && buildingId === 0) {
            setError('กรุณาเลือกตึก');
            return;
        }

        if (type === 'room' && floorId === 0) {
            setError('กรุณาเลือกชั้น');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'create') {
                let data: CreateData;
                if (type === 'department') {
                    data = { departmentName: name.trim() };
                } else if (type === 'building') {
                    data = { buildingName: name.trim(), departmentId };
                } else if (type === 'floor') {
                    data = { floorName: name.trim(), buildingId };
                } else if (type === 'room') {
                    data = { roomName: name.trim(), floorId };
                } else {
                    throw new Error('Invalid location type');
                }
                await onCreate(data);
            } else {
                if (!item) return;
                let data: UpdateData;
                if (type === 'department') {
                    data = { departmentName: name.trim() };
                } else if (type === 'building') {
                    data = { buildingName: name.trim(), departmentId };
                } else if (type === 'floor') {
                    data = { floorName: name.trim(), buildingId };
                } else if (type === 'room') {
                    data = { roomName: name.trim(), floorId };
                } else {
                    throw new Error('Invalid location type');
                }
                await onUpdate(item.id, data);
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('เกิดข้อผิดพลาด');
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        const typeNames = {
            department: 'แผนก',
            building: 'ตึก',
            floor: 'ชั้น',
            room: 'ห้อง',
        };
        return `${mode === 'create' ? 'เพิ่ม' : 'แก้ไข'}${typeNames[type]}`;
    };

    const getNameLabel = () => {
        const labels = {
            department: 'ชื่อแผนก',
            building: 'ชื่อตึก',
            floor: 'ชื่อชั้น',
            room: 'ชื่อห้อง',
        };
        return labels[type];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            {getNameLabel()} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder={`กรอก${getNameLabel()}`}
                            required
                        />
                    </div>

                    {/* Department Select (for building) */}
                    {type === 'building' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                แผนก <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(Number(e.target.value))}
                                    disabled={loading || mode === 'edit'}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-white focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none cursor-pointer"
                                    required
                                >
                                    <option value={0}>-- เลือกแผนก --</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.departmentName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Building Select (for floor) */}
                    {type === 'floor' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                ตึก <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={buildingId}
                                    onChange={(e) => setBuildingId(Number(e.target.value))}
                                    disabled={loading || mode === 'edit'}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-white focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none cursor-pointer"
                                    required
                                >
                                    <option value={0}>-- เลือกตึก --</option>
                                    {buildings.map((bldg) => (
                                        <option key={bldg.id} value={bldg.id}>
                                            {bldg.buildingName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Floor Select (for room) */}
                    {type === 'room' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                ชั้น <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={floorId}
                                    onChange={(e) => setFloorId(Number(e.target.value))}
                                    disabled={loading || mode === 'edit'}
                                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg text-gray-900 font-medium bg-white focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none cursor-pointer"
                                    required
                                >
                                    <option value={0}>-- เลือกชั้น --</option>
                                    {floors.map((floor) => (
                                        <option key={floor.id} value={floor.id}>
                                            {floor.floorName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save className="h-5 w-5" />
                            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

