"use client"
import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    if (loginForm.email && loginForm.password) {
      try {
        const response = await authAPI.login(loginForm);
        if (response.success) {
          toast.success("Login successful");
          router.push('/dashboard');
        }
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="flex items-center justify-center mb-8">
          <Coins className="w-12 h-12 text-yellow-400 mr-3" />
          <h1 className="text-4xl font-bold text-white">KCoin</h1>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Welcome Back</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-white/80 mb-2 text-sm">Email or Username</label>
            <input
              type="text"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            className="cursor-pointer w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105"
          >
            Login
          </button>
        </div>

        <p className="text-white/60 text-center mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/register')}
            className="cursor-pointer text-yellow-400 hover:text-yellow-300 font-semibold"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}