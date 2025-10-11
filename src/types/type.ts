// types/type.ts

/** ตารางเก็บข้อมูลอุปกรณ์ */
export interface Equipment {
    id: number; // Equipment ID
    equipment_code?: string; // รหัสอุปกรณ์
    equipment_name: string; // ชื่ออุปกรณ์
    equipment_type_id?: number; // ประเภทอุปกรณ์ (FK)
    serial_number?: string; // Serial number
    brand?: string; // ยี่ห้อ
    model?: string; // รุ่น
    status?: string; // สถานะ เช่น 'available', 'borrowed', 'repair'
    location?: string; // ที่อยู่หรือห้องที่เก็บ
    purchase_date?: string; // วันที่ซื้อ (YYYY-MM-DD)
}

/** ตารางการยืมอุปกรณ์ */
export interface Borrow {
    id: number; // Borrow ID
    borrow_date: string; // วันที่ยืม (YYYY-MM-DD)
    reference_doc?: string; // เอกสารอ้างอิง
    employee_id: number; // ผู้ยืม (FK -> employee)
    borrow_equipment_id?: number; // FK -> borrow_equipment
}

/** ตารางพนักงาน */
export interface Employee {
    id: number; // Employee ID
    employee_code?: string; // รหัสพนักงาน
    name: string; // ชื่อพนักงาน
    department?: string; // แผนก
    position?: string; // ตำแหน่ง
    email?: string; // อีเมล
    phone?: string; // เบอร์โทร
}

/** ตารางเชื่อมความสัมพันธ์ระหว่าง Borrow กับ Equipment */
export interface BorrowEquipment {
    id: number; // Borrow Equipment ID
    borrow_id: number; // FK -> borrow
    equipment_id: number; // FK -> equipment
    borrow_status_id?: number; // สถานะ เช่น ยืม, คืนแล้ว
    return_date?: string; // วันที่คืน (YYYY-MM-DD)
}

/** ตารางประเภทอุปกรณ์ */
export interface EquipmentType {
    id: number; // Equipment Type ID
    type_name: string; // ชื่อประเภท เช่น 'คอมพิวเตอร์', 'โปรเจคเตอร์'
    description?: string; // รายละเอียดประเภท
}

/** ตารางสถานะการยืม */
export interface BorrowStatus {
    id: number; // Status ID
    status_name: string; // เช่น 'กำลังยืม', 'คืนแล้ว', 'เกินกำหนด'
}