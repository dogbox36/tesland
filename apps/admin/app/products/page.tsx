'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Product {
    id: string;
    name: string;
    partNumber?: string | null;
    description?: string | null;
    price: number;
    stock: number;
    imageUrl?: string | null;
    discountPrice?: number | null;
    discountExpiresAt?: string | null;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isIdentifying, setIsIdentifying] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        partNumber: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        discountPrice: '',
        discountExpiresAt: ''
    });

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch products', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSmartFill = async () => {
        const query = formData.partNumber || formData.name;
        if (!query) {
            alert('Please enter a Name or Part Number first');
            return;
        }

        setIsIdentifying(true);
        try {
            const res = await api.get(`/products/identify/smart?q=${encodeURIComponent(query)}`);
            console.log('Smart Fill Response:', res.data);
            if (res.data) {
                setFormData(prev => ({
                    ...prev,
                    name: res.data.name || prev.name,
                    description: res.data.description || prev.description,
                    price: res.data.price ? res.data.price.toString() : prev.price,
                    stock: res.data.stock ? res.data.stock.toString() : prev.stock,
                    imageUrl: res.data.imageUrl || prev.imageUrl,
                    partNumber: res.data.partNumber || prev.partNumber
                }));
            } else {
                alert('No match found in Tesla Parts Database');
            }
        } catch (err) {
            console.error('Smart Fill failed', err);
            alert('Smart Fill failed');
        } finally {
            setIsIdentifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
                discountExpiresAt: formData.discountExpiresAt ? new Date(formData.discountExpiresAt).toISOString() : null
            };

            if (editingId) {
                await api.put(`/products/${editingId}`, payload);
            } else {
                await api.post('/products', payload);
            }

            setShowForm(false);
            setEditingId(null);
            setEditingId(null);
            setFormData({ name: '', partNumber: '', description: '', price: '', stock: '', imageUrl: '', discountPrice: '', discountExpiresAt: '' });
            fetchProducts();
        } catch (err) {
            console.error('Failed to save product', err);
            alert('Failed to save product');
        }
    };

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            partNumber: product.partNumber || '',
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            imageUrl: product.imageUrl || '',
            discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
            discountExpiresAt: product.discountExpiresAt ? new Date(product.discountExpiresAt).toISOString().slice(0, 16) : ''
        });
        setEditingId(product.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    const isDiscountActive = (product: Product) => {
        if (!product.discountPrice) return false;
        if (!product.discountExpiresAt) return true;
        return new Date(product.discountExpiresAt) > new Date();
    };

    if (loading) return <div className="p-8 text-white">Loading products...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-white">Products Management</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setFormData({ name: '', partNumber: '', description: '', price: '', stock: '', imageUrl: '', discountPrice: '', discountExpiresAt: '' });
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors uppercase text-sm font-bold tracking-wider"
                >
                    {showForm ? 'Cancel' : '+ New Product'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-xl font-bold text-white mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 flex gap-4 items-end bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400 mb-1">Part Number (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none"
                                    value={formData.partNumber}
                                    onChange={e => setFormData({ ...formData, partNumber: e.target.value })}
                                    placeholder="e.g. 1044321-00-G"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSmartFill}
                                disabled={isIdentifying}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition-colors whitespace-nowrap h-[42px]"
                            >
                                {isIdentifying ? 'Searching...' : '🪄 Smart Fill'}
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                            <div className="flex gap-4 items-start">
                                <input
                                    type="text"
                                    className="flex-1 bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                                {formData.imageUrl && (
                                    <div className="w-16 h-16 rounded overflow-hidden border border-gray-700 bg-gray-900 shrink-0">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </div>
                                )}
                            </div>
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

                        {/* Discount Section */}
                        <div className="md:col-span-2 border-t border-gray-700 pt-4 mt-2">
                            <h4 className="text-sm font-bold text-gray-300 mb-3">Discount Settings (Optional)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Discount Price ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none"
                                        value={formData.discountPrice}
                                        onChange={e => setFormData({ ...formData, discountPrice: e.target.value })}
                                        placeholder="Leave empty for no discount"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Discount Expires At</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-red-600 outline-none [color-scheme:dark]"
                                        value={formData.discountExpiresAt}
                                        onChange={e => setFormData({ ...formData, discountExpiresAt: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 md:col-span-2">
                                    If set, this price will be used instead of the original price until the expiration date (if provided).
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setEditingId(null); }}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-bold"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded font-bold">
                                {editingId ? 'Update Product' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </div >
            )
            }

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
                        {products.map((product) => {
                            const hasDiscount = isDiscountActive(product);
                            return (
                                <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 bg-gray-700 rounded" />}
                                        <div>
                                            <div className="text-white font-medium">{product.name}</div>
                                            <ExpandableDescription text={product.description} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-mono">
                                        {hasDiscount ? (
                                            <div>
                                                <span className="line-through text-gray-500 text-xs">${product.price}</span>
                                                <div className="text-red-500 font-bold">${product.discountPrice}</div>
                                            </div>
                                        ) : (
                                            <span>${product.price}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${product.stock > 0 ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-white hover:text-gray-300 text-sm bg-gray-700 px-2 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-500 hover:text-red-400 text-sm px-2 py-1"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
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
        </div >
    );
}

function ExpandableDescription({ text }: { text?: string | null }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return <div className="text-xs text-gray-600 italic">No description</div>;

    if (text.length < 30) return <div className="text-xs text-gray-400">{text}</div>;

    return (
        <div
            className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {isExpanded ? text : `${text.substring(0, 30)}...`}
            <span className="ml-1 text-blue-500 font-bold opacity-70">
                {isExpanded ? ' (less)' : ' (more)'}
            </span>
        </div>
    );
}
