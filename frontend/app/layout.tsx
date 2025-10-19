import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KCoin - Cryptocurrency Platform',
  description: 'A decentralized cryptocurrency platform built with blockchain technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" />
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </>
  );
}