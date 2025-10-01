import RegisterForm from '@/component/auth/RegisterForm';

/**
 * หน้า Register
 *
 * หน้าที่:
 * - แสดง RegisterForm component
 * - ให้ background สีเทา
 * - จัด layout ให้สวยงาม
 */
export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <RegisterForm />
        </div>
    );
}
//แสดงหน้า Register
// Import และใช้ RegisterForm component