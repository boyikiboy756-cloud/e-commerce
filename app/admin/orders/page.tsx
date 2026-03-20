'use client'

import Link from 'next/link'
import { Eye, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/protected-route'
import { formatPHP } from '@/lib/currency'

const orders = [
  { id: '#OR-001', customer: 'John Smith', date: '2024-03-15', amount: 245, status: 'Shipped' },
  { id: '#OR-002', customer: 'Emma Wilson', date: '2024-03-14', amount: 385, status: 'Processing' },
  { id: '#OR-003', customer: 'Michael Brown', date: '2024-03-14', amount: 165, status: 'Pending' },
  { id: '#OR-004', customer: 'Sarah Davis', date: '2024-03-13', amount: 215, status: 'Delivered' },
  { id: '#OR-005', customer: 'James Johnson', date: '2024-03-13', amount: 325, status: 'Shipped' },
  { id: '#OR-006', customer: 'Lisa Anderson', date: '2024-03-12', amount: 445, status: 'Delivered' },
  { id: '#OR-007', customer: 'Robert Taylor', date: '2024-03-12', amount: 175, status: 'Processing' },
  { id: '#OR-008', customer: 'Jennifer White', date: '2024-03-11', amount: 295, status: 'Delivered' },
]

const statusColors: Record<string, string> = {
  'Delivered': 'bg-green-100 text-green-700',
  'Shipped': 'bg-blue-100 text-blue-700',
  'Processing': 'bg-yellow-100 text-yellow-700',
  'Pending': 'bg-gray-100 text-gray-700',
}

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
              </Button>
            </div>
            <h1 className="font-serif text-3xl text-foreground">
              Orders
            </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search orders..."
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Order ID</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Customer</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Amount</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Status</th>
                  <th className="text-right py-4 px-6 font-medium text-foreground/60">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-foreground">{order.id}</p>
                    </td>
                    <td className="py-4 px-6 text-foreground">{order.customer}</td>
                    <td className="py-4 px-6 text-foreground/60">{order.date}</td>
                    <td className="py-4 px-6 font-medium text-foreground">{formatPHP(order.amount)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-foreground/60" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 text-sm">
          <p className="text-foreground/60">
            Showing 1-8 of 342 orders
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded border border-border hover:bg-muted transition-colors text-foreground">
              Previous
            </button>
            <button className="px-3 py-2 rounded bg-accent text-accent-foreground">
              1
            </button>
            <button className="px-3 py-2 rounded border border-border hover:bg-muted transition-colors text-foreground">
              2
            </button>
            <button className="px-3 py-2 rounded border border-border hover:bg-muted transition-colors text-foreground">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
