'use client'

import Link from 'next/link'
import { Eye, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/protected-route'
import { formatPHP } from '@/lib/currency'

const customers = [
  { id: 1, name: 'John Smith', email: 'john@example.com', orders: 3, spent: 1245, joined: '2024-01-15' },
  { id: 2, name: 'Emma Wilson', email: 'emma@example.com', orders: 5, spent: 2385, joined: '2023-11-20' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', orders: 2, spent: 520, joined: '2024-02-10' },
  { id: 4, name: 'Sarah Davis', email: 'sarah@example.com', orders: 8, spent: 3645, joined: '2023-09-05' },
  { id: 5, name: 'James Johnson', email: 'james@example.com', orders: 4, spent: 1895, joined: '2024-01-28' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa@example.com', orders: 6, spent: 2750, joined: '2023-10-12' },
  { id: 7, name: 'Robert Taylor', email: 'robert@example.com', orders: 1, spent: 245, joined: '2024-02-20' },
  { id: 8, name: 'Jennifer White', email: 'jennifer@example.com', orders: 7, spent: 3125, joined: '2023-12-15' },
]

export default function AdminCustomersPage() {
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
              Customers
            </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Customers Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Name</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Email</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Orders</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Total Spent</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Joined</th>
                  <th className="text-right py-4 px-6 font-medium text-foreground/60">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-foreground">{customer.name}</p>
                    </td>
                    <td className="py-4 px-6 text-foreground/60">{customer.email}</td>
                    <td className="py-4 px-6 text-foreground">{customer.orders}</td>
                    <td className="py-4 px-6 font-medium text-foreground">{formatPHP(customer.spent)}</td>
                    <td className="py-4 px-6 text-foreground/60">{customer.joined}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Email">
                          <Mail className="w-4 h-4 text-foreground/60" />
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
            Showing 1-8 of 1,205 customers
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
