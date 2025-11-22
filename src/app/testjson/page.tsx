'use client'
import { useState } from 'react';
import { Send, CheckCircle, XCircle, Code, Database, ArrowRight } from 'lucide-react';

export default function TestJsonPage() {
    const [formData, setFormData] = useState({
        equipmentName: 'Laptop Dell XPS 15',
        brand: 'Dell',
        model: 'XPS 15 9520',
        serialNumber: 'SN123456789',
        licenseKey: 'WIN-XXXXX-YYYYY',
        equipmentStatusId: 1,
        equipmentTypeId: 2
    });

    const [sentJson, setSentJson] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const API_BASE_URL = 'http://localhost:8080';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Id') ? Number(value) : value
        }));
    };

    const handleSendJson = async () => {
        setLoading(true);
        setStatus('idle');

        // แสดง JSON ที่จะส่ง
        const jsonToSend = JSON.stringify(formData, null, 2);
        setSentJson(jsonToSend);

        try {
            // ส่ง JSON ไปหลังบ้าน
            const apiResponse = await fetch(`${API_BASE_URL}/equipment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonToSend
            });

            if (apiResponse.ok) {
                const data = await apiResponse.json();
                setResponse(JSON.stringify(data, null, 2));
                setStatus('success');
            } else {
                throw new Error(`HTTP ${apiResponse.status}`);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setResponse(`เกิดข้อผิดพลาด: ${errorMessage}\n\n(หมายเหตุ: ถ้า Backend ยังไม่พร้อม จะแสดง error นี้)`);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleTestUpdate = async () => {
        setLoading(true);
        setStatus('idle');

        const jsonToSend = JSON.stringify(formData, null, 2);
        setSentJson(jsonToSend);

        try {
            const apiResponse = await fetch(`${API_BASE_URL}/equipment/update/1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonToSend
            });

            if (apiResponse.ok) {
                const data = await apiResponse.json();
                setResponse(JSON.stringify(data, null, 2));
                setStatus('success');
            } else {
                throw new Error(`HTTP ${apiResponse.status}`);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setResponse(`เกิดข้อผิดพลาด: ${errorMessage}\n\n(หมายเหตุ: ถ้า Backend ยังไม่พร้อม จะแสดง error นี้)`);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-600">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 Test JSON Communication</h1>
                    <p className="text-gray-600">ทดสอบการส่ง JSON จาก Frontend ไป Backend</p>
                </div>

                {/* Flow Diagram */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Flow การทำงาน</h2>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                            <Code className="w-8 h-8 text-blue-600 mb-2" />
                            <h3 className="font-bold text-blue-900">Frontend</h3>
                            <p className="text-sm text-blue-700">React/Next.js</p>
                        </div>

                        <ArrowRight className="w-8 h-8 text-gray-400" />

                        <div className="flex-1 bg-green-50 p-4 rounded-lg border-2 border-green-300">
                            <Send className="w-8 h-8 text-green-600 mb-2" />
                            <h3 className="font-bold text-green-900">HTTP Request</h3>
                            <p className="text-sm text-green-700">POST/PUT + JSON</p>
                        </div>

                        <ArrowRight className="w-8 h-8 text-gray-400" />

                        <div className="flex-1 bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                            <Database className="w-8 h-8 text-purple-600 mb-2" />
                            <h3 className="font-bold text-purple-900">Backend</h3>
                            <p className="text-sm text-purple-700">Java Spring Boot</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Panel - Form Input */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">📝 ข้อมูลที่จะส่ง</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                    ชื่ออุปกรณ์
                                </label>
                                <input
                                    name="equipmentName"
                                    value={formData.equipmentName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-blue-500 text-gray-900"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">ยี่ห้อ</label>
                                    <input
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">รุ่น</label>
                                    <input
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Serial Number</label>
                                    <input
                                        name="serialNumber"
                                        value={formData.serialNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-2 rounded-lg font-mono outline-none focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">License Key</label>
                                    <input
                                        name="licenseKey"
                                        value={formData.licenseKey}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-2 rounded-lg font-mono outline-none focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Status ID</label>
                                    <select
                                        name="equipmentStatusId"
                                        value={formData.equipmentStatusId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-blue-500 text-gray-900"
                                    >
                                        <option value={1}>1 - Available</option>
                                        <option value={2}>2 - In Use</option>
                                        <option value={3}>3 - Maintenance</option>
                                        <option value={4}>4 - Damaged</option>
                                        <option value={5}>5 - Retired</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">Type ID</label>
                                    <select
                                        name="equipmentTypeId"
                                        value={formData.equipmentTypeId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-blue-500 text-gray-900"
                                    >
                                        <option value={1}>1 - Software/License</option>
                                        <option value={2}>2 - Hardware</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={handleSendJson}
                                disabled={loading}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                ส่ง POST Request (Create)
                            </button>

                            <button
                                onClick={handleTestUpdate}
                                disabled={loading}
                                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                ส่ง PUT Request (Update ID: 1)
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - JSON Display */}
                    <div className="space-y-6">
                        {/* Sent JSON */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">📤 JSON ที่ส่งไป</h2>
                                {status === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
                                {status === 'error' && <XCircle className="w-6 h-6 text-red-600" />}
                            </div>

                            {sentJson ? (
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{sentJson}
                                </pre>
                            ) : (
                                <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                                    กดปุ่มด้านซ้ายเพื่อส่ง JSON
                                </div>
                            )}
                        </div>

                        {/* Response */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">📥 Response จาก Backend</h2>

                            {response ? (
                                <pre className={`p-4 rounded-lg overflow-x-auto text-sm font-mono ${
                                    status === 'success'
                                        ? 'bg-green-900 text-green-100'
                                        : 'bg-red-900 text-red-100'
                                }`}>
{response}
                                </pre>
                            ) : (
                                <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                                    รอ Response จาก Backend...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Information Box */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">💡 คำอธิบาย</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">1.</span>
                            <span>กรอกข้อมูลในฟอร์มด้านซ้าย</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">2.</span>
                            <span>กดปุ่ม &quot;ส่ง POST Request&quot; หรือ &quot;ส่ง PUT Request&quot;</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">3.</span>
                            <span>ระบบจะแปลงข้อมูลเป็น JSON และส่งไปที่ Backend (แสดงในกล่องขวาบน)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">4.</span>
                            <span>Backend จะประมวลผลและส่ง Response กลับมา (แสดงในกล่องขวาล่าง)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold">⚠️</span>
                            <span className="font-semibold">หมายเหตุ: ถ้า Backend ยังไม่เปิด จะแสดง Error (นี่เป็นเรื่องปกติ)</span>
                        </li>
                    </ul>
                </div>

                {/* API Endpoints Info */}
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 API Endpoints</h3>
                    <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">POST</span>
                                <code className="text-sm font-mono text-gray-900">{API_BASE_URL}/equipment/create</code>
                            </div>
                            <p className="text-sm text-gray-700">สร้างอุปกรณ์ใหม่</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">PUT</span>
                                <code className="text-sm font-mono text-gray-900">{API_BASE_URL}/equipment/update/1</code>
                            </div>
                            <p className="text-sm text-gray-700">อัปเดตอุปกรณ์ ID: 1</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded">GET</span>
                                <code className="text-sm font-mono text-gray-900">{API_BASE_URL}/equipment/all</code>
                            </div>
                            <p className="text-sm text-gray-700">ดึงข้อมูลอุปกรณ์ทั้งหมด (ไม่ต้องส่ง JSON)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}