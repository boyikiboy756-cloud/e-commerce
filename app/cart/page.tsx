'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { formatPHP } from '@/lib/currency'
import { useStore } from '@/lib/store-context'
import { toast } from '@/hooks/use-toast'

export default function CartPage() {
  const {
    cart,
    getAvailabilityStatus,
    getAvailableStock,
    getInventoryRecord,
    getProductById,
    removeFromCart,
    updateCartQuantity,
  } = useStore()

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const tax = subtotal * 0.12
  const shipping = subtotal >= 400 || subtotal === 0 ? 0 : 75
  const total = subtotal + tax + shipping
  const hasUnavailableItems = cart.some((item) => {
    const record = getInventoryRecord(item.productId)
    const availableStock = getAvailableStock(item.productId)

    return !record || record.isArchived || availableStock < item.quantity
  })

  const handleQuantityChange = (productId: string, size: number, nextQuantity: number) => {
    const result = updateCartQuantity(productId, size, nextQuantity)

    if (!result.ok) {
      toast({
        title: 'Cart update failed',
        description: result.message,
        variant: 'destructive',
      })
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-xl text-foreground/60 mb-6">Your cart is empty</p>
          <Button size="lg" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-4xl text-foreground mb-12">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => {
              const product = getProductById(item.productId)
              if (!product) {
                return null
              }

              const availability = getAvailabilityStatus(product.id)
              const availableStock = getAvailableStock(product.id)
              const isArchived = getInventoryRecord(product.id)?.isArchived ?? false

              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-6 pb-6 border-b border-border"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${product.id}`} className="hover:text-accent">
                      <h3 className="font-serif text-lg text-foreground mb-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-foreground/60 mb-2">{item.size}ml</p>
                    <p className="mb-3 text-xs text-foreground/50">
                      {isArchived
                        ? 'This product has been archived and cannot be checked out.'
                        : availability === 'Low Stock'
                        ? `Low stock: only ${availableStock} left`
                        : availability === 'Out of Stock'
                          ? 'Out of stock now. Adjust quantity before checkout.'
                          : `${availableStock} unit(s) currently available`}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border border-border rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, item.size, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, item.size, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right flex-1">
                        <p className="font-serif text-lg text-foreground">
                          {formatPHP(item.unitPrice * item.quantity)}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {formatPHP(item.unitPrice)} each
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-muted rounded-lg p-6 space-y-6 sticky top-24">
              <h2 className="font-serif text-xl text-foreground">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>{formatPHP(subtotal)}</span>
                </div>

                <div className="flex justify-between text-foreground/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPHP(shipping)}</span>
                </div>

                <div className="flex justify-between text-foreground/70">
                  <span>Tax</span>
                  <span>{formatPHP(tax)}</span>
                </div>

                {shipping === 0 && subtotal > 0 && (
                  <p className="text-xs text-accent">
                    Shipping is free on orders of {formatPHP(400)} or more.
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between mb-6">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-serif text-2xl text-foreground">
                    {formatPHP(total)}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mb-3"
                  asChild
                >
                  <Link
                    href="/checkout"
                    aria-disabled={hasUnavailableItems}
                    className={hasUnavailableItems ? 'pointer-events-none opacity-50' : undefined}
                  >
                    Proceed to Checkout
                  </Link>
                </Button>

                {hasUnavailableItems && (
                  <p className="text-xs text-destructive">
                    Remove or adjust unavailable items before continuing to checkout.
                  </p>
                )}

                <Button size="lg" variant="outline" className="w-full" asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
