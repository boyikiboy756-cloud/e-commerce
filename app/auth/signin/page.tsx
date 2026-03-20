'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  DEMO_USER_EMAIL,
  DEMO_USER_PASSWORD,
  SITE_NAME,
} from '@/lib/site'

export default function SignInPage() {
  const router = useRouter()
  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      if (isAdmin) {
        router.push('/admin/dashboard')
      } else {
        router.push('/shop')
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // Redirect will happen via useEffect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-serif text-4xl text-foreground">
              Welcome Back
            </h1>
            <p className="text-foreground/60">
              Sign in to your {SITE_NAME} account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Demo Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium text-foreground">Demo Credentials:</p>
            <p className="text-xs text-foreground/70">
              <strong>Admin:</strong> {ADMIN_EMAIL} / {ADMIN_PASSWORD}
            </p>
            <p className="text-xs text-foreground/70">
              <strong>User:</strong> {DEMO_USER_EMAIL} / {DEMO_USER_PASSWORD}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-foreground/70">
                  Remember me
                </span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading || authLoading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2"
            >
              {loading && <Spinner className="w-4 h-4" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-foreground/60">
                New to {SITE_NAME}?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Button
            asChild
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Link href="/auth/signup">Create Account</Link>
          </Button>

          {/* Footer */}
          <p className="text-center text-xs text-foreground/50">
            By signing in, you agree to our{' '}
            <Link href="#" className="underline hover:text-foreground/70">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline hover:text-foreground/70">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
