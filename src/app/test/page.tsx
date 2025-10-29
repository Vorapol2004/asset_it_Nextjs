'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Equipment } from '@/types/type';

export default function TestPage() {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // เรียกใช้ api.equipment.getAll()
                const data = await api.equipment.getAll();
                setEquipments(data);
                console.log('✅ ดึงข้อมูลสำเร็จ:', data);
            } catch (err: any) {
                setError(err.message);
                console.error('❌ เกิดข้อผิดพลาด:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-lg">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600 mb-4">❌ เกิดข้อผิดพลาด</h1>
                <p className="text-red-500">{error}</p>
                <p className="mt-4 text-gray-600">
                    ตรวจสอบ:
                    <br />- Backend รันอยู่ที่ http://localhost:8080 หรือไม่?
                    <br />- CORS Config ถูกต้องหรือไม่?
                </p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">🎉 ทดสอบการเชื่อมต่อ API สำเร็จ!</h1>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-semibold">
                    ✅ เชื่อมต่อ Backend สำเร็จ!
                </p>
                <p className="text-green-700">
                    จำนวนอุปกรณ์: {equipments.length} รายการ
                </p>
            </div>

            {equipments.length > 0 ? (
                <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่ออุปกรณ์</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {equipments.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.equipmentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.equipmentStatusId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-500">ไม่มีข้อมูลในฐานข้อมูล</p>
                </div>
            )}

            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-mono">
                    API URL: http://localhost:8080/equipment/all
                </p>
            </div>
        </div>
    );
}