'use client'

import Image from 'next/image'
import { useState, use } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { formatPHP } from '@/lib/currency'
import { getProductById, products } from '@/lib/products'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = getProductById(id)
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState(product?.images[0] || '')

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

  const relatedProducts = product.relatedProducts
    .map(id => getProductById(id))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-muted border-2 transition-colors ${
                    mainImage === img ? 'border-accent' : 'border-border'
                  }`}
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

          {/* Product Details */}
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
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(product.rating)
                          ? 'text-accent'
                          : 'text-muted'
                      }`}
                    >
                      ★
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
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.ml}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                      selectedSize?.ml === size.ml
                        ? 'bg-accent text-accent-foreground border-accent'
                        : 'bg-background border-border text-foreground hover:border-accent'
                    }`}
                  >
                    {size.ml}ml
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium text-foreground mb-4">Quantity</h3>
              <div className="flex items-center gap-4 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price & Action */}
            <div className="space-y-4">
              <div className="text-3xl font-serif text-foreground">
                {formatPHP((selectedSize?.price || product.price) * quantity)}
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Scent Profile */}
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

              {/* Performance Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Longevity</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < product.longevity ? 'bg-accent' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Intensity</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < product.intensity ? 'bg-accent' : 'bg-muted'
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

      {/* Related Products */}
      <section className="border-t border-border py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl text-foreground mb-12">
            Related Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((prod) => prod && <ProductCard key={prod.id} product={prod} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
