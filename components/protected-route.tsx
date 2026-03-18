'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Spinner } from '@/components/ui/spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'USER'
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/auth/signin',
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push(fallbackPath)
      return
    }

    if (requiredRole === 'ADMIN' && !isAdmin) {
      router.push('/')
      return
    }

    if (requiredRole === 'USER' && isAdmin) {
      router.push('/admin/dashboard')
      return
    }
  }, [isAuthenticated, isAdmin, isLoading, requiredRole, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return null
  }

  if (requiredRole === 'USER' && isAdmin) {
    return null
  }

  return <>{children}</>
}
