'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Lot } from '@/types/type'; // 🔥 เปลี่ยนจาก LotType เป็น Lot

export function useLot() {
    const [lots, setLots] = useState<Lot[]>([]); // 🔥 เปลี่ยน type
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLots = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔄 Fetching lots...');
            const data = await api.lot.getAll();
            console.log('✅ Lots fetched:', data);
            setLots(data);
        } catch (err) {
            console.error('❌ โหลด LOT ไม่สำเร็จ:', err);
            setError('ไม่สามารถโหลด LOT ได้');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLots();
    }, []);

    return { lots, loading, error, fetchLots };
}