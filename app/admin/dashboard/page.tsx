'use client'

import Link from 'next/link'
import { BarChart3, Package, ShoppingCart, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/protected-route'
import { AdminSidebar } from '@/components/admin-sidebar'
import { formatPHP } from '@/lib/currency'

const stats = [
  {
    label: 'Total Sales',
    value: 24580,
    format: 'currency',
    change: '+12%',
    icon: BarChart3,
  },
  {
    label: 'Orders',
    value: 342,
    format: 'number',
    change: '+8%',
    icon: ShoppingCart,
  },
  {
    label: 'Products',
    value: 48,
    format: 'number',
    change: '+3',
    icon: Package,
  },
  {
    label: 'Customers',
    value: 1205,
    format: 'number',
    change: '+5%',
    icon: Users,
  },
]

const recentOrders = [
  { id: '#OR-001', customer: 'John Smith', amount: 245, status: 'Shipped' },
  { id: '#OR-002', customer: 'Emma Wilson', amount: 385, status: 'Processing' },
  { id: '#OR-003', customer: 'Michael Brown', amount: 165, status: 'Pending' },
  { id: '#OR-004', customer: 'Sarah Davis', amount: 215, status: 'Delivered' },
]

const topProducts = [
  { name: 'Midnight Elegance', sales: 142, revenue: 34930 },
  { name: 'Velvet Spice', sales: 128, revenue: 27392 },
  { name: 'Golden Hour', sales: 115, revenue: 20025 },
  { name: 'Silk Dreams', sales: 98, revenue: 20090 },
]

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl text-foreground">
              Dashboard
            </h1>
            <Button variant="outline" asChild>
              <Link href="/admin/login">Logout</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-foreground/60">{stat.label}</p>
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <p className="font-serif text-3xl text-foreground mb-2">
                  {stat.format === 'currency'
                    ? formatPHP(stat.value)
                    : stat.value.toLocaleString('en-PH')}
                </p>
                <p className="text-xs text-accent">
                  {stat.change} from last month
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">Recent Orders</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{order.id}</p>
                    <p className="text-sm text-foreground/60">{order.customer}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-foreground">{formatPHP(order.amount)}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'Processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="font-serif text-lg text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/admin/products/new">Create Product</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/orders">Manage Orders</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/customers">View Customers</Link>
                </Button>
              </div>
            </div>

            {/* Admin Menu */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="font-serif text-lg text-foreground mb-4">Admin Menu</h2>
              <div className="space-y-2 text-sm">
                <Link href="/admin/products" className="block p-2 hover:bg-muted rounded text-foreground/70 hover:text-foreground">
                  Products
                </Link>
                <Link href="/admin/orders" className="block p-2 hover:bg-muted rounded text-foreground/70 hover:text-foreground">
                  Orders
                </Link>
                <Link href="/admin/customers" className="block p-2 hover:bg-muted rounded text-foreground/70 hover:text-foreground">
                  Customers
                </Link>
                <Link href="/admin/promotions" className="block p-2 hover:bg-muted rounded text-foreground/70 hover:text-foreground">
                  Promotions
                </Link>
                <Link href="/admin/analytics" className="block p-2 hover:bg-muted rounded text-foreground/70 hover:text-foreground">
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="mt-8 bg-card rounded-lg border border-border p-6">
          <h2 className="font-serif text-xl text-foreground mb-6">Top Products</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground/60">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/60">Sales</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/60">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.name} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-foreground">{product.name}</td>
                    <td className="py-3 px-4 text-foreground">{product.sales}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{formatPHP(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
