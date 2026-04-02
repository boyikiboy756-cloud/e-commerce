'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { formatPHP } from '@/lib/currency'
import { useStore } from '@/lib/store-context'

const statusTone: Record<string, string> = {
  Pending: 'bg-slate-100 text-slate-700',
  Processing: 'bg-amber-100 text-amber-700',
  'Ready for Dispatch': 'bg-indigo-100 text-indigo-700',
  'Out for Delivery': 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { getAvailableStock, orders } = useStore()

  const userOrders = orders.filter(
    (order) =>
      order.source === 'ONLINE' &&
      order.customerEmail.toLowerCase() === (user?.email ?? '').toLowerCase(),
  )

  return (
    <ProtectedRoute requiredRole="USER">
      <div className="min-h-screen bg-background">
        <Header />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="font-serif text-4xl text-foreground mb-3">My Orders</h1>
            <p className="text-foreground/60">
              Track your orders from processing through delivery with live availability context.
            </p>
          </div>

          {userOrders.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-lg text-foreground/70 mb-4">
                No online orders are linked to {user?.email} yet.
              </p>
              <Button asChild>
                <Link href="/shop">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                        {order.id}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl text-foreground">
                        {order.status}
                      </h2>
                      <p className="mt-2 text-sm text-foreground/60">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusTone[order.status] ?? 'bg-muted text-foreground'
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="mt-3 text-sm text-foreground/60">
                        Total: <span className="font-medium text-foreground">{formatPHP(order.total)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/50">
                        Tracking Timeline
                      </h3>
                      <div className="space-y-4">
                        {order.timeline.map((entry) => (
                          <div
                            key={`${order.id}-${entry.status}-${entry.createdAt}`}
                            className="rounded-xl border border-border bg-background/70 p-4"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-medium text-foreground">{entry.status}</p>
                              <p className="text-xs text-foreground/50">
                                {new Date(entry.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <p className="mt-2 text-sm text-foreground/60">{entry.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/50">
                        Ordered Items
                      </h3>
                      {order.items.map((item) => (
                        <div
                          key={`${order.id}-${item.productId}-${item.size}`}
                          className="rounded-xl border border-border bg-background/70 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="font-medium text-foreground">{item.productName}</p>
                            <p className="text-sm text-foreground/60">
                              {item.quantity} x {item.size}ml
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-foreground/60">
                            Current store availability: {getAvailableStock(item.productId)} unit(s)
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
