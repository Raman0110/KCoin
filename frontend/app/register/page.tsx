"use client"
import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authAPI, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [registerForm, setRegisterForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async () => {
    if (registerForm.email && registerForm.username && registerForm.password) {
      if (registerForm.password === registerForm.confirmPassword) {
        try {
          const response = await authAPI.register(registerForm);
          if (response.success) {
            toast.success("User Registered Successful")
            router.push('/login');
          }
        } catch (error: unknown) {
          toast.error(getErrorMessage(error))
        }
      } else {
        toast.error('Passwords do not match')
      }
    } else {
      toast.error('Please fill all details')
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="flex items-center justify-center mb-8">
          <Coins className="w-12 h-12 text-yellow-400 mr-3" />
          <h1 className="text-4xl font-bold text-white">KCoin</h1>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Create Account</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-white/80 mb-2 text-sm">Email</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm">Username</label>
            <input
              type="text"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm">Confirm Password</label>
            <input
              type="password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Confirm your password"
            />
          </div>

          <button
            onClick={handleRegister}
            className="cursor-pointer w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105"
          >
            Create Account
          </button>
        </div>

        <p className="text-white/60 text-center mt-6">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="cursor-pointer text-yellow-400 hover:text-yellow-300 font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
