"use client";
import React, { useEffect, useState } from "react";
import { Coins, LoaderCircle, LogOut, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { authAPI, getErrorMessage } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setNavigatingTo(null);
  }, [pathname]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await authAPI.logout();
      router.replace("/login");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
      setIsLoggingOut(false);
    }
  };

  const navigateTo = (path: string) => {
    if (pathname === path) return;
    setNavigatingTo(path);
    setIsMenuOpen(false);
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  return (
      <header className="relative z-20 border-b border-white/20 bg-gray-950/80 backdrop-blur-lg">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <Coins className="mr-2 h-8 w-8 animate-spin-slow text-yellow-400" />
            <h1 className="text-xl font-bold text-white sm:text-2xl">KCoin</h1>
          </div>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
            {[['/dashboard', 'Dashboard'], ['/mine', 'Mine'], ['/explorer', 'Explorer']].map(([path, label]) => (
              <button
                key={path}
                type="button"
                onClick={() => navigateTo(path)}
                aria-current={isActive(path) ? "page" : undefined}
                disabled={navigatingTo !== null}
                className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-wait ${isActive(path) ? "bg-yellow-400/10 text-yellow-400" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
              >
                {navigatingTo === path && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500/30 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoggingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-white/10 px-4 py-3 md:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-7xl gap-2">
              {[['/dashboard', 'Dashboard'], ['/mine', 'Mine'], ['/explorer', 'Explorer']].map(([path, label]) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => navigateTo(path)}
                  disabled={navigatingTo !== null}
                  className={`flex min-h-12 cursor-pointer items-center justify-between rounded-lg px-4 text-left font-medium ${isActive(path) ? "bg-yellow-400/10 text-yellow-400" : "text-white/75 hover:bg-white/5"}`}
                >
                  {label}
                  {navigatingTo === path && <LoaderCircle className="h-4 w-4 animate-spin" />}
                </button>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex min-h-12 cursor-pointer items-center gap-2 rounded-lg bg-red-500/15 px-4 font-medium text-white disabled:cursor-wait disabled:opacity-60"
              >
                {isLoggingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </nav>
        )}
      </header>
  );
}
