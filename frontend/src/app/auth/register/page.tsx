"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  const handleSignup = async (e: any) => {
    e.preventDefault()
    setIsLoading(true);

    if (password !== confirmPassword) {
        toast.error("Passwords do not mathch. Please try again.");
        setIsLoading(false);
        return;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,   
    });

    if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
    }

    toast.success('Registration successful! Please check your email to confirm your account.');
    router.push('/auth/login');
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Decorative route lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Left decorative path */}
        <path
          d="M -100 200 Q 100 300 150 500 T 200 800"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-200 dark:text-neutral-800"
          strokeDasharray="8 8"
        />
        {/* Right decorative path */}
        <path
          d="M 100% 100 Q 80% 250 85% 400 T 90% 700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-200 dark:text-neutral-800"
          strokeDasharray="8 8"
        />
        {/* Small nodes */}
        <circle cx="150" cy="500" r="4" className="fill-neutral-300 dark:fill-neutral-700" />
        <circle cx="85%" cy="400" r="4" className="fill-neutral-300 dark:fill-neutral-700" />
      </svg>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-neutral-900 dark:text-neutral-100"
              >
                <path 
                  d="M12 2L4 7V17L12 22L20 17V7L12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-lg font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              navix
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Create your account 
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Create an account to start optimizing routes
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          {/* Terminal-style header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            </div>
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 ml-2">
              navix auth --register new
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name field */}
            <div className="space-y-2">
              <label 
                htmlFor="name" 
                className="block text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                <span className="text-neutral-400 dark:text-neutral-600">01</span> Full Name (OPTIONAL)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-900 transition-all"
              />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                <span className="text-neutral-400 dark:text-neutral-600">02</span> Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@navix.io"
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-900 transition-all"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                <span className="text-neutral-400 dark:text-neutral-600">03</span> Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-900 transition-all"
              />
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <label 
                htmlFor="confirmPassword" 
                className="block text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
              >
                <span className="text-neutral-400 dark:text-neutral-600">04</span> Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-900 transition-all"
              />
            </div>

            {/* Terms */}
            <div className="flex justify-center items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="terms"
                required
                className="w-4 h-4 mt-0.5 rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-2"
              />
              <label htmlFor="terms" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg 
                    className="w-4 h-4 animate-spin" 
                    viewBox="0 0 24 24" 
                    fill="none"
                  >
                    <circle 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeDasharray="32" 
                      strokeDashoffset="12"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 font-mono">
                OR
              </span>
            </div>
          </div>

          {/* SSO Options */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-900 transition-all flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Sign up with GitHub</span>
            </button>
            <button
              type="button"
              className="w-full px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>SSO Authentication</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Already have an account?{' '}
            <Link 
              href="/auth" 
              className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Status indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono text-neutral-400 dark:text-neutral-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>API Status: Operational</span>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
