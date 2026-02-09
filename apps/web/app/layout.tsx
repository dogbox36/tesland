import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CartProvider } from '../context/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Tesland Web',
    description: 'Tesland Web Application',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="hu">
            <body className={inter.className}>
                <CartProvider>
                    {children}
                </CartProvider>
            </body>
        </html>
    )
}
