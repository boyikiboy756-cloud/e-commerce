'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useStore } from '@/lib/store-context'

export default function AccountPage() {
  const { user } = useAuth()
  const { orders } = useStore()

  const userOrders = orders.filter(
    (order) =>
      order.source === 'ONLINE' &&
      order.customerEmail.toLowerCase() === (user?.email ?? '').toLowerCase(),
  )

  return (
    <ProtectedRoute requiredRole="USER">
      <div className="min-h-screen bg-background">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
              Account
            </p>
            <h1 className="mt-3 font-serif text-4xl text-foreground">{user?.name}</h1>
            <p className="mt-2 text-foreground/60">{user?.email}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-sm font-medium text-foreground/60">Orders</p>
                <p className="mt-2 font-serif text-3xl text-foreground">{userOrders.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-sm font-medium text-foreground/60">Active Orders</p>
                <p className="mt-2 font-serif text-3xl text-foreground">
                  {userOrders.filter((order) => order.status !== 'Delivered').length}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-sm font-medium text-foreground/60">Delivered</p>
                <p className="mt-2 font-serif text-3xl text-foreground">
                  {userOrders.filter((order) => order.status === 'Delivered').length}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/orders">Track Orders</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/shop">Shop More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
