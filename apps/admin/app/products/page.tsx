'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: ''
    });

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            });
            setShowForm(false);
            setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
            fetchProducts();
        } catch (err) {
            console.error('Failed to create product', err);
            alert('Failed to create product');
        }
    };

    if (loading) return <div className="p-8 text-white">Loading products...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-white">Products Management</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors uppercase text-sm font-bold tracking-wider"
                >
                    {showForm ? 'Cancel' : '+ New Product'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-xl font-bold text-white mb-4">Add New Product</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                            <input
                                type="number"
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Stock</label>
                            <input
                                type="number"
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                            <input
                                type="text"
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none"
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none h-24"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded font-bold">
                                Save Product
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-400">
                    <thead className="bg-black text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Stock</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-4">
                                    {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover" />}
                                    <div>
                                        <div className="text-white font-medium">{product.name}</div>
                                        <div className="text-xs">{product.description?.substring(0, 30)}...</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-mono">${product.price}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${product.stock > 0 ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                                        {product.stock} in stock
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center bg-gray-900/50 rounded-lg">
                                    No products found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
