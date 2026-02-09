import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tesland Admin',
    description: 'Tesland Admin Dashboard',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="hu">
            <body>{children}</body>
        </html>
    )
}
