'use client';

import { useState } from 'react';
import {
    Layers, Plus, Trash2, Edit, Search, X, Save, CheckCircle
} from 'lucide-react';
import { Floor, Building } from '@/types/type';

export default function FloorSection() {
    // 🎨 Mock Data
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

    const [floors, setFloors] = useState<Floor[]>(mockFloors);
    const [buildings] = useState<Building[]>(mockBuildings);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ floorName: '', buildingId: 0, isActive: true });

    // Join building data กับ floor
    const floorsWithBuilding = floors.map(floor => ({
        ...floor,
        building: buildings.find(b => b.id === floor.buildingId)
    }));

    const filtered = floorsWithBuilding.filter(f => f.floorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ floorName: '', buildingId: 0, isActive: true });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ floorName: '', buildingId: 0, isActive: true });
    };

    const handleEdit = (item: Floor) => {
        setEditingId(item.id);
        setFormData({ floorName: item.floorName, buildingId: item.buildingId, isActive: item.isActive });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            // TODO: เมื่อมี API ให้เรียก api.floor.create หรือ api.floor.update
            handleCloseModal();
            alert(editingId ? '✅ แก้ไขเรียบร้อย' : '✅ เพิ่มเรียบร้อย');
        } catch (error) {
            alert('❌ เกิดข้อผิดพลาด');
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`ต้องการลบ "${name}" ใช่หรือไม่?`)) return;
        try {
            // TODO: เมื่อมี API ให้เรียก api.floor.delete(id);
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
                    <Layers className="h-8 w-8 text-orange-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">จัดการชั้น</h2>
                        <p className="text-gray-600">มีทั้งหมด {floors.length} ชั้น</p>
                    </div>
                </div>
                <button onClick={handleAdd} className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-md font-semibold cursor-pointer">
                    <Plus className="h-5 w-5 mr-2" />
                    เพิ่มชั้น
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
                        placeholder="ค้นหาชั้น..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-orange-500"
                    />
                </div>
            </div>

            {/* Table */}
            <table className="w-full">
                <thead className="bg-orange-50">
                <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">ชื่อชั้น</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">ตึก</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">สถานะ</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-700">จัดการ</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-900">#{item.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{item.floorName}</td>
                        <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                    🏢 {item.building?.buildingName}
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
                                <button onClick={() => handleEdit(item)} className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg cursor-pointer">
                                    <Edit className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleDelete(item.id, item.floorName)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer">
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
                                {editingId ? 'แก้ไขชั้น' : 'เพิ่มชั้น'}
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
                                <label className="block text-sm font-bold mb-2 text-gray-800">ชื่อชั้น *</label>
                                <input
                                    type="text"
                                    value={formData.floorName}
                                    onChange={(e) => setFormData({ ...formData, floorName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-orange-500"
                                    placeholder="เช่น ชั้น 1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-800">ตึก *</label>
                                <select
                                    value={formData.buildingId}
                                    onChange={(e) => setFormData({ ...formData, buildingId: Number(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-orange-500"
                                >
                                    <option value={0}>เลือกตึก</option>
                                    {buildings.filter(b => b.isActive).map((building) => (
                                        <option key={building.id} value={building.id}>
                                            {building.buildingName}
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
                                disabled={!formData.floorName.trim() || formData.buildingId === 0}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 cursor-pointer transition-all duration-300 ease-in-out"
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

