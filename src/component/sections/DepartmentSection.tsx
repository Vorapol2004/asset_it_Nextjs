'use client';

import { useState, useEffect } from 'react';
import {
    Briefcase, Plus, Trash2, Edit, Search, Loader2, X, Save, CheckCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { Department } from '@/types/type';

export default function DepartmentSection() {
    // 🎨 Mock Data สำหรับทดสอบ (ลบได้เมื่อมี API จริง)
    const mockDepartments: Department[] = [
        { id: 1, departmentName: 'ฝ่ายไอที', isActive: true, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
        { id: 2, departmentName: 'ฝ่ายบัญชี', isActive: true, createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
        { id: 3, departmentName: 'ฝ่ายทรัพยากรบุคคล', isActive: true, createdAt: '2024-01-17T00:00:00Z', updatedAt: '2024-01-17T00:00:00Z' },
        { id: 4, departmentName: 'ฝ่ายการตลาด', isActive: false, createdAt: '2024-01-18T00:00:00Z', updatedAt: '2024-06-20T00:00:00Z' },
        { id: 5, departmentName: 'ฝ่ายขาย', isActive: true, createdAt: '2024-01-19T00:00:00Z', updatedAt: '2024-01-19T00:00:00Z' },
        { id: 6, departmentName: 'ฝ่ายผลิต', isActive: true, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-20T00:00:00Z' },
        { id: 7, departmentName: 'ฝ่ายจัดซื้อ', isActive: true, createdAt: '2024-01-21T00:00:00Z', updatedAt: '2024-01-21T00:00:00Z' },
        { id: 8, departmentName: 'ฝ่ายคลังสินค้า', isActive: true, createdAt: '2024-01-22T00:00:00Z', updatedAt: '2024-01-22T00:00:00Z' },
        { id: 9, departmentName: 'ฝ่ายวิจัยและพัฒนา', isActive: false, createdAt: '2024-01-23T00:00:00Z', updatedAt: '2024-08-10T00:00:00Z' },
        { id: 10, departmentName: 'ฝ่ายประกันคุณภาพ', isActive: true, createdAt: '2024-01-24T00:00:00Z', updatedAt: '2024-01-24T00:00:00Z' },
    ];

    const [departments, setDepartments] = useState<Department[]>(mockDepartments); // ใช้ Mock Data
    const [loading, setLoading] = useState(false); // เปลี่ยนเป็น false เพื่อแสดงข้อมูลทันที
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ departmentName: '', isActive: true });

    useEffect(() => {
        // fetchDepartments(); // ปิดไว้ก่อน เพื่อใช้ Mock Data
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await api.department.getAll();
            setDepartments(data);
        } catch (error) {
            console.error('Error:', error);
            // ถ้า API ล้มเหลว ใช้ Mock Data
            setDepartments(mockDepartments);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingId(null); // ✅ ตั้งเป็น null เพื่อบอกว่าเป็นการเพิ่ม
        setFormData({ departmentName: '', isActive: true });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null); // ✅ Reset เมื่อปิด modal
        setFormData({ departmentName: '', isActive: true }); // ✅ Reset form data
    };

    const handleEdit = (dept: Department) => {
        setEditingId(dept.id);
        setFormData({ departmentName: dept.departmentName, isActive: dept.isActive });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await api.department.update(editingId, formData);
            } else {
                await api.department.create(formData);
            }
            handleCloseModal();
            fetchDepartments();
            alert(editingId ? '✅ แก้ไขเรียบร้อย' : '✅ เพิ่มเรียบร้อย');
        } catch (error) {
            alert('❌ เกิดข้อผิดพลาด');
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`ต้องการลบ "${name}" ใช่หรือไม่?`)) return;
        try {
            await api.department.delete(id);
            fetchDepartments();
            alert('✅ ลบเรียบร้อย');
        } catch (error) {
            alert('❌ ไม่สามารถลบได้');
        }
    };

    const filtered = departments.filter(d => d.departmentName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">จัดการแผนก</h2>
                        <p className="text-gray-600">มีทั้งหมด {departments.length} แผนก</p>
                    </div>
                </div>
                <button onClick={handleAdd} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md font-semibold">
                    <Plus className="h-5 w-5 mr-2" />
                    เพิ่มแผนก
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
                        placeholder="ค้นหาแผนก..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-500 outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">กำลังโหลด...</p>
                </div>
            ) : (
                <table className="w-full">
                    <thead className="bg-blue-50">
                    <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">ชื่อแผนก</th>
                        <th className="px-6 py-3 text-center font-semibold text-gray-700">สถานะ</th>
                        <th className="px-6 py-3 text-center font-semibold text-gray-700">จัดการ</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {filtered.map((dept) => (
                        <tr key={dept.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-bold text-gray-900">#{dept.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{dept.departmentName}</td>
                            <td className="px-6 py-4 text-center">
                                {dept.isActive ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">🟢 ใช้งาน</span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">🔴 ไม่ใช้งาน</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => handleEdit(dept)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDelete(dept.id, dept.departmentName)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-white/90 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {editingId ? 'แก้ไขแผนก' : 'เพิ่มแผนก'}
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
                                <label className="block text-sm font-bold mb-2 text-gray-800">ชื่อแผนก *</label>
                                <input
                                    type="text"
                                    value={formData.departmentName}
                                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
                                    placeholder="เช่น ฝ่ายไอที"
                                />
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
                                disabled={!formData.departmentName.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-all duration-300 ease-in-out"
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

