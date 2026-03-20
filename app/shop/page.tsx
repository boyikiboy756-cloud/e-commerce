'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { formatPHP } from '@/lib/currency'
import { products } from '@/lib/products'
import { Button } from '@/components/ui/button'

const SCENT_FAMILIES = ['Floral', 'Woody', 'Fresh', 'Citrus', 'Oriental', 'Spicy', 'Aquatic', 'Aromatic']
const GENDERS = ['Male', 'Female', 'Unisex']
const PRICE_RANGES = [
  { min: 0, max: 100 },
  { min: 100, max: 200 },
  { min: 200, max: Infinity },
]

export default function ShopPage() {
  const [selectedScents, setSelectedScents] = useState<string[]>([])
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(true)

  // Filter products
  let filtered = products.filter((product) => {
    if (selectedScents.length > 0) {
      const hasScent = product.scentFamily.some(f =>
        selectedScents.includes(f)
      )
      if (!hasScent) return false
    }

    if (selectedGenders.length > 0) {
      if (!selectedGenders.includes(product.gender.charAt(0).toUpperCase() + product.gender.slice(1))) {
        return false
      }
    }

    if (priceRange) {
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false
      }
    }

    return true
  })

  // Sort products
  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  } else if (sortBy === 'new') {
    filtered = [...filtered].sort((a, b) => (b.isNewArrival ? 1 : -1))
  }

  const toggleScent = (scent: string) => {
    setSelectedScents(prev =>
      prev.includes(scent)
        ? prev.filter(s => s !== scent)
        : [...prev, scent]
    )
  }

  const toggleGender = (gender: string) => {
    setSelectedGenders(prev =>
      prev.includes(gender)
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="border-b border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl text-foreground mb-2">
            Shop Fragrances
          </h1>
          <p className="text-foreground/60">
            Discover our complete collection of luxury fragrances
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="font-serif text-lg text-foreground mb-4">Filters</h3>
              </div>

              {/* Scent Family */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Scent Family</h4>
                <div className="space-y-2">
                  {SCENT_FAMILIES.map((scent) => (
                    <label key={scent} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedScents.includes(scent)}
                        onChange={() => toggleScent(scent)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-foreground/70 hover:text-foreground">
                        {scent}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Gender</h4>
                <div className="space-y-2">
                  {GENDERS.map((gender) => (
                    <label key={gender} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(gender)}
                        onChange={() => toggleGender(gender)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-foreground/70 hover:text-foreground">
                        {gender}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Price Range</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={`${range.min}-${range.max}`} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={
                          priceRange?.min === range.min &&
                          priceRange?.max === range.max
                        }
                        onChange={() => setPriceRange({ min: range.min, max: range.max })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground/70 hover:text-foreground">
                        {range.min === 0
                          ? `Under ${formatPHP(range.max)}`
                          : range.max === Infinity
                            ? `${formatPHP(range.min)}+`
                            : `${formatPHP(range.min)} - ${formatPHP(range.max)}`}
                      </span>
                    </label>
                  ))}
                  {priceRange && (
                    <button
                      onClick={() => setPriceRange(null)}
                      className="text-sm text-accent hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedScents.length > 0 || selectedGenders.length > 0 || priceRange) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedScents([])
                    setSelectedGenders([])
                    setPriceRange(null)
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort & View Options */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <p className="text-sm text-foreground/60">
                Showing {filtered.length} products
              </p>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2 bg-background text-foreground border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="featured">Featured</option>
                  <option value="new">New Arrivals</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground pointer-events-none" />
              </div>
            </div>

            {/* Products */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-foreground/60 mb-4">No products found</p>
                <p className="text-sm text-foreground/50 mb-6">
                  Try adjusting your filters
                </p>
                <Button
                  onClick={() => {
                    setSelectedScents([])
                    setSelectedGenders([])
                    setPriceRange(null)
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
