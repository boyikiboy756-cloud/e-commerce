'use client'

import Image from 'next/image'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { useAuth } from '@/lib/auth-context'
import { formatPHP } from '@/lib/currency'
import { useStore } from '@/lib/store-context'
import { toast } from '@/hooks/use-toast'

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const {
    addToCart,
    getAvailabilityStatus,
    getAvailableStock,
    getInventoryRecord,
    getProductById,
    isWishlisted,
    toggleWishlist,
  } = useStore()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const product = getProductById(id)
  const inventoryRecord = getInventoryRecord(id)
  const isArchived = inventoryRecord?.isArchived ?? false
  const [selectedSizeMl, setSelectedSizeMl] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    if (!product) {
      return
    }

    setSelectedSizeMl(product.sizes[0]?.ml ?? null)
    setMainImage(product.images[0] ?? '')
    setQuantity(1)
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-40">
          <p className="text-xl text-foreground/60">Product not found</p>
        </div>
      </div>
    )
  }

  const selectedSize =
    product.sizes.find((size) => size.ml === selectedSizeMl) ?? product.sizes[0]
  const availableStock = getAvailableStock(product.id)
  const availability = getAvailabilityStatus(product.id)
  const displayAvailability = isArchived ? 'Archived' : availability
  const relatedProducts = product.relatedProducts
    .map((productId) => getProductById(productId))
    .filter((relatedProduct) =>
      relatedProduct ? !getInventoryRecord(relatedProduct.id)?.isArchived : false,
    )
  const availabilityTone =
    isArchived
      ? 'bg-slate-200 text-slate-700'
      : availability === 'In Stock'
      ? 'bg-green-100 text-green-700'
      : availability === 'Low Stock'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700'
  const canShop = isAuthenticated && user?.role === 'USER'
  const authRedirectHref = `/auth/signin?redirectTo=${encodeURIComponent(`/products/${product.id}`)}`
  const registerRedirectHref = `/auth/signup?redirectTo=${encodeURIComponent(`/products/${product.id}`)}`

  const handleAddToCart = async () => {
    setIsAddingToCart(true)

    try {
      const result = await addToCart({
        productId: product.id,
        quantity,
        size: selectedSize.ml,
        unitPrice: selectedSize.price,
      })

      toast({
        title: result.ok ? 'Cart updated' : 'Unable to add item',
        description: result.message,
        variant: result.ok ? 'default' : 'destructive',
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = async () => {
    const result = await toggleWishlist(product.id)
    toast({
      title: result.ok ? 'Wishlist updated' : 'Unable to update wishlist',
      description: result.message,
      variant: result.ok ? 'default' : 'destructive',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={mainImage || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setMainImage(img)}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-muted border-2 transition-colors ${
                    (mainImage || product.images[0]) === img ? 'border-accent' : 'border-border'
                  }`}
                  aria-label={`View product image ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium text-accent uppercase tracking-wide mb-2">
                {product.brand}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`text-lg ${
                        index < Math.floor(product.rating) ? 'text-accent' : 'text-muted'
                      }`}
                    >
                      *
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${availabilityTone}`}>
                  {displayAvailability}
                </span>
                <p className="text-sm text-foreground/60">
                  {isArchived
                    ? 'This product has been archived and is no longer available for checkout or POS sales.'
                    : availability === 'Out of Stock'
                    ? 'Inventory is currently unavailable for online and in-store sales.'
                    : `${availableStock} unit(s) available across the store.`}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.ml}
                    type="button"
                    onClick={() => setSelectedSizeMl(size.ml)}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                      selectedSize.ml === size.ml
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'bg-background border-border text-foreground hover:border-accent'
                    }`}
                  >
                    {size.ml}ml
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-4">Quantity</h3>
              <div className="flex items-center gap-4 w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(Math.max(1, availableStock), quantity + 1))}
                  disabled={availableStock === 0}
                  className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {availableStock > 0 && (
                <p className="mt-2 text-sm text-foreground/60">
                  Max available right now: {availableStock}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-serif text-foreground">
                {formatPHP(selectedSize.price * quantity)}
              </div>

              {canShop ? (
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => void handleAddToCart()}
                    disabled={availableStock === 0 || isArchived || isAddingToCart}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {isArchived
                      ? 'Archived'
                      : availableStock === 0
                        ? 'Out of Stock'
                        : isAddingToCart
                          ? 'Adding...'
                          : 'Add to Cart'}
                  </Button>
                  <Button size="lg" variant="outline" className="px-6" onClick={() => void handleWishlist()}>
                    <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[28px] border border-border/70 bg-gradient-to-br from-card via-background to-muted/50 shadow-[0_24px_60px_rgba(88,72,58,0.08)]">
                  <div className="border-b border-border/60 px-6 py-4 sm:px-7">
                    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
                      Member Checkout
                    </p>
                  </div>
                  <div className="space-y-5 px-6 py-6 sm:px-7 sm:py-7">
                    <div className="space-y-2">
                      <h2 className="font-serif text-3xl text-foreground">
                        Sign in to purchase
                      </h2>
                      <p className="max-w-md text-sm leading-6 text-foreground/65">
                        Create an account or sign in to add this fragrance to your cart and continue to checkout.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                    {authLoading ? (
                      <>
                        <Button className="h-12 sm:flex-1" disabled>
                          Checking account...
                        </Button>
                        <Button variant="outline" className="h-12 sm:flex-1" disabled>
                          Create Account
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="h-12 sm:flex-1" asChild>
                          <Link href={authRedirectHref}>Sign In</Link>
                        </Button>
                        <Button variant="outline" className="h-12 sm:flex-1 border-border/80 bg-background/70" asChild>
                          <Link href={registerRedirectHref}>Create Account</Link>
                        </Button>
                      </>
                    )}
                    </div>
                    <p className="text-xs tracking-[0.16em] text-foreground/45 uppercase">
                      Fast checkout, order tracking, and saved details.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-8 space-y-6">
              <h3 className="font-serif text-xl text-foreground">Scent Profile</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Top Notes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.topNotes.map((note) => (
                      <span key={note} className="bg-muted px-3 py-1 rounded-full text-sm text-foreground">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Heart Notes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.middleNotes.map((note) => (
                      <span key={note} className="bg-muted px-3 py-1 rounded-full text-sm text-foreground">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Base Notes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.baseNotes.map((note) => (
                      <span key={note} className="bg-muted px-3 py-1 rounded-full text-sm text-foreground">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Longevity</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full ${
                          index < Math.ceil(product.longevity / 2) ? 'bg-accent' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Intensity</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full ${
                          index < product.intensity ? 'bg-accent' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Gender</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {product.gender}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-border py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl text-foreground mb-12">
            Related Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(
              (relatedProduct) =>
                relatedProduct && (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ),
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
