'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ScrollToTop from '@/components/ScrollToTop';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <Sidebar />
            <ScrollToTop />
            <main className="pt-16 min-h-screen bg-gray-900">
                {children}
            </main>
        </>
    );
}
