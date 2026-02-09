'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Stats {
    users: number;
    profiles: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // We need a token. For now, assuming user logs in on Web app and token is in localStorage.
                // In a real monorepo admin, we'd have a separate login or shared auth domain.
                // For this MVP, let's assume the user manually copies token or we implement login here too.
                // BUT, to make it checking easier, I'll add a check. 
                // If no token, we might need to redirect to web login or show a message.

                // Note: LocalStorage is domain specific. localhost:4000 (web) vs localhost:4001 (admin).
                // They do NOT share localStorage.
                // WE NEED AN ADMIN LOGIN PAGE.

                // For now, let's just try to fetch. If 401, we show a "Please Log In" message.
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err: any) {
                console.error('Failed to fetch stats', err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError('Unauthorized. Please log in.');
                } else {
                    setError('Failed to load stats.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-white">Loading stats...</div>;

    if (error) return (
        <div>
            <div className="p-4 bg-red-900/50 text-red-200 rounded mb-4">
                {error}
            </div>
            <p className="text-gray-400">
                Since Admin is on port 4001 and Web on 4000, they don't share cookies/storage automatically in this dev setup.
                You need to implement Login on Admin or manually set the token in LocalStorage for testing.
                <br />
                <br />
                Go to <a href="/login" className="text-blue-400 underline">Login</a> (Not implemented yet)
            </p>
        </div>
    );

    return (
        <div>
            <h2 className="text-3xl font-light mb-8 text-white">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Users</h3>
                    <p className="text-4xl font-bold text-white mt-2">{stats?.users}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Profiles</h3>
                    <p className="text-4xl font-bold text-white mt-2">{stats?.profiles}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Revenue</h3>
                    <p className="text-4xl font-bold text-green-500 mt-2">$0</p>
                </div>
            </div>
        </div>
    );
}
