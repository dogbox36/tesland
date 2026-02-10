import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthGuard from '../components/AuthGuard';
import LogoutButton from '../components/LogoutButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Tesland Admin',
    description: 'Admin Dashboard',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-900 text-white`}>
                <AuthGuard>
                    <div className="flex h-screen">
                        {/* Sidebar */}
                        <aside className="w-64 bg-black border-r border-gray-800">
                            <div className="p-6">
                                <h1 className="text-xl font-bold tracking-widest uppercase text-red-600">Tesland Admin</h1>
                            </div>
                            <nav className="mt-6 flex flex-col space-y-1">
                                <a href="/" className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                    Dashboard
                                </a>
                                <a href="/users" className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                    Users
                                </a>
                                <a href="/quotes" className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                    Quotes
                                </a>
                                <a href="/products" className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                    Products
                                </a>
                                <a href="/bookings" className="block py-3 px-6 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                    Bookings
                                </a>
                            </nav>
                            <div className="p-6 mt-auto">
                                <div className="text-xs text-gray-500">v0.1.0</div>
                                <LogoutButton />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 overflow-y-auto bg-gray-900">
                            <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-end">
                                <div className="text-sm text-gray-400">Admin User</div>
                            </header>
                            <div className="p-8">
                                {children}
                            </div>
                        </main>
                    </div>
                </AuthGuard>
            </body>
        </html>
    );
}
