// 'use client';
//
// /**
//  * 🎯 Master Data Management (รวมทุกอย่างในหน้าเดียว)
//  * Path: /src/app/setting/master-data/page.tsx
//  * URL: /setting/master-data
//  *
//  * Features:
//  * - แผนก (Department)
//  * - ตึก (Building)
//  * - ชั้น (Floor)
//  * - ห้อง (Room)
//  */
//
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//     Briefcase, Building as BuildingIcon, Layers, DoorOpen,
//     Plus, Trash2, Edit, Search, AlertCircle, Loader2, ArrowLeft, X, Save, CheckCircle
// } from 'lucide-react';
// import { api } from '@/lib/api';
// import { Department, Building, Floor, Room } from '@/types/type';
//
// type TabType = 'department' | 'building' | 'floor' | 'room';
//
// export default function MasterDataPage() {
//     const router = useRouter();
//     const [activeTab, setActiveTab] = useState<TabType>('department');
//
//     // Tabs Configuration
//     const tabs = [
//         { id: 'department' as TabType, label: 'แผนก', icon: Briefcase, color: 'blue' },
//         { id: 'building' as TabType, label: 'ตึก', icon: BuildingIcon, color: 'green' },
//         { id: 'floor' as TabType, label: 'ชั้น', icon: Layers, color: 'orange' },
//         { id: 'room' as TabType, label: 'ห้อง', icon: DoorOpen, color: 'purple' },
//     ];
//
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
//             <div className="max-w-7xl mx-auto">
//
//                 {/* Header */}
//                 <div className="mb-6">
//                     <button
//                         onClick={() => router.push('/setting')}
//                         className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
//                     >
//                         <ArrowLeft className="h-5 w-5 mr-2" />
//                         กลับ
//                     </button>
//
//                     <div className="bg-white rounded-xl shadow-lg p-6">
//                         <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการข้อมูลหลัก</h1>
//                         <p className="text-gray-600">จัดการแผนก, ตึก, ชั้น, และห้องในระบบ</p>
//                     </div>
//                 </div>
//
//                 {/* Tabs */}
//                 <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
//                     <div className="flex border-b">
//                         {tabs.map((tab) => {
//                             const Icon = tab.icon;
//                             const isActive = activeTab === tab.id;
//                             return (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
//                                         isActive
//                                             ? `bg-${tab.color}-50 text-${tab.color}-700 border-b-4 border-${tab.color}-600`
//                                             : 'text-gray-600 hover:bg-gray-50'
//                                     }`}
//                                 >
//                                     <Icon className={`h-5 w-5 ${isActive ? `text-${tab.color}-600` : 'text-gray-500'}`} />
//                                     <span className="text-lg">{tab.label}</span>
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//
//                 {/* Tab Content */}
//                 <div className="bg-white rounded-xl shadow-lg p-6">
//                     {activeTab === 'department' && <DepartmentSection />}
//                     {activeTab === 'building' && <BuildingSection />}
//                     {activeTab === 'floor' && <FloorSection />}
//                     {activeTab === 'room' && <RoomSection />}
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// // ========================================
// // 📋 DEPARTMENT SECTION
// // ========================================
// function DepartmentSection() {
//     const [departments, setDepartments] = useState<Department[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [editingId, setEditingId] = useState<number | null>(null);
//     const [formData, setFormData] = useState({ departmentName: '', isActive: true });
//
//     useEffect(() => {
//         fetchDepartments();
//     }, []);
//
//     const fetchDepartments = async () => {
//         try {
//             setLoading(true);
//             const data = await api.department.getAll();
//             setDepartments(data);
//         } catch (error) {
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleAdd = () => {
//         setEditingId(null);
//         setFormData({ departmentName: '', isActive: true });
//         setShowModal(true);
//     };
//
//     const handleEdit = (dept: Department) => {
//         setEditingId(dept.id);
//         setFormData({ departmentName: dept.departmentName, isActive: dept.isActive });
//         setShowModal(true);
//     };
//
//     const handleSubmit = async () => {
//         try {
//             if (editingId) {
//                 await api.department.update(editingId, formData);
//             } else {
//                 await api.department.create(formData);
//             }
//             setShowModal(false);
//             fetchDepartments();
//             alert(editingId ? '✅ แก้ไขเรียบร้อย' : '✅ เพิ่มเรียบร้อย');
//         } catch (error) {
//             alert('❌ เกิดข้อผิดพลาด');
//         }
//     };
//
//     const handleDelete = async (id: number, name: string) => {
//         if (!window.confirm(`ต้องการลบ "${name}" ใช่หรือไม่?`)) return;
//         try {
//             await api.department.delete(id);
//             fetchDepartments();
//             alert('✅ ลบเรียบร้อย');
//         } catch (error) {
//             alert('❌ ไม่สามารถลบได้');
//         }
//     };
//
//     const filtered = departments.filter(d => d.departmentName.toLowerCase().includes(searchTerm.toLowerCase()));
//
//     return (
//         <div>
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center gap-3">
//                     <Briefcase className="h-8 w-8 text-blue-600" />
//                     <div>
//                         <h2 className="text-2xl font-bold text-gray-900">จัดการแผนก</h2>
//                         <p className="text-gray-600">มีทั้งหมด {departments.length} แผนก</p>
//                     </div>
//                 </div>
//                 <button onClick={handleAdd} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md font-semibold">
//                     <Plus className="h-5 w-5 mr-2" />
//                     เพิ่มแผนก
//                 </button>
//             </div>
//
//             {/* Search */}
//             <div className="mb-6">
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                         type="text"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         placeholder="ค้นหาแผนก..."
//                         className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-500 outline-none focus:border-blue-500"
//                     />
//                 </div>
//             </div>
//
//             {/* Table */}
//             {loading ? (
//                 <div className="text-center py-12">
//                     <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
//                     <p className="text-gray-600">กำลังโหลด...</p>
//                 </div>
//             ) : (
//                 <table className="w-full">
//                     <thead className="bg-blue-50">
//                     <tr>
//                         <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
//                         <th className="px-6 py-3 text-left font-semibold text-gray-700">ชื่อแผนก</th>
//                         <th className="px-6 py-3 text-center font-semibold text-gray-700">สถานะ</th>
//                         <th className="px-6 py-3 text-center font-semibold text-gray-700">จัดการ</th>
//                     </tr>
//                     </thead>
//                     <tbody className="divide-y">
//                     {filtered.map((dept) => (
//                         <tr key={dept.id} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 font-bold text-gray-900">#{dept.id}</td>
//                             <td className="px-6 py-4 font-medium text-gray-900">{dept.departmentName}</td>
//                             <td className="px-6 py-4 text-center">
//                                 {dept.isActive ? (
//                                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">🟢 ใช้งาน</span>
//                                 ) : (
//                                     <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">🔴 ไม่ใช้งาน</span>
//                                 )}
//                             </td>
//                             <td className="px-6 py-4">
//                                 <div className="flex justify-center gap-2">
//                                     <button onClick={() => handleEdit(dept)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
//                                         <Edit className="h-5 w-5" />
//                                     </button>
//                                     <button onClick={() => handleDelete(dept.id, dept.departmentName)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
//                                         <Trash2 className="h-5 w-5" />
//                                     </button>
//                                 </div>
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             )}
//
//             {/* Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
//                     <div className="bg-white/90 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-2xl font-bold text-gray-900">
//                                 {editingId ? 'แก้ไขแผนก' : 'เพิ่มแผนก'}
//                             </h3>
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="text-gray-500 hover:text-gray-700"
//                             >
//                                 <X className="h-6 w-6" />
//                             </button>
//                         </div>
//
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-bold mb-2 text-gray-800">ชื่อแผนก *</label>
//                                 <input
//                                     type="text"
//                                     value={formData.departmentName}
//                                     onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
//                                     className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium outline-none focus:border-blue-500"
//                                     placeholder="เช่น ฝ่ายไอที"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="block text-sm font-bold mb-2 text-gray-800">สถานะ</label>
//                                 <div className="flex gap-4">
//                                     <label className="flex items-center text-gray-600 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             checked={formData.isActive === true}
//                                             onChange={() => setFormData({ ...formData, isActive: true })}
//                                             className="mr-2"
//                                         />
//                                         <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
//                                         ใช้งาน
//                                     </label>
//                                     <label className="flex items-center text-gray-600 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             checked={formData.isActive === false}
//                                             onChange={() => setFormData({ ...formData, isActive: false })}
//                                             className="mr-2"
//                                         />
//                                         <X className="h-5 w-5 text-red-600 mr-1" />
//                                         ไม่ใช้งาน
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="flex justify-end gap-3 mt-6">
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="px-6 py-2 border-2 text-gray-600 border-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer transition-all duration-300 ease-in-out"
//                             >
//                                 ยกเลิก
//                             </button>
//                             <button
//                                 onClick={handleSubmit}
//                                 disabled={!formData.departmentName.trim()}
//                                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-all duration-300 ease-in-out"
//                             >
//                                 <Save className="h-5 w-5 inline mr-2" />
//                                 บันทึก
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//         </div>
//     );
// }
//
// // ========================================
// // 🏢 BUILDING SECTION
// // ========================================
// function BuildingSection() {
//     const [buildings, setBuildings] = useState<Building[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [editingId, setEditingId] = useState<number | null>(null);
//     const [formData, setFormData] = useState({ buildingName: '', isActive: true });
//
//     useEffect(() => {
//         fetchBuildings();
//     }, []);
//
//     const fetchBuildings = async () => {
//         try {
//             setLoading(true);
//             const data = await api.building.getAll();
//             setBuildings(data);
//         } catch (error) {
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleAdd = () => {
//         setEditingId(null);
//         setFormData({ buildingName: '', isActive: true });
//         setShowModal(true);
//     };
//
//     const handleEdit = (item: Building) => {
//         setEditingId(item.id);
//         setFormData({ buildingName: item.buildingName, isActive: item.isActive });
//         setShowModal(true);
//     };
//
//     const handleSubmit = async () => {
//         try {
//             if (editingId) {
//                 await api.building.update(editingId, formData);
//             } else {
//                 await api.building.create(formData);
//             }
//             setShowModal(false);
//             fetchBuildings();
//             alert(editingId ? '✅ แก้ไขเรียบร้อย' : '✅ เพิ่มเรียบร้อย');
//         } catch (error) {
//             alert('❌ เกิดข้อผิดพลาด');
//         }
//     };
//
//     const handleDelete = async (id: number, name: string) => {
//         if (!window.confirm(`ต้องการลบ "${name}" ใช่หรือไม่?`)) return;
//         try {
//             await api.building.delete(id);
//             fetchBuildings();
//             alert('✅ ลบเรียบร้อย');
//         } catch (error) {
//             alert('❌ ไม่สามารถลบได้');
//         }
//     };
//
//     const filtered = buildings.filter(b => b.buildingName.toLowerCase().includes(searchTerm.toLowerCase()));
//
//     return (
//         <div>
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center gap-3">
//                     <BuildingIcon className="h-8 w-8 text-green-600" />
//                     <div>
//                         <h2 className="text-2xl font-bold text-gray-900">จัดการตึก</h2>
//                         <p className="text-gray-600">มีทั้งหมด {buildings.length} ตึก</p>
//                     </div>
//                 </div>
//                 <button onClick={handleAdd} className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md font-semibold">
//                     <Plus className="h-5 w-5 mr-2" />
//                     เพิ่มตึก
//                 </button>
//             </div>
//
//             {/* Search */}
//             <div className="mb-6">
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                         type="text"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         placeholder="ค้นหาตึก..."
//                         className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-green-500"
//                     />
//                 </div>
//             </div>
//
//             {/* Table */}
//             {loading ? (
//                 <div className="text-center py-12">
//                     <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
//                     <p className="text-gray-600">กำลังโหลด...</p>
//                 </div>
//             ) : (
//                 <table className="w-full">
//                     <thead className="bg-green-50">
//                     <tr>
//                         <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
//                         <th className="px-6 py-3 text-left font-semibold text-gray-700">ชื่อตึก</th>
//                         <th className="px-6 py-3 text-center font-semibold text-gray-700">สถานะ</th>
//                         <th className="px-6 py-3 text-center font-semibold text-gray-700">จัดการ</th>
//                     </tr>
//                     </thead>
//                     <tbody className="divide-y">
//                     {filtered.map((item) => (
//                         <tr key={item.id} className="hover:bg-gray-50">
//                             <td className="px-6 py-4 font-bold text-gray-900">#{item.id}</td>
//                             <td className="px-6 py-4 font-medium text-gray-900">{item.buildingName}</td>
//                             <td className="px-6 py-4 text-center">
//                                 {item.isActive ? (
//                                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"> ใช้งาน</span>
//                                 ) : (
//                                     <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold"> ไม่ใช้งาน</span>
//                                 )}
//                             </td>
//                             <td className="px-6 py-4">
//                                 <div className="flex justify-center gap-2">
//                                     <button onClick={() => handleEdit(item)} className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
//                                         <Edit className="h-5 w-5" />
//                                     </button>
//                                     <button onClick={() => handleDelete(item.id, item.buildingName)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
//                                         <Trash2 className="h-5 w-5" />
//                                     </button>
//                                 </div>
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             )}
//
//             {/* Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-2xl font-bold">{editingId ? 'แก้ไขตึก' : 'เพิ่มตึก'}</h3>
//                             <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
//                                 <X className="h-6 w-6" />
//                             </button>
//                         </div>
//
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-bold mb-2">ชื่อตึก *</label>
//                                 <input
//                                     type="text"
//                                     value={formData.buildingName}
//                                     onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
//                                     className="w-full px-4 py-3 border-2 rounded-lg outline-none focus:border-green-500"
//                                     placeholder="เช่น อาคาร A"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="block text-sm font-bold mb-2">สถานะ</label>
//                                 <div className="flex gap-4">
//                                     <label className="flex items-center cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             checked={formData.isActive === true}
//                                             onChange={() => setFormData({ ...formData, isActive: true })}
//                                             className="mr-2"
//                                         />
//                                         <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
//                                         ใช้งาน
//                                     </label>
//                                     <label className="flex items-center cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             checked={formData.isActive === false}
//                                             onChange={() => setFormData({ ...formData, isActive: false })}
//                                             className="mr-2"
//                                         />
//                                         <X className="h-5 w-5 text-red-600 mr-1" />
//                                         ไม่ใช้งาน
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="flex justify-end gap-3 mt-6">
//                             <button onClick={() => setShowModal(false)} className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
//                                 ยกเลิก
//                             </button>
//                             <button onClick={handleSubmit} disabled={!formData.buildingName.trim()} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">
//                                 <Save className="h-5 w-5 inline mr-2" />
//                                 บันทึก
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// // ========================================
// // 🏗️ FLOOR SECTION (คล้าย Building แต่มี dropdown เลือกตึก)
// // ========================================
// function FloorSection() {
//     return (
//         <div className="text-center py-12">
//             <Layers className="h-16 w-16 text-orange-400 mx-auto mb-4" />
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Floor Section</h3>
//             <p className="text-gray-600">Coming soon... (คล้าย Building แต่มี dropdown เลือกตึก)</p>
//         </div>
//     );
// }
//
// // ========================================
// // 🚪 ROOM SECTION (คล้าย Floor แต่มี dropdown เลือกชั้น)
// // ========================================
// function RoomSection() {
//     return (
//         <div className="text-center py-12">
//             <DoorOpen className="h-16 w-16 text-purple-400 mx-auto mb-4" />
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Room Section</h3>
//             <p className="text-gray-600">Coming soon... (คล้าย Floor แต่มี dropdown เลือกชั้น)</p>
//         </div>
//     );
// }

'use client';

/**
 * 🎯 Master Data Management (รวมทุกอย่างในหน้าเดียว)
 * Path: /src/app/setting/master-data/page.tsx
 * URL: /setting/master-data
 *
 * Features:
 * - แผนก (Department)
 * - ตึก (Building)
 * - ชั้น (Floor)
 * - ห้อง (Room)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Briefcase, Building as BuildingIcon, Layers, DoorOpen,
    Plus, Trash2, Edit, Search, AlertCircle, Loader2, ArrowLeft, X, Save, CheckCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { Department, Building, Floor, Room } from '@/types/type';

type TabType = 'department' | 'building' | 'floor' | 'room';

export default function MasterDataPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('department');

    // Tabs Configuration
    const tabs = [
        { id: 'department' as TabType, label: 'แผนก', icon: Briefcase, color: 'blue' },
        { id: 'building' as TabType, label: 'ตึก', icon: BuildingIcon, color: 'green' },
        { id: 'floor' as TabType, label: 'ชั้น', icon: Layers, color: 'orange' },
        { id: 'room' as TabType, label: 'ห้อง', icon: DoorOpen, color: 'purple' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/pages/home')}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        กลับ
                    </button>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการข้อมูลหลัก</h1>
                        <p className="text-gray-600">จัดการแผนก, ตึก, ชั้น, และห้องในระบบ</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
                    <div className="flex border-b">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                                        isActive
                                            ? `bg-${tab.color}-50 text-${tab.color}-700 border-b-4 border-${tab.color}-600`
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className={`h-5 w-5 ${isActive ? `text-${tab.color}-600` : 'text-gray-500'}`} />
                                    <span className="text-lg">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {activeTab === 'department' && <DepartmentSection />}
                    {activeTab === 'building' && <BuildingSection />}
                    {activeTab === 'floor' && <FloorSection />}
                    {activeTab === 'room' && <RoomSection />}
                </div>
            </div>
        </div>
    );
}

// ========================================
// 📋 DEPARTMENT SECTION
// ========================================
function DepartmentSection() {
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
        setEditingId(null);
        setFormData({ departmentName: '', isActive: true });
        setShowModal(true);
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
            setShowModal(false);
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
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
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
                                onClick={() => setShowModal(false)}
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

// ========================================
// 🏢 BUILDING SECTION
// ========================================
function BuildingSection() {
    // 🎨 Mock Data สำหรับทดสอบ
    const mockBuildings: Building[] = [
        { id: 1, buildingName: 'อาคาร A', isActive: true, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
        { id: 2, buildingName: 'อาคาร B', isActive: true, createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
        { id: 3, buildingName: 'อาคาร C (ปรับปรุง)', isActive: false, createdAt: '2024-01-17T00:00:00Z', updatedAt: '2024-06-20T00:00:00Z' },
        { id: 4, buildingName: 'อาคารจอดรถ', isActive: true, createdAt: '2024-01-18T00:00:00Z', updatedAt: '2024-01-18T00:00:00Z' },
        { id: 5, buildingName: 'โกดังสินค้า 1', isActive: true, createdAt: '2024-01-19T00:00:00Z', updatedAt: '2024-01-19T00:00:00Z' },
        { id: 6, buildingName: 'โกดังสินค้า 2', isActive: true, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-20T00:00:00Z' },
    ];

    const [buildings, setBuildings] = useState<Building[]>(mockBuildings);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ buildingName: '', isActive: true });

    useEffect(() => {
        // fetchBuildings(); // ปิดไว้ก่อน
    }, []);

    const fetchBuildings = async () => {
        try {
            setLoading(true);
            const data = await api.building.getAll();
            setBuildings(data);
        } catch (error) {
            console.error('Error:', error);
            setBuildings(mockBuildings);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ buildingName: '', isActive: true });
        setShowModal(true);
    };

    const handleEdit = (item: Building) => {
        setEditingId(item.id);
        setFormData({ buildingName: item.buildingName, isActive: item.isActive });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await api.building.update(editingId, formData);
            } else {
                await api.building.create(formData);
            }
            setShowModal(false);
            fetchBuildings();
            alert(editingId ? '✅ แก้ไขเรียบร้อย' : '✅ เพิ่มเรียบร้อย');
        } catch (error) {
            alert('❌ เกิดข้อผิดพลาด');
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`ต้องการลบ "${name}" ใช่หรือไม่?`)) return;
        try {
            await api.building.delete(id);
            fetchBuildings();
            alert('✅ ลบเรียบร้อย');
        } catch (error) {
            alert('❌ ไม่สามารถลบได้');
        }
    };

    const filtered = buildings.filter(b => b.buildingName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <BuildingIcon className="h-8 w-8 text-green-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">จัดการตึก</h2>
                        <p className="text-gray-600">มีทั้งหมด {buildings.length} ตึก</p>
                    </div>
                </div>
                <button onClick={handleAdd} className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md font-semibold">
                    <Plus className="h-5 w-5 mr-2" />
                    เพิ่มตึก
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
                        placeholder="ค้นหาตึก..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-green-500"
                    />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">กำลังโหลด...</p>
                </div>
            ) : (
                <table className="w-full">
                    <thead className="bg-green-50">
                    <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">ชื่อตึก</th>
                        <th className="px-6 py-3 text-center font-semibold text-gray-700">สถานะ</th>
                        <th className="px-6 py-3 text-center font-semibold text-gray-700">จัดการ</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {filtered.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-bold text-gray-900">#{item.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{item.buildingName}</td>
                            <td className="px-6 py-4 text-center">
                                {item.isActive ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">🟢 ใช้งาน</span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">🔴 ไม่ใช้งาน</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id, item.buildingName)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">{editingId ? 'แก้ไขตึก' : 'เพิ่มตึก'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">ชื่อตึก *</label>
                                <input
                                    type="text"
                                    value={formData.buildingName}
                                    onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 rounded-lg outline-none focus:border-green-500"
                                    placeholder="เช่น อาคาร A"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">สถานะ</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formData.isActive === true}
                                            onChange={() => setFormData({ ...formData, isActive: true })}
                                            className="mr-2"
                                        />
                                        <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
                                        ใช้งาน
                                    </label>
                                    <label className="flex items-center cursor-pointer">
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
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                                ยกเลิก
                            </button>
                            <button onClick={handleSubmit} disabled={!formData.buildingName.trim()} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">
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

// ========================================
// 🏗️ FLOOR SECTION
// ========================================
function FloorSection() {
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
    const [buildings, setBuildings] = useState<Building[]>(mockBuildings);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Join building data กับ floor
    const floorsWithBuilding = floors.map(floor => ({
        ...floor,
        building: buildings.find(b => b.id === floor.buildingId)
    }));

    const filtered = floorsWithBuilding.filter(f => f.floorName.toLowerCase().includes(searchTerm.toLowerCase()));

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
                <button className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-md font-semibold">
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
                                <button className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg">
                                    <Edit className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

// ========================================
// 🚪 ROOM SECTION
// ========================================
function RoomSection() {
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

    const [rooms, setRooms] = useState<Room[]>(mockRooms);
    const [floors, setFloors] = useState<Floor[]>(mockFloors);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Join floor data กับ room
    const roomsWithFloor = rooms.map(room => ({
        ...room,
        floor: floors.find(f => f.id === room.floorId)
    }));

    const filtered = roomsWithFloor.filter(r => r.roomName.toLowerCase().includes(searchTerm.toLowerCase()));

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
                <button className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md font-semibold">
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
                                <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg">
                                    <Edit className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}