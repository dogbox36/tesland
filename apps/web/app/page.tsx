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

    if (loading) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-900 selection:text-white">
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl font-bold tracking-widest uppercase text-red-600">TESLAND</h1>
                    <div className="hidden md:flex gap-6">
                        <a href="/shop" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">SHOP</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/auth/login');
                        }}
                        className="text-sm font-medium text-white hover:text-red-500 transition-colors"
                    >
                        LOGOUT
                    </button>
                </div>
            </nav>

            <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Gradient Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="z-10 w-full max-w-md space-y-8 text-center">
                    <h1 className="text-5xl font-bold tracking-tighter mb-2">Welcome Back.</h1>
                    <p className="text-xl text-gray-400 font-light">Ready to experience the future?</p>

                    <div className="grid grid-cols-1 gap-4 mt-8">
                        <button
                            onClick={() => router.push('/profile')}
                            className="group relative w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors">Profile Settings</h3>
                                    <p className="text-sm text-gray-500">Manage your personal details</p>
                                </div>
                                <span className="text-2xl text-gray-600 group-hover:text-white transition-colors">→</span>
                            </div>
                        </button>

                        {user.role === 'ADMIN' && (
                            <a
                                href="http://localhost:4001"
                                className="group relative w-full bg-gradient-to-r from-red-900/20 to-black hover:from-red-900/40 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] block"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-red-500">Admin Console</h3>
                                        <p className="text-sm text-gray-500">Manage users and products</p>
                                    </div>
                                    <span className="text-2xl text-red-800 group-hover:text-red-500 transition-colors">→</span>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
