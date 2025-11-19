'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { UserWithoutPassword, CreateUserInput, UpdateUserInput } from '@/lib/api/user/user';

interface UseUserManagementReturn {
    users: UserWithoutPassword[];
    loading: boolean;
    error: string | null;
    showModal: boolean;
    editingUser: UserWithoutPassword | null;
    isCreating: boolean;
    loadingAction: boolean;
    errorAction: string | null;
    fetchUsers: () => Promise<void>;
    openCreateModal: () => void;
    openEditModal: (user: UserWithoutPassword) => void;
    closeModal: () => void;
    createUser: (data: CreateUserInput) => Promise<void>;
    updateUser: (id: number, data: UpdateUserInput) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    setError: (error: string | null) => void;
    setErrorAction: (error: string | null) => void;
}

/**
 * useUserManagement Hook - Hook สำหรับจัดการ Users (สำหรับ Admin)
 * 
 * หน้าที่:
 * - ดึงรายการ users
 * - สร้าง user ใหม่
 * - แก้ไข user
 * - ลบ user
 */
export function useUserManagement(): UseUserManagementReturn {
    const [users, setUsers] = useState<UserWithoutPassword[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserWithoutPassword | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [errorAction, setErrorAction] = useState<string | null>(null);

    const isCreating = !editingUser;

    /**
     * ดึงรายการ users ทั้งหมด
     */
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.user.getAllUsers();
            if (response.success && response.users) {
                setUsers(response.users);
            } else {
                setError(response.message || 'Failed to fetch users');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * เปิด modal สำหรับสร้าง user ใหม่
     */
    const openCreateModal = useCallback(() => {
        setEditingUser(null);
        setErrorAction(null);
        setShowModal(true);
    }, []);

    /**
     * เปิด modal สำหรับแก้ไข user
     */
    const openEditModal = useCallback((user: UserWithoutPassword) => {
        setEditingUser(user);
        setErrorAction(null);
        setShowModal(true);
    }, []);

    /**
     * ปิด modal
     */
    const closeModal = useCallback(() => {
        setShowModal(false);
        setEditingUser(null);
        setErrorAction(null);
    }, []);

    /**
     * สร้าง user ใหม่
     */
    const createUser = useCallback(async (data: CreateUserInput) => {
        setLoadingAction(true);
        setErrorAction(null);
        try {
            const response = await api.user.createUser(data);
            if (response.success) {
                await fetchUsers();
                closeModal();
            } else {
                setErrorAction(response.message || 'Failed to create user');
            }
        } catch (err) {
            setErrorAction(err instanceof Error ? err.message : 'Failed to create user');
        } finally {
            setLoadingAction(false);
        }
    }, [fetchUsers, closeModal]);

    /**
     * แก้ไข user
     */
    const updateUser = useCallback(async (id: number, data: UpdateUserInput) => {
        setLoadingAction(true);
        setErrorAction(null);
        try {
            const response = await api.user.updateUser(id, data);
            if (response.success) {
                await fetchUsers();
                closeModal();
            } else {
                setErrorAction(response.message || 'Failed to update user');
            }
        } catch (err) {
            setErrorAction(err instanceof Error ? err.message : 'Failed to update user');
        } finally {
            setLoadingAction(false);
        }
    }, [fetchUsers, closeModal]);

    /**
     * ลบ user
     */
    const deleteUser = useCallback(async (id: number) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบ user นี้?')) {
            return;
        }

        setLoadingAction(true);
        setErrorAction(null);
        try {
            const response = await api.user.deleteUser(id);
            if (response.success) {
                await fetchUsers();
            } else {
                setErrorAction(response.message || 'Failed to delete user');
            }
        } catch (err) {
            setErrorAction(err instanceof Error ? err.message : 'Failed to delete user');
        } finally {
            setLoadingAction(false);
        }
    }, [fetchUsers]);

    // ดึงข้อมูล users เมื่อ component mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
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
    };
}

