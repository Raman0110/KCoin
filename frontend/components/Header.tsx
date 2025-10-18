"use client";
import React, { useState, useEffect } from "react";
import { Coins, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const navigateTo = async (path: string) => {
    if (pathname === path) return;
    setIsLoading(true);
    // await new Promise((res) => setTimeout(res, 200));
    router.push(path);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Header Bar */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Coins className="w-8 h-8 text-yellow-400 mr-2 animate-spin-slow" />
            <h1 className="text-2xl font-bold text-white">KCoin</h1>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => navigateTo("/dashboard")}
              className={`cursor-pointer text-white/80 hover:text-white transition-colors ${isActive("/dashboard") ? "text-yellow-400" : ""
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateTo("/mine")}
              className={`cursor-pointer text-white/80 hover:text-white transition-colors ${isActive("/mine") ? "text-yellow-400" : ""
                }`}
            >
              Mine
            </button>
            <button
              onClick={() => navigateTo("/explorer")}
              className={`cursor-pointer text-white/80 hover:text-white transition-colors ${isActive("/explorer") ? "text-yellow-400" : ""
                }`}
            >
              Explorer
            </button>
            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>


    </>
  );
}
