'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { getSafeRedirectPath } from '@/lib/auth'
import { Spinner } from '@/components/ui/spinner'
import { SITE_NAME } from '@/lib/site'

function SignInPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, resendVerificationEmail, isAuthenticated, canAccessBackoffice, isLoading: authLoading } =
    useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)
  const redirectTo = getSafeRedirectPath(searchParams.get('redirectTo'))
  const reason = searchParams.get('reason')
  const verified = searchParams.get('verified')
  const isCheckoutRedirect = reason === 'checkout'
  const isProductRedirect = redirectTo?.startsWith('/products/') ?? false
  const authQuery = new URLSearchParams()

  if (redirectTo) {
    authQuery.set('redirectTo', redirectTo)
  }

  if (reason) {
    authQuery.set('reason', reason)
  }

  const signupHref = authQuery.toString()
    ? `/auth/signup?${authQuery.toString()}`
    : '/auth/signup'
  const contextEyebrow = isCheckoutRedirect
    ? 'Secure Checkout'
    : isProductRedirect
      ? 'Member Purchase'
      : 'Welcome Back'
  const contextMessage = isCheckoutRedirect
    ? 'Sign in to continue to checkout and complete your purchase.'
    : isProductRedirect
      ? 'Sign in to add this fragrance to your cart and continue shopping.'
      : null

  useEffect(() => {
    if (verified === '1') {
      setInfoMessage('Your email has been verified. You can sign in now.')
    }
  }, [verified])

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      if (canAccessBackoffice) {
        router.push('/admin/dashboard')
      } else {
        router.push(redirectTo || '/shop')
      }
    }
  }, [authLoading, canAccessBackoffice, isAuthenticated, redirectTo, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfoMessage('')
    setNeedsVerification(false)
    setLoading(true)

    try {
      await login(email, password)
      // Redirect will happen via useEffect
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      setNeedsVerification(message.toLowerCase().includes('verify your email'))
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setError('')
    setInfoMessage('')
    setResendLoading(true)

    try {
      await resendVerificationEmail(email)
      setInfoMessage('Verification email sent. Check your inbox and spam folder.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend verification email.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[30px] border border-border/70 bg-gradient-to-br from-card via-background to-muted/45 px-6 py-8 shadow-[0_28px_70px_rgba(88,72,58,0.09)] sm:px-8 sm:py-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
              {contextEyebrow}
            </p>
            <h1 className="font-serif text-4xl text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm leading-6 text-foreground/60">
              Sign in to your {SITE_NAME} account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {infoMessage && (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">{infoMessage}</p>
            </div>
          )}

          {contextMessage && (
            <div className="mt-8 rounded-2xl border border-border/70 bg-background/70 p-5">
              <p className="text-sm leading-6 text-foreground/70">
                {contextMessage}
              </p>
            </div>
          )}

          {/* Account Info */}
          <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-4 space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/40">
              Account Access
            </p>
            <p className="text-xs text-foreground/60">
              Sign in with the email and password from your verified Supabase Auth account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
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

            <div className="space-y-2">
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
              className="h-12 w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2"
            >
              {loading && <Spinner className="w-4 h-4" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {needsVerification && (
              <Button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                variant="outline"
                className="h-12 w-full"
              >
                {resendLoading ? 'Sending verification...' : 'Resend Verification Email'}
              </Button>
            )}
          </form>

          {/* Divider */}
          <div className="relative mt-8">
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
            className="mt-6 h-12 w-full border-border/80 bg-background/70"
            size="lg"
          >
            <Link href={signupHref}>Create Account</Link>
          </Button>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-foreground/50">
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
    </div>
  )
}

function SignInPageFallback() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-foreground/70">
          <Spinner className="h-5 w-5" />
          <p>Loading sign-in...</p>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInPageFallback />}>
      <SignInPageContent />
    </Suspense>
  )
}
