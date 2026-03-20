'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { formatPHP } from '@/lib/currency'
import { getProductById } from '@/lib/products'

interface CartItem {
  productId: string
  size: number
  quantity: number
  price: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      productId: '1',
      size: 50,
      quantity: 1,
      price: 245,
    },
  ])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + tax + shipping

  const updateQuantity = (idx: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(idx)
      return
    }
    const updatedItems = [...items]
    updatedItems[idx].quantity = newQuantity
    setItems(updatedItems)
  }

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx))
  }

  if (items.length === 0) {
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
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, idx) => {
              const product = getProductById(item.productId)
              if (!product) return null

              return (
                <div key={idx} className="flex gap-6 pb-6 border-b border-border">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${product.id}`} className="hover:text-accent">
                      <h3 className="font-serif text-lg text-foreground mb-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-foreground/60 mb-3">
                      {item.size}ml
                    </p>

                    <div className="flex items-center gap-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-2 border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-1">
                        <p className="font-serif text-lg text-foreground">
                          {formatPHP(item.price * item.quantity)}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {formatPHP(item.price)} each
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(idx)}
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

          {/* Order Summary */}
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
                  <span>
                    {shipping === 0 ? 'Free' : formatPHP(shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-foreground/70">
                  <span>Tax</span>
                  <span>{formatPHP(tax)}</span>
                </div>

                {shipping === 0 && (
                  <p className="text-xs text-accent">
                    Free shipping on orders over {formatPHP(100)}
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
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  asChild
                >
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
