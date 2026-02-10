'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function ProfilePage() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { items } = useCart();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                const p = res.data;
                setValue('name', p.name);
                setValue('email', p.email); // Readonly
                setValue('phone', p.phone || '');
                setValue('address', p.address || '');
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch profile', err);
                router.push('/auth/login');
            }
        };
        fetchProfile();
    }, [setValue, router]);

    const onSubmit = async (data: any) => {
        setSaving(true);
        setMessage('');
        try {
            await api.put('/profile', data);
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile', err);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

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
                        <a href="/booking" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">SERVICE</a>
                        <a href="/quote" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">GET QUOTE</a>
                        <a href="/profile" className="text-sm font-medium text-white border-b-2 border-red-600">PROFILE</a>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/cart')}
                        className="text-sm font-medium text-white hover:text-red-500 transition-colors"
                    >
                        CART ({items.reduce((acc, item) => acc + item.quantity, 0)})
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors md:hidden"
                    >
                        Dashboard
                    </button>
                </div>
            </nav>

            <main className="pt-32 px-6 pb-12 max-w-4xl mx-auto">
                <h2 className="text-3xl font-light mb-8">Profile Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                                {localStorage.getItem('token') ? 'U' : '?'}
                            </div>
                            <h3 className="text-xl font-medium text-center">User Account</h3>
                            <p className="text-sm text-gray-400 text-center mt-2">Manage your personal information and contact details.</p>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">

                            {/* Personal Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-4">Personal Details</h3>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                        <input
                                            {...register('name')}
                                            type="text"
                                            className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            readOnly
                                            className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4 pt-6">
                                <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-4">Contact Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                    <input
                                        {...register('phone')}
                                        type="tel"
                                        placeholder="+36 30 123 4567"
                                        className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                                    <textarea
                                        {...register('address')}
                                        rows={3}
                                        placeholder="1234 Budapest, Main St. 1."
                                        className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors resize-none"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 flex items-center justify-between">
                                <span className={`text-sm ${message.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
                                    {message}
                                </span>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
