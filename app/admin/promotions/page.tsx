'use client'

import Link from 'next/link'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/protected-route'
import { formatPHP } from '@/lib/currency'

const promotions = [
  { id: 1, code: 'SPRING2024', type: 'Percentage', discount: 20, usage: '156/500', status: 'Active', expires: '2024-04-30' },
  { id: 2, code: 'WELCOME10', type: 'Fixed', discount: 10, usage: '342/∞', status: 'Active', expires: '2024-12-31' },
  { id: 3, code: 'SUMMER15', type: 'Percentage', discount: 15, usage: '89/300', status: 'Active', expires: '2024-08-31' },
  { id: 4, code: 'HOLIDAY25', type: 'Percentage', discount: 25, usage: '0/500', status: 'Scheduled', expires: '2024-12-26' },
  { id: 5, code: 'VIP30', type: 'Percentage', discount: 30, usage: '45/∞', status: 'Active', expires: '2024-12-31' },
]

export default function AdminPromotionsPage() {
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
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-3xl text-foreground">
                Promotions & Discounts
              </h1>
            <Button asChild>
              <Link href="/admin/promotions/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Promotions Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Code</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Type</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Discount</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Usage</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground/60">Expires</th>
                  <th className="text-right py-4 px-6 font-medium text-foreground/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-foreground">{promo.code}</p>
                    </td>
                    <td className="py-4 px-6 text-foreground">{promo.type}</td>
                    <td className="py-4 px-6 font-medium text-foreground">
                      {promo.type === 'Fixed' ? formatPHP(promo.discount) : `${promo.discount}%`}
                    </td>
                    <td className="py-4 px-6 text-foreground/60">{promo.usage}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        promo.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {promo.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-foreground/60">{promo.expires}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
