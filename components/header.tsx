'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingBag, Heart, Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthMenu } from '@/components/auth-menu'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-light text-foreground">
              Pure Path
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/collections"
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/discovery"
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              Discovery
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              suppressHydrationWarning
              aria-label="Search"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Heart className="w-5 h-5 text-foreground" />
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Link>

            <div className="hidden sm:inline-flex ml-4">
              <AuthMenu />
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border space-y-2">
            <Link
              href="/collections"
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/shop"
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/discovery"
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Discovery
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            {!isLoading && (
              <div className="mt-4 border-t border-border px-4 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-muted/60 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                          <User className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {user?.name}
                          </p>
                          <p className="truncate text-xs text-foreground/60">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isAdmin ? (
                      <Button className="w-full justify-start" asChild>
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                          <User className="h-4 w-4" />
                          Continue Shopping
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-600"
                      onClick={async () => {
                        setMobileMenuOpen(false)
                        await logout()
                        router.push('/')
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-foreground/60">
                      Sign in on mobile to save favorites and manage your account.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button className="w-full" asChild>
                        <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                          Create Account
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
