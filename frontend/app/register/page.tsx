"use client"
import React, { useState } from 'react';
import { Coins, LoaderCircle } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!registerForm.email || !registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
      toast.error('Please fill all details');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authAPI.register(registerForm);
      if (response.success) {
        toast.success("Registration successful");
        router.replace('/login');
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

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Create Account</h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-white/80">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-2 block text-sm text-white/80">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              disabled={isSubmitting}
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-white/80">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              disabled={isSubmitting}
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm text-white/80">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              disabled={isSubmitting}
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 py-3 font-semibold text-gray-900 transition-all hover:from-yellow-500 hover:to-yellow-600 disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting && <LoaderCircle className="h-5 w-5 animate-spin" />}
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

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
    </main>
  );
}
