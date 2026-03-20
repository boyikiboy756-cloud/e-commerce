import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { getFeaturedProducts, getNewArrivals } from '@/lib/products'
import { SITE_NAME } from '@/lib/site'

export default function Home() {
  const featured = getFeaturedProducts()
  const newArrivals = getNewArrivals()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/hero-banner.jpg"
          alt="Luxury perfume collection"
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="max-w-2xl text-center space-y-6 px-6">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white font-light tracking-tight">
              Discover Your Scent
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-light">
              Crafted with the finest ingredients from around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                asChild
              >
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/discovery">Take the Quiz</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-wide mb-2">
            Collection
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
            Featured Fragrances
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Explore our carefully curated selection of premium fragrances
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-muted py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-background">
          <Image
            src="/hero-banner.jpg"
            alt="Brand story"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-accent uppercase tracking-wide mb-2">
                Our Story
              </p>
              <h2 className="font-serif text-4xl text-foreground mb-4">
                {SITE_NAME} Philosophy
              </h2>
            </div>
            
            <p className="text-foreground/70 text-lg leading-relaxed">
              Since our founding, {SITE_NAME} has been dedicated to creating exceptional fragrances that tell a story. Each scent is meticulously crafted using the finest ingredients sourced from around the world.
            </p>
            
            <p className="text-foreground/70 text-lg leading-relaxed">
              We believe that fragrance is a form of self-expression, a personal signature that reflects who you are. Our commitment to quality and sustainability drives every decision we make.
            </p>

            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-wide mb-2">
            Latest
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
            New Arrivals
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Discover what's new in our collection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-foreground text-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl mb-4">
              Stay Updated
            </h2>
            <p className="text-background/80 text-lg">
              Subscribe to receive exclusive offers and new fragrance launches
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              suppressHydrationWarning
              className="flex-1 px-4 py-3 bg-background text-foreground placeholder:text-foreground/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-lg text-foreground mb-4">
                {SITE_NAME}
              </h3>
              <p className="text-foreground/60 text-sm">
                Crafting premium fragrances since 2010
              </p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-4 text-sm">Shop</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="/shop" className="hover:text-accent">All Fragrances</Link></li>
                <li><Link href="/collections" className="hover:text-accent">Collections</Link></li>
                <li><Link href="/discovery" className="hover:text-accent">Discovery Quiz</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="/about" className="hover:text-accent">About</Link></li>
                <li><Link href="/help/contact" className="hover:text-accent">Contact</Link></li>
                <li><Link href="/help/faq" className="hover:text-accent">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="/help/shipping" className="hover:text-accent">Shipping</Link></li>
                <li><Link href="/help/returns" className="hover:text-accent">Returns</Link></li>
                <li><Link href="/help/contact" className="hover:text-accent">Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/60">
              © 2024 {SITE_NAME}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button
                type="button"
                suppressHydrationWarning
                className="text-sm text-foreground/60 hover:text-accent"
              >
                Privacy
              </button>
              <button
                type="button"
                suppressHydrationWarning
                className="text-sm text-foreground/60 hover:text-accent"
              >
                Terms
              </button>
              <button
                type="button"
                suppressHydrationWarning
                className="text-sm text-foreground/60 hover:text-accent"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
