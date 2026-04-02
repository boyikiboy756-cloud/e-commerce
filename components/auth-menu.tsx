'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AuthMenu() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, canAccessBackoffice, isLoading, logout } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">{user?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">{user?.name}</div>
          <div className="text-xs text-foreground/60">{user?.email}</div>
          {canAccessBackoffice && (
            <div className="text-xs text-primary mt-1 font-semibold">
              {isAdmin ? 'Admin' : 'Staff'}
            </div>
          )}
        </div>
        <DropdownMenuSeparator />

        {!canAccessBackoffice && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/account" className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                My Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {canAccessBackoffice && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard" className="cursor-pointer">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                {isAdmin ? 'Admin Dashboard' : 'Operations Dashboard'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={async () => {
            await logout()
            router.push('/')
          }}
          className="text-red-600 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
