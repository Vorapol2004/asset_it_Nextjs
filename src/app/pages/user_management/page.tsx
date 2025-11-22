'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/Navbar/Navbar';
import { Users, Plus, Edit, Trash2, RefreshCw, AlertCircle, Shield, Home, ChevronUp } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserModal } from './UserModal';
import { ROUTES } from '@/constants/routes';
import RouteProtection from '@/component/auth/RouteProtection';
import type { CreateUserInput, UpdateUserInput } from '@/lib/api/user/user';

export default function UserManagementPage() {
    const router = useRouter();
    const {
        users,
        loading,
        error,
        showModal,
        editingUser,
        isCreating,
        loadingAction,
        errorAction,
        fetchUsers,
        openCreateModal,
        openEditModal,
        closeModal,
        createUser,
        updateUser,
        deleteUser,
        setError,
        setErrorAction,
    } = useUserManagement();

    const [showScrollTop, setShowScrollTop] = useState(false);

    // Scroll to Top 
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSubmit = async (data: CreateUserInput | UpdateUserInput) => {
        if (isCreating) {
            // Type guard: ensure data is CreateUserInput with required fields
            if (typeof data.email === 'string' && typeof data.password === 'string' && data.email && data.password) {
                const createData: CreateUserInput = {
                    email: data.email,
                    password: data.password,
                    role: data.role,
                };
                await createUser(createData);
            } else {
                throw new Error('Email and password are required for creating a user');
            }
        } else if (editingUser) {
            await updateUser(editingUser.id, data as UpdateUserInput);
        }
    };

    return (
        <RouteProtection allowedRoles="ROLE_ADMIN">
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">จัดการ Users</h1>
                            <p className="text-gray-600 text-sm">เพิ่ม แก้ไข หรือลบ users</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push(ROUTES.HOME)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Home className="h-5 w-5" />
                            ไปยังหน้าหลัก
                        </button>
                        <button
                            onClick={fetchUsers}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                            รีเฟรช
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="h-5 w-5" />
                            สร้าง User ใหม่
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-red-700 font-semibold">เกิดข้อผิดพลาด</p>
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Action Error Message */}
                {errorAction && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-red-700 font-semibold">เกิดข้อผิดพลาด</p>
                            <p className="text-red-600 text-sm">{errorAction}</p>
                        </div>
                        <button
                            onClick={() => setErrorAction(null)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">ยังไม่มี users</p>
                            <button
                                onClick={openCreateModal}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="h-5 w-5" />
                                สร้าง User แรก
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase">Email</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase">Role</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className={`hover:bg-blue-50 transition-colors ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900">#{user.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900">{user.email}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {(() => {
                                                    const isAdmin = user.role === 'ROLE_ADMIN';
                                                    return (
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                                isAdmin
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            <Shield className="h-3 w-3" />
                                                            {isAdmin ? 'Admin' : 'User'}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        disabled={loadingAction}
                                                        className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        แก้ไข
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(user.id)}
                                                        disabled={loadingAction}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        ลบ
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* User Modal */}
            <UserModal
                isOpen={showModal}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editingUser={editingUser}
                loading={loadingAction}
                error={errorAction}
            />

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 flex items-center justify-center group cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-6 w-6 group-hover:animate-bounce" />
                </button>
            )}
        </div>
        </RouteProtection>
    );
}

