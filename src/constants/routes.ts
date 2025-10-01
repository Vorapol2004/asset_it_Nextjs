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
        label: 'การยืมอุปกรณ์',
        path: ROUTES.BORROW_EQUIPMENT,
        icon: 'Package',
    },
    {
        label: 'เพิ่มอุปกรณ์',
        path: ROUTES.ADD_EQUIPMENT,
        icon: 'PlusCircle',
    },
    {
        label: 'ประวัติการยืม',
        path: ROUTES.BORROW_HISTORY,
        icon: 'History',
    },
] as const;

//ใช้ประกาศตัวแปรสำหรับแต่ละ Path และเอาไปเรียกใช้ในหน้านั้นๆ เช่นตอนนี้เอาไปใช้ในหน้า Navbar