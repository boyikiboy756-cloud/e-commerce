'use client'

import Link from 'next/link'
import { Search, ShoppingBag, Heart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthMenu } from '@/components/auth-menu'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          </nav>
        )}
      </div>
    </header>
  )
}
