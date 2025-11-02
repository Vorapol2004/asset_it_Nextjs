import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { BorrowView } from '@/types/type';
import { ROUTES } from '@/constants/routes';

export interface PreviousBorrower {
    id: number;
    borrowerFirstName: string;
    borrowerLastName: string;
    borrowerEmail: string;
    borrowerPhone: string;
    borrowerRole: string;
    buildingId: number;
    buildingName: string;
    roomId: number;
    roomName: string;
    departmentId: number;
    departmentName: string;
    approverName: string;
    lastBorrowDate: string;
    borrowCount: number;
}

export function useOldBorrow() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [borrowers, setBorrowers] = useState<PreviousBorrower[]>([]);
    const [filteredBorrowers, setFilteredBorrowers] = useState<PreviousBorrower[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPreviousBorrowers();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredBorrowers(borrowers);
        } else {
            // Use local filter for instant results
            const filtered = borrowers.filter(b =>
                b.borrowerFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.borrowerLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.borrowerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.borrowerPhone.includes(searchTerm)
            );
            setFilteredBorrowers(filtered);
        }
    }, [searchTerm, borrowers]);


    /**
     * ดึงรายการผู้ยืมเก่า
     * TODO: เมื่อ backend มี endpoint /borrow/borrowers หรือ /borrow/distinct-borrowers
     * ให้เรียก endpoint นั้นแทน และลบ logic processing ออก
     * 
     * ปัจจุบันต้อง process ใน frontend เพราะ:
     * - Backend ยังไม่มี endpoint สำหรับ distinct borrowers
     * - ต้อง group ตาม firstName + lastName + email
     * - ต้องนับจำนวนครั้งที่ยืม
     */
    const fetchPreviousBorrowers = async () => {
        setLoading(true);
        try {
            const data = await api.borrow.getPreviousBorrowers();
            
            // TODO: Logic นี้ควรย้ายไป backend
            // Process BorrowView[] to get unique borrowers with their latest borrow info
            const borrowerMap = new Map<string, {
                borrow: BorrowView;
                count: number;
            }>();

            data.forEach(borrow => {
                const key = `${borrow.firstName}_${borrow.lastName}_${borrow.email}`;
                
                if (!borrowerMap.has(key)) {
                    borrowerMap.set(key, { borrow, count: 1 });
                } else {
                    const existing = borrowerMap.get(key)!;
                    existing.count++;
                    // Keep the most recent borrow
                    if (new Date(borrow.borrowDate) > new Date(existing.borrow.borrowDate)) {
                        existing.borrow = borrow;
                    }
                }
            });

            const processedBorrowers: PreviousBorrower[] = Array.from(borrowerMap.values()).map(({ borrow, count }, index) => {
                // TODO: เมื่อ backend endpoint พร้อม (มีข้อมูลครบ)
                // ให้ map ข้อมูลจาก response ที่มี field ครบถ้วน:
                // - borrowerPhone จาก borrow.phone หรือ borrow.borrowerPhone
                // - buildingId, buildingName จาก borrow.buildingId, borrow.buildingName
                // - roomId, roomName จาก borrow.roomId, borrow.roomName
                // - departmentId, departmentName จาก borrow.departmentId, borrow.departmentName
                // - approverName จาก borrow.approverName หรือ borrow.approverName
                
                console.log('📋 Processing borrow data:', borrow);
                console.log('⚠️ ข้อมูลที่ขาดหายไป: phone, building, room, department, approverName');
                
                return {
                    id: borrow.id || index,
                    borrowerFirstName: borrow.firstName || '',
                    borrowerLastName: borrow.lastName || '',
                    borrowerEmail: borrow.email || '',
                    // TODO: เมื่อ backend พร้อม ให้เปลี่ยนเป็น: borrowerPhone: borrow.phone || borrow.borrowerPhone || '',
                    borrowerPhone: '', 
                    borrowerRole: borrow.roleName || 'พนักงาน',
                    // TODO: เมื่อ backend พร้อม ให้ map จาก borrow.buildingId, borrow.buildingName
                    buildingId: 0,
                    buildingName: '',
                    // TODO: เมื่อ backend พร้อม ให้ map จาก borrow.roomId, borrow.roomName
                    roomId: 0,
                    roomName: '',
                    // TODO: เมื่อ backend พร้อม ให้ map จาก borrow.departmentId, borrow.departmentName
                    departmentId: 0,
                    departmentName: '',
                    // TODO: เมื่อ backend พร้อม ให้ map จาก borrow.approverName
                    approverName: '',
                    lastBorrowDate: borrow.borrowDate || new Date().toISOString(),
                    borrowCount: count
                };
            });

            setBorrowers(processedBorrowers);
            setFilteredBorrowers(processedBorrowers);
        } catch (error) {
            console.error('Error fetching previous borrowers:', error);
            // Fallback to empty array on error
            setBorrowers([]);
            setFilteredBorrowers([]);
        } finally {
            setLoading(false);
        }
    };


    const handleSelectBorrower = (borrower: PreviousBorrower) => {
        // ส่งข้อมูลไปหน้า new_borrow รวมข้อมูลสถานที่
        const selectedData = {
            borrowerFirstName: borrower.borrowerFirstName || '',
            borrowerLastName: borrower.borrowerLastName || '',
            borrowerEmail: borrower.borrowerEmail || '',
            borrowerPhone: borrower.borrowerPhone || '',
            borrowerRole: borrower.borrowerRole || '',
            buildingId: borrower.buildingId || 0,
            buildingName: borrower.buildingName || '',
            roomId: borrower.roomId || 0,
            roomName: borrower.roomName || '',
            departmentId: borrower.departmentId || 0,
            departmentName: borrower.departmentName || '',
            approverName: borrower.approverName || '',
        };

        console.log('📤 Sending borrower data to new_borrow:', selectedData);
        sessionStorage.setItem('selectedBorrower', JSON.stringify(selectedData));
        router.push(ROUTES.NEW_EQUIPMENT);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return {
        searchTerm,
        borrowers,
        filteredBorrowers,
        loading,
        setSearchTerm,
        handleSelectBorrower,
        formatDate,
    };
}

