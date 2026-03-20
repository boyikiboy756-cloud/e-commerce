import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { SITE_NAME } from '@/lib/site'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative h-96 w-full overflow-hidden bg-muted">
        <Image
          src="/hero-banner.jpg"
          alt={`${SITE_NAME} story`}
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl text-white">Our Story</h1>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        {/* Philosophy */}
        <section className="space-y-6">
          <div>
            <p className="text-sm font-medium text-accent uppercase tracking-wide mb-2">
              Our Philosophy
            </p>
            <h2 className="font-serif text-4xl text-foreground mb-4">
              {SITE_NAME}
            </h2>
          </div>

          <p className="text-lg text-foreground/70 leading-relaxed">
            Spray &amp; Sniff is a boutique fragrance destination located in
            Mabini, specializing in curated scents and premium inspired-by
            perfumes.
          </p>

          <p className="text-lg text-foreground/70 leading-relaxed">
            The store is founded on the idea that a great scent is the most
            invisible yet powerful part of an outfit. That belief inspired the
            name itself, inviting customers to experience the immediate spray
            and the lingering sniff of a high-quality fragrance.
          </p>
        </section>

        {/* Values */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-foreground">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="font-serif text-xl text-foreground">Quality</h3>
              <p className="text-foreground/70">
                We never compromise on quality. Every ingredient is carefully selected and tested to ensure the highest standards.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl text-foreground">Sustainability</h3>
              <p className="text-foreground/70">
                Our commitment to the environment is reflected in our sustainable sourcing practices and eco-friendly packaging.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl text-foreground">Innovation</h3>
              <p className="text-foreground/70">
                We continuously innovate, blending traditional perfumery techniques with modern expertise to create unique fragrances.
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl text-foreground">Our Process</h2>

          <div className="space-y-6">
            <div className="border-l-2 border-accent pl-6 py-2">
              <h3 className="font-serif text-lg text-foreground mb-2">1. Sourcing</h3>
              <p className="text-foreground/70">
                We work directly with suppliers to source premium ingredients from the finest locations worldwide.
              </p>
            </div>

            <div className="border-l-2 border-accent pl-6 py-2">
              <h3 className="font-serif text-lg text-foreground mb-2">2. Conception</h3>
              <p className="text-foreground/70">
                Our master perfumers conceive each fragrance, crafting unique olfactory experiences.
              </p>
            </div>

            <div className="border-l-2 border-accent pl-6 py-2">
              <h3 className="font-serif text-lg text-foreground mb-2">3. Testing</h3>
              <p className="text-foreground/70">
                Every batch undergoes rigorous testing to ensure consistency, quality, and longevity.
              </p>
            </div>

            <div className="border-l-2 border-accent pl-6 py-2">
              <h3 className="font-serif text-lg text-foreground mb-2">4. Bottling</h3>
              <p className="text-foreground/70">
                Each fragrance is carefully bottled in sustainable packaging, ready for its journey to you.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 bg-muted rounded-lg p-12">
          <h2 className="font-serif text-3xl text-foreground">
            Discover Your Signature Scent
          </h2>
          <p className="text-lg text-foreground/70">
            Explore our complete collection and find the fragrance that speaks to you.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">Shop Now</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
