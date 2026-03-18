'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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
            <button
              type="button"
              suppressHydrationWarning
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="rounded-full bg-white/90 p-2 backdrop-blur-sm hover:bg-white transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4 text-foreground" />
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
              ${product.price}
            </span>
            <span className="text-xs text-muted-foreground">from</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
