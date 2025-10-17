"use client"
import React from 'react';
import { Coins, LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // TODO: Clear authentication token/session
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Coins className="w-8 h-8 text-yellow-400 mr-2" />
          <h1 className="text-2xl font-bold text-white">KCoin</h1>
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => router.push('/dashboard')}
            className={`cursor-pointer text-white/80 hover:text-white transition-colors ${isActive('/dashboard') ? 'text-yellow-400' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push('/mine')}
            className={`cursor-pointer text-white/80 hover:text-white transition-colors ${isActive('/mine') ? 'text-yellow-400' : ''}`}
          >
            Mine
          </button>
          <button
            onClick={() => router.push('/explorer')}
            className={`cursor-pointer text-white/80 hover:text-white transition-colors ${isActive('/explorer') ? 'text-yellow-400' : ''}`}
          >
            Explorer
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}