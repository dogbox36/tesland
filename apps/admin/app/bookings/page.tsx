'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Booking {
    id: string;
    serviceType: string;
    date: string;
    status: string;
    user: {
        name: string;
        email: string;
    };
    createdAt: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        if (!confirm(`Change status to ${status}?`)) return;
        try {
            await api.put(`/bookings/${id}/status`, { status });
            fetchBookings();
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Booking Management</h1>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{booking.user.name || 'N/A'}</div>
                                    <div className="text-sm text-gray-400">{booking.user.email}</div>
                                </td>
                                <td className="px-6 py-4 text-white">{booking.serviceType}</td>
                                <td className="px-6 py-4 text-gray-300">
                                    {new Date(booking.date).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'PENDING' ? 'bg-yellow-900 text-yellow-500' :
                                            booking.status === 'CONFIRMED' ? 'bg-green-900 text-green-500' :
                                                booking.status === 'REJECTED' ? 'bg-red-900 text-red-500' :
                                                    'bg-blue-900 text-blue-500'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    {booking.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                            >
                                                ACCEPT
                                            </button>
                                            <button
                                                onClick={() => updateStatus(booking.id, 'REJECTED')}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                            >
                                                REJECT
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => updateStatus(booking.id, 'COMPLETED')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                        >
                                            COMPLETE
                                        </button>
                                    )}
                                    {booking.status === 'COMPLETED' && (
                                        <span className="text-gray-500 text-xs italic">Finished</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
