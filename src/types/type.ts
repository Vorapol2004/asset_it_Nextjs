// EQUIPMENT TYPES

export interface Equipment {
    id: number;
    equipmentName: string;
    brand: string | null;
    model: string | null;
    serialNumber: string | null;
    licenseKey: string | null;
    equipmentStatusId: number;
    equipmentTypeId: number;
    lotId: number;
    createdAt: string;
    updatedAt: string;
}

export interface EquipmentView extends Equipment {
    lotTypeName: string;
    purchaseDate: string;
    referenceDoc: string;
    expireDate: string;
    description: string;
    academicYear?: string;
    equipmentStatusName?: string;
    equipmentTypeName?: string;
    lotName?: string;
}

export interface EquipmentStatus {
    id: number;
    equipmentStatusName: string;
}

export interface EquipmentType {
    id: number;
    equipmentTypeName: string;
}

export interface EquipmentCreateData {
    equipmentName: string;
    brand?: string | null;
    model?: string | null;
    serialNumber?: string | null;
    licenseKey?: string | null;
    equipmentStatusId: number;
    equipmentTypeId: number;
    description?: string | null;
}


// LOT TYPES


export interface Lot {
    id: number;
    lotName: string;
    academicYear: string | null;
    referenceDoc: string | null;
    description: string | null;
    purchaseDate: string | null;
    expireDate: string | null;
    lotTypeId: number;
}

export interface LotType {
    id: number;
    lotName: string;
}

export interface EquipmentRequest {
    equipmentName: string;
    brand?: string | null;
    model?: string | null;
    serialNumber?: string | null;
    licenseKey?: string | null;
    equipmentTypeId: number;
    equipmentStatusId: number;
}

export interface LotRequest {
    lotName: string;
    academicYear?: string | null;
    referenceDoc?: string | null;
    description?: string | null;
    purchaseDate: string; // LocalDate -> string ใน JSON
    expireDate?: string | null;
    lotTypeId: number;
    equipmentList: EquipmentRequest[];
}


export interface LotCreateData {
    lotName: string;
    academicYear?: string | null;
    purchaseDate: string;
    expireDate?: string | null;
    referenceDoc?: string | null;
    description?: string | null;
    lotTypeId: number;
    items: EquipmentCreateData[];
}

export interface LotCreateResponse {
    success: boolean;
    message: string;
    data: {
        lotId: number;
        equipmentCreated: number;
        equipmentIds: number[];
    };
}

export interface LotType {
    id: number;
    lotTypeName: string; // ✅ เปลี่ยนจาก lotName เป็น lotTypeName
}

// BORROW TYPES

export interface Borrow {
    id: number;
    employeeId: number;
    borrowDate: string;
    referenceDoc: string | null;
    borrowEquipmentId: number | null;
}

export interface BorrowEquipment {
    id: number;
    returnDate: string | null;
    borrowStatusId: number;
    equipmentId: number;
    borrowId: number;
    dueDate: string | null;
}

export interface BorrowStatus {
    id: number;
    borrowStatusName: string;
}

export interface ReturnResponseData {
    borrowId: number;
    returnedItems: number;
}

export interface BorrowView {
    id: number;
    borrowDate: string;
    borrowStatusId: number | null;
    borrowStatusName?: string | null;
    referenceDoc?: string | null;
    approverName?: string | null;
    borrowEquipmentCount?: number | null;
    employee?: {
        id: number;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        roleName?: string;
        departmentName?: string;
    };
    equipments?: Array<{
        id: number;
        borrowEquipmentId: number;
        equipmentName: string;
        serialNumber?: string | null;
        licenseKey?: string | null;
        brand?: string;
        model?: string;
        equipmentTypeName?: string;
        dueDate?: string | null;
        returnDate?: string | null;
    }>;
}

export interface BorrowEquipmentView {
    equipmentName: string;
    borrowEquipmentId: number;
    equipmentId: number;
    brand?: string;
    model?: string;
    serialNumber?: string;
    licenseKey?: string;
    equipmentTypeName?: string;
    dueDate?: string;
    returnDate?: string | null;
}

export interface BorrowCreateData {
    employeeId: number;
    referenceDoc?: string | null;
    borrowDate: string;
    dueDate: string;
    equipmentIds: number[];
    approverName?: string | null;
}

// Interface เดิม (อาจใช้ในที่อื่น)
export interface BorrowCreateDataOld {
    borrowerFirstName: string;
    borrowerLastName: string;
    borrowerEmail?: string | null;
    borrowerPhone?: string | null;
    borrowDate: string;
    dueDate: string;
    referenceDoc?: string | null;
    items: BorrowItemData[];
}

export interface BorrowItemData {
    equipmentId: number;
    serialNumber?: string;
    licenseKey?: string;
    notes?: string;
}

export interface BorrowCreateResponse {
    success: boolean;
    message: string;
    data: {
        borrowId: number;
        itemsCreated: number;
    };
}

export interface ReturnItemData {
    borrowEquipmentId: number;
    returnDate: string;
}

// EMPLOYEE TYPES

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    description: string | null;
    roleId: number | null;
    departmentId: number;
}

export interface EmployeeView extends Employee {
    roleName?: string;
    departmentName?: string;
    buildingName?: string;
    floorName?: string;
    roomName?: string;
    employeeId?: number;
}

export interface Role {
    id: number;
    roleName: string;
}

export interface Department {
    isActive: boolean;
    id: number;
    departmentName: string;
    createdAt?: string;
    updatedAt?: string;
    description: string;
}

export interface Building {
    id: number;
    buildingName: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Floor {
    id: number;
    floorName: string;
    buildingId: number;
    building?: Building;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Room {
    id: number;
    roomName: string;
    floorId: number;
    floor?: Floor;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Building (ตึก)
export interface Building {
    id: number;
    buildingName: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Floor (ชั้น) - มี buildingId
export interface Floor {
    id: number;
    floorName: string;
    buildingId: number;      // เชื่อมกับ Building
    building?: Building;     // ข้อมูล Building
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Room (ห้อง) - มี floorId
export interface Room {
    id: number;
    roomName: string;
    floorId: number;         // เชื่อมกับ Floor
    floor?: Floor;           // ข้อมูล Floor
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// LOCATION TYPES

export interface Building {
    id: number;
    buildingName: string;
}

export interface Floor {
    id: number;
    floorName: string;
    buildingId: number;
}

export interface Room {
    id: number;
    roomName: string;
    floorId: number;
    departmentId: number;
}

export interface LocationView {
    buildingId: number;
    buildingName: string;
    floorId: number;
    floorName: string;
    roomId: number;
    roomName: string;
    departmentId: number;
    departmentName: string;
}

// STATS TYPES

export interface DashboardStats {
    totalEquipment: number;
    availableEquipment: number;
    borrowedEquipment: number;
    todayBorrows: number;
    overdueItems: number;
    equipmentByType: {
        software: number;
        hardware: number;
        other: number;
    };
    equipmentByStatus: {
        available: number;
        borrowed: number;
        damaged: number;
        lost: number;
    };
}

export interface BorrowStats {
    totalBorrows: number;
    activeBorrows: number;
    returnedBorrows: number;
    overdueBorrows: number;
    partialReturns: number;
    borrowsByMonth: {
        month: string;
        count: number;
    }[];
    topBorrowers: {
        employeeId: number;
        employeeName: string;
        borrowCount: number;
    }[];
}

// API RESPONSE TYPES

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}


// FORM DATA TYPES
export interface EquipmentFormData {
    equipmentName: string;
    brand: string;
    model: string;
    serialNumber: string;
    licenseKey: string;
    equipmentStatusId: number;
    equipmentTypeId: number;
}

export interface BorrowFormData {
    borrowerName: string;
    borrowerEmail: string;
    borrowerPhone: string;
    building: string;
    floor: string;
    room: string;
    approvedBy: string;
    borrowDate: string;
    returnDate: string;
    purpose: string;
}


// FILTER TYPES
export interface EquipmentFilters {
    searchTerm?: string;
    statusId?: number | 'all';
    typeId?: number | 'all';
    lotId?: number | 'all';
}

export interface BorrowFilters {
    searchTerm?: string;
    statusId?: number | null;
    equipmentType?: 'all' | 'hardware' | 'software';
    dateFrom?: string;
    dateTo?: string;
    employeeId?: number;
}

export interface ApiError {
    status: number;
    message: string;
    details?: string;
}


// UTILITY TYPES
export type EquipmentStatusType = 'available' | 'borrowed' | 'damaged' | 'lost';
export type EquipmentTypeType = 'software' | 'hardware' | 'other';
export type BorrowStatusType = 'borrowed' | 'returned' | 'partial_return' | 'overdue';
export type LotTypeType = 'Purchase' | 'Rent' | 'Borrow' | 'Trial';

// CONSTANTS
export const EQUIPMENT_STATUS = {
    AVAILABLE: 1,
    BORROWED: 2,
    DAMAGED: 3,
    LOST: 4
} as const;

export const EQUIPMENT_TYPE = {
    SOFTWARE: 1,
    HARDWARE: 2,
    OTHER: 3
} as const;

export const BORROW_STATUS = {
    BORROWED: 1,
    RETURNED: 2,
    PARTIAL_RETURN: 3,
    OVERDUE: 4
} as const;

export const LOT_TYPE = {
    PURCHASE: 1,
    RENT: 2,
    BORROW: 3,
    TRIAL: 4
} as const;