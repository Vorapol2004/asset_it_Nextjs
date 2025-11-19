'use client';

import { useState, useEffect, FormEvent } from 'react';
import { X, Mail, Lock, Shield, AlertCircle, User, Eye, EyeOff } from 'lucide-react';
import type { UserWithoutPassword, CreateUserInput, UpdateUserInput } from '@/lib/api/user/user';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
    editingUser: UserWithoutPassword | null;
    loading: boolean;
    error: string | null;
}

export function UserModal({
    isOpen,
    onClose,
    onSubmit,
    editingUser,
    loading,
    error,
}: UserModalProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'ROLE_USER' as string, // ใช้ ROLE_USER โดยตรง
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isCreating = !editingUser;

    // Reset form when modal opens/closes or editingUser changes
    useEffect(() => {
        if (isOpen) {
            if (editingUser) {
                // ใช้ role จาก backend โดยตรง (ROLE_ADMIN หรือ ROLE_USER)
                setFormData({
                    email: editingUser.email,
                    password: '',
                    confirmPassword: '',
                    role: editingUser.role,
                });
            } else {
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'ROLE_USER',
                });
            }
        }
    }, [isOpen, editingUser]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!formData.email.trim()) {
            return;
        }

        if (isCreating) {
            if (!formData.password) {
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                return;
            }
        } else {
            // ถ้าแก้ไขและมี password ใหม่ ต้อง confirm
            if (formData.password && formData.password !== formData.confirmPassword) {
                return;
            }
        }

        const submitData: CreateUserInput | UpdateUserInput = {
            email: formData.email,
            role: formData.role,
        };

        if (isCreating) {
            (submitData as CreateUserInput).password = formData.password;
        } else if (formData.password) {
            (submitData as UpdateUserInput).password = formData.password;
        }

        await onSubmit(submitData);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 backdrop-blur-sm bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isCreating ? 'สร้าง User ใหม่' : 'แก้ไข User'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                                required
                                placeholder="Enter email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Password {isCreating && <span className="text-red-500">*</span>}
                            {!isCreating && <span className="text-gray-500 text-xs">(เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)</span>}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                                required={isCreating}
                                placeholder={isCreating ? "Enter password" : "Enter new password (optional)"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    {(isCreating || formData.password) && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password {isCreating && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-600"
                                    required={isCreating || !!formData.password}
                                    placeholder="Confirm password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {formData.password && formData.password !== formData.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                            )}
                        </div>
                    )}

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Shield className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                required
                            >
                                <option value="ROLE_USER">User</option>
                                <option value="ROLE_ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !!(formData.password && formData.password !== formData.confirmPassword)}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'กำลังบันทึก...' : isCreating ? 'สร้าง' : 'บันทึก'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

