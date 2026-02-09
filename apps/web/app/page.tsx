'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }
                const res = await api.get('/auth/me');
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user', err);
                localStorage.removeItem('token');
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!user) return null;

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-4xl font-bold mb-8">Tesland Dashboard</h1>

            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name || user.email}!</h2>
                <p className="text-gray-600 mb-2">Email: {user.email}</p>
                <p className="text-gray-600 mb-6">Role: {user.role}</p>

                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/auth/login');
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>
        </main>
    );
}
