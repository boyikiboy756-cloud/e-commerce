'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { formatPHP } from '@/lib/currency'
import type { Product } from '@/lib/products'
import { useStore } from '@/lib/store-context'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    getAvailableStock,
    getAvailabilityStatus,
    getInventoryRecord,
    isWishlisted,
    toggleWishlist,
  } = useStore()
  const availableStock = getAvailableStock(product.id)
  const availability = getAvailabilityStatus(product.id)
  const isArchived = getInventoryRecord(product.id)?.isArchived ?? false
  const wishlisted = isWishlisted(product.id)
  const displayAvailability = isArchived ? 'Archived' : availability
  const availabilityTone =
    isArchived
      ? 'bg-slate-200 text-slate-700'
      : availability === 'In Stock'
      ? 'bg-green-100 text-green-700'
      : availability === 'Low Stock'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700'

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group cursor-pointer">
        {/* Product Image */}
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          
          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {product.isNewArrival && (
              <span className="inline-block bg-accent px-3 py-1 text-xs font-medium text-accent-foreground rounded">
                New
              </span>
            )}
            <span className={`inline-block rounded px-3 py-1 text-xs font-medium ${availabilityTone}`}>
              {displayAvailability}
            </span>
            <button
              type="button"
              suppressHydrationWarning
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                await toggleWishlist(product.id)
              }}
              className="rounded-full bg-white/90 p-2 backdrop-blur-sm hover:bg-white transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-4 h-4 ${wishlisted ? 'fill-foreground text-foreground' : 'text-foreground'}`}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            {product.brand}
          </p>
          
          <h3 className="font-serif text-lg text-foreground leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          {/* Scent Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {product.scentFamily.slice(0, 2).map((scent) => (
              <span
                key={scent}
                className="inline-block bg-muted px-2.5 py-1 text-xs text-foreground/70 rounded"
              >
                {scent}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 pt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.floor(product.rating)
                      ? 'text-accent'
                      : 'text-muted'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-3">
            <span className="font-serif text-xl text-foreground">
              {formatPHP(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">from</span>
          </div>

          <p className="text-xs text-foreground/60">
            {isArchived
              ? 'Archived from active sales and kept only for store history'
              : availability === 'Low Stock'
              ? `Only ${availableStock} left in inventory`
              : availability === 'Out of Stock'
                ? 'Temporarily unavailable online and in store'
                : `${availableStock} units available for online and POS sales`}
          </p>
        </div>
      </div>
    </Link>
  )
}
