'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            // Verify if admin? 
            // Ideally we check role here, but guard will block later anyway.
            router.push('/');
        } catch (err: any) {
            console.error('Login failed', err);
            setError('Login failed. Check credentials or permissions.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg border border-gray-800 shadow-xl">
                <h1 className="text-2xl font-bold text-white text-center mb-6 uppercase tracking-widest text-red-600">Admin Access</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 text-red-200 text-sm rounded border border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors uppercase tracking-wider text-sm"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
