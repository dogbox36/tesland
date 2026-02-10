'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

import { useCart } from '@/context/CartContext';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    discountPrice?: number;
    discountExpiresAt?: string;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { addToCart, items } = useCart();

    useEffect(() => {
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

        fetchProducts();
    }, []);

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
                        <a href="/shop" className="text-sm font-medium text-white border-b-2 border-red-600">SHOP</a>
                        <a href="/booking" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">SERVICE</a>
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

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold mb-4">Accessories</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Enhance your Tesla experience with our premium collection of accessories.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No products available yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function ProductCard({ product, addToCart }: { product: Product, addToCart: (p: Product) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-red-900/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10">
            <div className="aspect-video w-full bg-gray-800 relative overflow-hidden">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gray-900">
                        No Image
                    </div>
                )}
                {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        OUT OF STOCK
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-red-500 transition-colors">{product.name}</h3>
                    <div className="text-right">
                        {product.discountPrice && (!product.discountExpiresAt || !isNaN(new Date(product.discountExpiresAt).getTime()) && new Date(product.discountExpiresAt) > new Date()) ? (
                            <>
                                <span className="block text-sm line-through text-gray-500">${product.price}</span>
                                <span className="text-xl font-bold text-red-500">${product.discountPrice}</span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-white">${product.price}</span>
                        )}
                    </div>
                </div>

                <div
                    className={`relative mb-6 cursor-pointer ${isExpanded ? '' : 'line-clamp-2'}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? "Click to collapse" : "Click to read more"}
                >
                    <p className="text-gray-400 text-sm transition-all duration-300">
                        {product.description}
                    </p>
                    {!isExpanded && product.description && product.description.length > 100 && (
                        <div className="absolute bottom-0 right-0 bg-gradient-to-l from-gray-900/90 to-transparent pl-4 text-xs text-red-500 font-bold hover:underline">
                            Read more
                        </div>
                    )}
                </div>

                <button
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product)}
                    className="w-full bg-white text-black font-bold py-3 px-4 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm active:scale-95 duration-100"
                >
                    {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}
