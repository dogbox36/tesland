'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface Booking {
    id: string;
    serviceType: string;
    date: string;
    status: string;
}

export default function BookingPage() {
    const [serviceType, setServiceType] = useState('General Maintenance');
    const [date, setDate] = useState('');
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { items } = useCart(); // For the nav cart count

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const res = await api.get('/bookings/my');
            setMyBookings(res.data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/bookings', {
                serviceType,
                date: new Date(date).toISOString(),
            });
            alert('Booking request sent successfully!');
            setDate('');
            fetchMyBookings();
        } catch (err) {
            console.error('Failed to create booking', err);
            alert('Failed to create booking.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-900 selection:text-white">
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <h1
                        onClick={() => router.push('/')}
                        className="text-xl font-bold tracking-widest uppercase text-red-600 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        TESLAND
                    </h1>
                    <div className="hidden md:flex gap-6">
                        <a href="/shop" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">SHOP</a>
                        <a href="/booking" className="text-sm font-medium text-white border-b-2 border-red-600">SERVICE</a>
                        <a href="/quote" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">GET QUOTE</a>
                        <a href="/profile" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">PROFILE</a>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/cart')}
                    className="text-sm font-medium text-white hover:text-red-500 transition-colors"
                >
                    CART ({items.reduce((acc, item) => acc + item.quantity, 0)})
                </button>
            </nav>

            <main className="pt-32 pb-12 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Booking Form */}
                    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
                        <h2 className="text-3xl font-bold mb-6">Schedule Service</h2>
                        <p className="text-gray-400 mb-8">Choose a service and a date for your Tesla.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Service Type</label>
                                <select
                                    value={serviceType}
                                    onChange={(e) => setServiceType(e.target.value)}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                                >
                                    <option>General Maintenance</option>
                                    <option>Tire Change</option>
                                    <option>Battery Check</option>
                                    <option>Software Update</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Date</label>
                                <input
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors [color-scheme:dark]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded transition-colors uppercase tracking-wider text-sm disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Request Appointment'}
                            </button>
                        </form>
                    </div>

                    {/* Booking History */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6">My Bookings</h2>
                        <div className="space-y-4">
                            {myBookings.length === 0 ? (
                                <p className="text-gray-500">No bookings yet.</p>
                            ) : (
                                myBookings.map((booking) => (
                                    <div key={booking.id} className="bg-gray-900/30 p-6 rounded-xl border border-gray-800 flex justify-between items-center group hover:border-gray-700 transition-colors">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{booking.serviceType}</h3>
                                            <p className="text-gray-400 text-sm">{new Date(booking.date).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${booking.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-500' :
                                                booking.status === 'CONFIRMED' ? 'bg-green-900/50 text-green-500' :
                                                    'bg-red-900/50 text-red-500'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
