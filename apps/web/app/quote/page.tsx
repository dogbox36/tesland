'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function QuotePage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        model: '',
        serviceType: 'Custom Modification',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { items } = useCart();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/quotes', formData);
            alert('Quote request sent successfully! We will contact you shortly.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                model: '',
                serviceType: 'Custom Modification',
                message: ''
            });
        } catch (err) {
            console.error('Failed to send quote request', err);
            alert('Failed to send quote request.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                        <a href="/booking" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">SERVICE</a>
                        <a href="/quote" className="text-sm font-medium text-white border-b-2 border-red-600">GET QUOTE</a>
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

            <main className="pt-32 pb-12 px-6 max-w-2xl mx-auto">
                <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800">
                    <h2 className="text-3xl font-bold mb-6 text-center">Request a Quote</h2>
                    <p className="text-gray-400 mb-8 text-center">Tell us about your custom project or specific needs.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Phone (Optional)</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Tesla Model</label>
                                <select
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                                    required
                                >
                                    <option value="">Select Model</option>
                                    <option value="Model S">Model S</option>
                                    <option value="Model 3">Model 3</option>
                                    <option value="Model X">Model X</option>
                                    <option value="Model Y">Model Y</option>
                                    <option value="Cybertruck">Cybertruck</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Service Type</label>
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                            >
                                <option>Custom Modification</option>
                                <option>Body Kit Installation</option>
                                <option>Wrap / PPF</option>
                                <option>Performance Upgrade</option>
                                <option>Interior Customization</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded transition-colors uppercase tracking-wider text-sm disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
