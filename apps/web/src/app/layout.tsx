import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: 'Billiard Club Manager',
    description: 'Hệ thống quản lý câu lạc bộ Billiard hiện đại',
    icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi" className={inter.variable}>
            <body className="antialiased">
                <ToastProvider>
                    <div className="flex min-h-screen">
                        <Sidebar />
                        <div className="flex-1 flex flex-col ml-64">
                            <Header />
                            <main className="flex-1 p-6 overflow-auto">
                                {children}
                            </main>
                        </div>
                    </div>
                </ToastProvider>
            </body>
        </html>
    );
}
