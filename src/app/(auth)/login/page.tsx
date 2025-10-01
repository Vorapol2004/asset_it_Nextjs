import LoginForm from '@/component/auth/LoginForm';

/**
 * หน้า Login
 *
 * หน้าที่:
 * - แสดง LoginForm component
 * - ให้ background สีเทา
 * - จัด layout ให้สวยงาม
 */
export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <LoginForm />
        </div>
    );
}

//หน้าที่
// แสดงหน้า Login
// Import และใช้ LoginForm component