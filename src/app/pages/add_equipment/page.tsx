'use client';

import { useState } from 'react';
import { Save, ArrowLeft, Package, Camera, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from "@/component/Navbar/Navbar";
import Footer from "@/component/Footer/Footer";
import {text} from "node:stream/consumers";

export default function AddEquipmentPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        serialNumber: '',
        description: '',
        condition: 'ดีมาก',
        location: '',
        price: '',
        purchaseDate: '',
        brand: '',
        model: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        location: false,
        serialNumber: undefined,
        category: undefined,
        name: undefined
    });

    const categories = [
        'Computer',
        'Notebook',
        'Ipad',
        'Monitor',
        'mouse',
        'Barcode Scanner',
        'อื่นๆ'
    ];


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        // @ts-ignore
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            name: undefined,
            category: undefined,
            serialNumber: undefined,
            location: undefined
        };

        if (!formData.name.trim()) {
            // @ts-ignore
            newErrors.name = 'กรุณาระบุชื่ออุปกรณ์';
        }
        if (!formData.category) {
            // @ts-ignore
            newErrors.category = 'กรุณาเลือกหมวดหมู่';
        }
        if (!formData.serialNumber.trim()) {
            // @ts-ignore
            newErrors.serialNumber = 'กรุณาระบุรหัสอุปกรณ์';
        }
        if (!formData.location.trim()) {
            // @ts-ignore
            newErrors.location = 'กรุณาระบุตำแหน่งที่เก็บ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Here you would typically send data to your API
        console.log('Equipment data:', formData);

        setIsSubmitting(false);

        // Show success message and redirect
        alert('เพิ่มอุปกรณ์เรียบร้อยแล้ว!');
        router.push('/');
    };

    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <button
                            onClick={handleGoBack}
                            className="mr-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <ArrowLeft className="h-6 w-6 text-white" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">เพิ่มอุปกรณ์ใหม่</h1>
                            <p className="text-purple-100 mt-2">เพิ่มอุปกรณ์เข้าสู่ระบบการจัดการ</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Package className="h-5 w-5 mr-2 text-blue-600" />
                                ข้อมูลพื้นฐาน
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Equipment Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ชื่อ-อุปกรณ์ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg placeholder:text-gray-400 text-black ${
                                            errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="เช่น เครื่องคอมพิวเตอร์ Dell OptiPlex"

                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        หมวดหมู่ <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-gray-400 ${
                                            errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">เลือกหมวดหมู่</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Serial Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        รหัสอุปกรณ์ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="serialNumber"
                                        value={formData.serialNumber}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg placeholder:text-gray-400 text-black ${
                                            errors.serialNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="เช่น EQP-001"
                                    />
                                    {errors.serialNumber && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.serialNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Brand */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ยี่ห้อ
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder:text-gray-400 text-black "
                                        placeholder="เช่น Dell, HP, Canon"
                                    />
                                </div>

                                {/* Model */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        รุ่น
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder:text-gray-400 text-black "
                                        placeholder="เช่น OptiPlex 3080"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">ข้อมูลเพิ่มเติม</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ตำแหน่งที่เก็บ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg placeholder:text-gray-400 text-black  ${
                                            errors.location ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="เช่น ห้องคอมพิวเตอร์ ชั้น 2"
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.location}
                                        </p>
                                    )}
                                </div>

                                {/* Purchase Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        วันที่ซื้อ
                                    </label>
                                    <input
                                        type="date"
                                        name="purchaseDate"
                                        value={formData.purchaseDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    รายละเอียด
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder:text-gray-400 text-black  "
                                    placeholder="ระบุรายละเอียดเพิ่มเติม เช่น คุณสมบัติพิเศษ หมายเหตุต่างๆ"
                                />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <Save className="h-5 w-5 mr-2" />
                                )}
                                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกอุปกรณ์'}
                            </button>

                            <button
                                type="button"
                                onClick={handleGoBack}
                                className="flex-1 sm:flex-none bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </form>
                </div>
            </div>


        </div>
    );
}