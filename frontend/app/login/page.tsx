"use client"
import React, { useState } from 'react';
import { Coins, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authAPI, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!loginForm.email || !loginForm.password) {
      toast.error('Enter your email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authAPI.login(loginForm);
      if (response.success) {
        toast.success("Login successful");
        router.replace('/dashboard');
        router.refresh();
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg sm:p-8">
        <div className="mb-7 flex items-center justify-center sm:mb-8">
          <Coins className="mr-3 h-10 w-10 text-yellow-400 sm:h-12 sm:w-12" />
          <h1 className="text-3xl font-bold text-white sm:text-4xl">KCoin</h1>
        </div>

        <h2 className="mb-6 text-center text-2xl font-semibold text-white">Welcome Back</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-white/80">Email</label>
            <input
              id="email"
              type="text"
              autoComplete="email"
              disabled={isSubmitting}
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-white/80">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting}
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 py-3 font-semibold text-gray-900 transition-all hover:from-yellow-500 hover:to-yellow-600 disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting && <LoaderCircle className="h-5 w-5 animate-spin" />}
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-white/60 text-center mt-6">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/register')}
            className="cursor-pointer text-yellow-400 hover:text-yellow-300 font-semibold"
          >
            Register
          </button>
        </p>
      </div>
    </main>
  );
}
