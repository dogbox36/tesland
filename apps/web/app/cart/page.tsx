'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeFromCart, clearCart, total } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        if (items.length === 0) return;

        // Mock checkout process
        const confirm = window.confirm(`Total amount: $${total}\n\nProceed to payment?`);
        if (confirm) {
            alert('Order placed successfully! (This is a simplified MVP checkout)');
            clearCart();
            router.push('/');
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
                        <a href="/booking" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">SERVICE</a>
                        <a href="/profile" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">PROFILE</a>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-12 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-lg mb-6">Your cart is empty.</p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="bg-white text-black font-bold py-3 px-8 rounded hover:bg-gray-200 transition-colors uppercase tracking-wider text-sm"
                        >
                            Browse Shop
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-6 bg-gray-900/30 p-4 rounded-lg border border-gray-800">
                                    <div className="w-24 h-24 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-gray-400">${item.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-400 text-sm mb-2">Qty: {item.quantity}</div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 text-sm hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 sticky top-32">
                                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${total}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-gray-700 pt-3 flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span>${total}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded transition-colors uppercase tracking-wider text-sm"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
