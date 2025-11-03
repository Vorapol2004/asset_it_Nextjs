'use client';

import { useState } from 'react';
import {
    DoorOpen, Plus, Trash2, Edit, Search, X, Save, CheckCircle
} from 'lucide-react';
import { Room, Floor, Building } from '@/types/type';

export default function RoomSection() {
    // 🎨 Mock Data
    const mockRooms: Room[] = [
        { id: 1, roomName: 'ห้อง 101', floorId: 1, isActive: true, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
        { id: 2, roomName: 'ห้อง 102', floorId: 1, isActive: true, createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
        { id: 3, roomName: 'ห้อง 103', floorId: 1, isActive: true, createdAt: '2024-01-17T00:00:00Z', updatedAt: '2024-01-17T00:00:00Z' },
        { id: 4, roomName: 'ห้อง 201', floorId: 2, isActive: true, createdAt: '2024-01-18T00:00:00Z', updatedAt: '2024-01-18T00:00:00Z' },
        { id: 5, roomName: 'ห้อง 202', floorId: 2, isActive: true, createdAt: '2024-01-19T00:00:00Z', updatedAt: '2024-01-19T00:00:00Z' },
        { id: 6, roomName: 'ห้อง 301', floorId: 3, isActive: true, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-20T00:00:00Z' },
        { id: 7, roomName: 'ห้องประชุม A', floorId: 4, isActive: true, createdAt: '2024-01-21T00:00:00Z', updatedAt: '2024-01-21T00:00:00Z' },
        { id: 8, roomName: 'ห้องประชุม B', floorId: 4, isActive: true, createdAt: '2024-01-22T00:00:00Z', updatedAt: '2024-01-22T00:00:00Z' },
        { id: 9, roomName: 'ห้องพักพนักงาน', floorId: 5, isActive: true, createdAt: '2024-01-23T00:00:00Z', updatedAt: '2024-01-23T00:00:00Z' },
        { id: 10, roomName: 'ห้อง Server', floorId: 6, isActive: true, createdAt: '2024-01-24T00:00:00Z', updatedAt: '2024-01-24T00:00:00Z' },
        { id: 11, roomName: 'ห้องซ่อมบำรุง', floorId: 8, isActive: false, createdAt: '2024-01-25T00:00:00Z', updatedAt: '2024-06-20T00:00:00Z' },
    ];

    const mockFloors: Floor[] = [
        { id: 1, floorName: 'ชั้น 1', buildingId: 1, isActive: true, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
        { id: 2, floorName: 'ชั้น 2', buildingId: 1, isActive: true, createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
        { id: 3, floorName: 'ชั้น 3', buildingId: 1, isActive: true, createdAt: '2024-01-17T00:00:00Z', updatedAt: '2024-01-17T00:00:00Z' },
        { id: 4, floorName: 'ชั้น 1', buildingId: 2, isActive: true, createdAt: '2024-01-18T00:00:00Z', updatedAt: '2024-01-18T00:00:00Z' },
        { id: 5, floorName: 'ชั้น 2', buildingId: 2, isActive: true, createdAt: '2024-01-19T00:00:00Z', updatedAt: '2024-01-19T00:00:00Z' },
        { id: 6, floorName: 'ชั้น Basement', buildingId: 4, isActive: true, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-20T00:00:00Z' },
        { id: 7, floorName: 'ชั้น G', buildingId: 4, isActive: true, createdAt: '2024-01-21T00:00:00Z', updatedAt: '2024-01-21T00:00:00Z' },
        { id: 8, floorName: 'ชั้น 1 (ซ่อม)', buildingId: 3, isActive: false, createdAt: '2024-01-22T00:00:00Z', updatedAt: '2024-06-20T00:00:00Z' },
    ];

    const mockBuildings: Building[] = [
        { id: 1, buildingName: 'อาคาร A', isActive: true, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
        { id: 2, buildingName: 'อาคาร B', isActive: true, createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
        { id: 3, buildingName: 'อาคาร C (ปรับปรุง)', isActive: false, createdAt: '2024-01-17T00:00:00Z', updatedAt: '2024-06-20T00:00:00Z' },
        { id: 4, buildingName: 'อาคารจอดรถ', isActive: true, createdAt: '2024-01-18T00:00:00Z', updatedAt: '2024-01-18T00:00:00Z' },
        { id: 5, buildingName: 'โกดังสินค้า 1', isActive: true, createdAt: '2024-01-19T00:00:00Z', updatedAt: '2024-01-19T00:00:00Z' },
        { id: 6, buildingName: 'โกดังสินค้า 2', isActive: true, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-20T00:00:00Z' },
    ];

    const [rooms, setRooms] = useState<Room[]>(mockRooms);
    const [floors] = useState<Floor[]>(mockFloors);
    const [buildings] = useState<Building[]>(mockBuildings);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ roomName: '', floorId: 0, isActive: true });

    // Join floor data กับ room
    const roomsWithFloor = rooms.map(room => ({
        ...room,
        floor: floors.find(f => f.id === room.floorId)
    }));

    const filtered = roomsWithFloor.filter(r => r.roomName.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ roomName: '', floorId: 0, isActive: true });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ roomName: '', floorId: 0, isActive: true });
    };

    const handleEdit = (item: Room) => {
        setEditingId(item.id);
        setFormData({ roomName: item.roomName, floorId: item.floorId, isActive: item.isActive });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            // TODO: เมื่อมี API ให้เรียก api.room.create หรือ api.room.update
            handleCloseModal();
            alert(editingId ? '✅ แก้ไขเรียบร้อย' : '✅ เพิ่มเรียบร้อย');
        } catch (error) {
            alert('❌ เกิดข้อผิดพลาด');
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`ต้องการลบ "${name}" ใช่หรือไม่?`)) return;
        try {
            // TODO: เมื่อมี API ให้เรียก api.room.delete(id);
            alert('✅ ลบเรียบร้อย');
        } catch (error) {
            alert('❌ ไม่สามารถลบได้');
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <DoorOpen className="h-8 w-8 text-purple-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">จัดการห้อง</h2>
                        <p className="text-gray-600">มีทั้งหมด {rooms.length} ห้อง</p>
                    </div>
                </div>
                <button onClick={handleAdd} className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md font-semibold cursor-pointer">
                    <Plus className="h-5 w-5 mr-2" />
                    เพิ่มห้อง
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ค้นหาห้อง..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-purple-500"
                    />
                </div>
            </div>

            {/* Table */}
            <table className="w-full">
                <thead className="bg-purple-50">
                <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">ชื่อห้อง</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">ชั้น</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">สถานะ</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">จัดการ</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-900">#{item.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{item.roomName}</td>
                        <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
                                    🏗️ {item.floor?.floorName}
                                </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            {item.isActive ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">🟢 ใช้งาน</span>
                            ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">🔴 ไม่ใช้งาน</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg cursor-pointer">
                                    <Edit className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleDelete(item.id, item.roomName)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-white/90 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {editingId ? 'แก้ไขห้อง' : 'เพิ่มห้อง'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-800">ชื่อห้อง *</label>
                                <input
                                    type="text"
                                    value={formData.roomName}
                                    onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500"
                                    placeholder="เช่น ห้อง 101"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-800">ชั้น *</label>
                                <select
                                    value={formData.floorId}
                                    onChange={(e) => setFormData({ ...formData, floorId: Number(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-purple-500"
                                >
                                    <option value={0}>เลือกชั้น</option>
                                    {floors.filter(f => f.isActive).map((floor) => (
                                        <option key={floor.id} value={floor.id}>
                                            {floor.floorName} ({buildings.find(b => b.id === floor.buildingId)?.buildingName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-800">สถานะ</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center text-gray-600 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.isActive === true}
                                            onChange={() => setFormData({ ...formData, isActive: true })}
                                            className="mr-2"
                                        />
                                        <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
                                        ใช้งาน
                                    </label>
                                    <label className="flex items-center text-gray-600 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.isActive === false}
                                            onChange={() => setFormData({ ...formData, isActive: false })}
                                            className="mr-2"
                                        />
                                        <X className="h-5 w-5 text-red-600 mr-1" />
                                        ไม่ใช้งาน
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-2 border-2 text-gray-600 border-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer transition-all duration-300 ease-in-out"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.roomName.trim() || formData.floorId === 0}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 cursor-pointer transition-all duration-300 ease-in-out"
                            >
                                <Save className="h-5 w-5 inline mr-2" />
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

