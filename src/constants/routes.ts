export const ROUTES = {
    // Public Routes
    HOME_LANDING: '/',
    LOGIN: '/login',
    REGISTER: '/register',

    // Protected Routes
    HOME: '/pages/home',
    ADD_EQUIPMENT: '/pages/add_equipment',
    BORROW_EQUIPMENT: '/pages/borrow_equipment',
    BORROW_HISTORY: '/pages/borrow_history',
    EQUIPMENT: '/pages/equipment',
    OLD_BORROW: '/pages/borrow_equipment/old_borrow',
    NEW_BORROW: '/pages/borrow_equipment/new_borrow',
    BORROW: '/pages/borrow_equipment/borrow',
    SETTINGS_MASTER_DATA: '/setting/master-data',
    LOCATION_MANAGEMENT: '/pages/location_management',
    USER_MANAGEMENT: '/pages/user-management',

} as const;

// Type safety
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];

// Navigation Items สำหรับใช้ใน Navbar
export const NAV_ITEMS = [
    {
        label: 'หน้าแรก',
        path: ROUTES.HOME,
        icon: 'Home',
    },
    {
        label: 'อุปกรณ์',
        path: ROUTES.EQUIPMENT,
        icon: 'Laptop',
    },
    {
        label: 'เพิ่มอุปกรณ์',
        path: ROUTES.ADD_EQUIPMENT,
        icon: 'PlusCircle',
    },
    {
        label: 'การยืมอุปกรณ์',
        path: ROUTES.BORROW_EQUIPMENT,
        icon: 'Package', // 📦 ใช้ Package สำหรับการยืม
    },
    {
        label: 'ประวัติการยืม',
        path: ROUTES.BORROW_HISTORY,
        icon: 'History',
    },
    {
        label: 'จัดการสถานที่',
        path: ROUTES.LOCATION_MANAGEMENT,
        icon: 'Settings',
    },

] as const;
//ใช้ประกาศตัวแปรสำหรับแต่ละ Path และเอาไปเรียกใช้ในหน้านั้นๆ เช่นตอนนี้เอาไปใช้ในหน้า Navbar