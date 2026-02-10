'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Allow public pages (like login)
        if (pathname === '/login') {
            setAuthorized(true);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }, [pathname, router]);

    // Simple loading or protected content
    if (!authorized && pathname !== '/login') {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Checking access...</div>;
    }

    return <>{children}</>;
}
