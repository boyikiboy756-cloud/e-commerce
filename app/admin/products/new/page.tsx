'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  PRODUCT_CATEGORIES,
  createProductFromForm,
  getStoredAdminProducts,
  initialProductFormValues,
  saveStoredAdminProducts,
  type ProductFormValues,
} from '@/lib/admin-products'
import { SITE_NAME } from '@/lib/site'
import { toast } from '@/hooks/use-toast'

type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>

export default function NewProductPage() {
  const router = useRouter()
  const [formValues, setFormValues] = useState<ProductFormValues>(
    initialProductFormValues,
  )
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, type } = event.target
    const nextValue =
      type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
        : event.target.value

    setFormValues((current) => ({
      ...current,
      [name]: nextValue,
    }))

    setErrors((current) => {
      if (!current[name as keyof ProductFormValues]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[name as keyof ProductFormValues]
      return nextErrors
    })
  }

  const validateForm = (): ProductFormErrors => {
    const nextErrors: ProductFormErrors = {}

    if (!formValues.name.trim()) {
      nextErrors.name = 'Product name is required.'
    }

    if (!formValues.brand.trim()) {
      nextErrors.brand = 'Brand is required.'
    }

    if (!formValues.description.trim()) {
      nextErrors.description = 'Description is required.'
    }

    if (!formValues.price.trim()) {
      nextErrors.price = 'Base price is required.'
    } else if (Number(formValues.price) <= 0) {
      nextErrors.price = 'Base price must be greater than 0.'
    }

    if (!formValues.sizeMl.trim()) {
      nextErrors.sizeMl = 'Size is required.'
    } else if (Number(formValues.sizeMl) <= 0) {
      nextErrors.sizeMl = 'Size must be greater than 0.'
    }

    return nextErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const newProduct = createProductFromForm(formValues)
      const existingProducts = getStoredAdminProducts()

      saveStoredAdminProducts([newProduct, ...existingProducts])

      toast({
        title: 'Product created',
        description: `${newProduct.name} is now available in the admin catalog.`,
      })

      router.push('/admin/products')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <div className="flex-1">
          <div className="border-b border-border bg-card">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="mb-4 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/products" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Products
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="font-serif text-3xl text-foreground">
                    Create Product
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-foreground/60">
                    Demo mode stores products in this browser only, so your new
                    item will appear immediately in the admin catalog on this
                    device.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
                <section className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-6">
                    <h2 className="font-serif text-xl text-foreground">
                      Product Details
                    </h2>
                    <p className="mt-1 text-sm text-foreground/60">
                      Add the main content your customers will see.
                    </p>
                  </div>

                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formValues.name}
                        onChange={handleChange}
                        placeholder="Velvet Ember"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name ? (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      ) : null}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          name="brand"
                          value={formValues.brand}
                          onChange={handleChange}
                          placeholder={SITE_NAME}
                          aria-invalid={!!errors.brand}
                        />
                        {errors.brand ? (
                          <p className="text-sm text-destructive">{errors.brand}</p>
                        ) : null}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          name="category"
                          value={formValues.category}
                          onChange={handleChange}
                          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                          {PRODUCT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        placeholder="A warm amber fragrance with glowing spice and smooth woods."
                        aria-invalid={!!errors.description}
                      />
                      {errors.description ? (
                        <p className="text-sm text-destructive">
                          {errors.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                      <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <select
                          id="gender"
                          name="gender"
                          value={formValues.gender}
                          onChange={handleChange}
                          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="unisex">Unisex</option>
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="price">Base Price</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="1"
                          step="0.01"
                          value={formValues.price}
                          onChange={handleChange}
                          placeholder="185"
                          aria-invalid={!!errors.price}
                        />
                        {errors.price ? (
                          <p className="text-sm text-destructive">{errors.price}</p>
                        ) : null}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="sizeMl">Primary Size (ml)</Label>
                        <Input
                          id="sizeMl"
                          name="sizeMl"
                          type="number"
                          min="1"
                          step="1"
                          value={formValues.sizeMl}
                          onChange={handleChange}
                          placeholder="50"
                          aria-invalid={!!errors.sizeMl}
                        />
                        {errors.sizeMl ? (
                          <p className="text-sm text-destructive">{errors.sizeMl}</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        name="image"
                        value={formValues.image}
                        onChange={handleChange}
                        placeholder="/products/velvet-spice-1.jpg"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-6">
                    <h2 className="font-serif text-xl text-foreground">
                      Merchandising
                    </h2>
                    <p className="mt-1 text-sm text-foreground/60">
                      Optional comma-separated notes help the product detail
                      page feel complete.
                    </p>
                  </div>

                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="scentFamily">Scent Family</Label>
                      <Input
                        id="scentFamily"
                        name="scentFamily"
                        value={formValues.scentFamily}
                        onChange={handleChange}
                        placeholder="Amber, Woody, Spicy"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="topNotes">Top Notes</Label>
                      <Input
                        id="topNotes"
                        name="topNotes"
                        value={formValues.topNotes}
                        onChange={handleChange}
                        placeholder="Pink Pepper, Mandarin"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="middleNotes">Heart Notes</Label>
                      <Input
                        id="middleNotes"
                        name="middleNotes"
                        value={formValues.middleNotes}
                        onChange={handleChange}
                        placeholder="Saffron, Rose"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="baseNotes">Base Notes</Label>
                      <Input
                        id="baseNotes"
                        name="baseNotes"
                        value={formValues.baseNotes}
                        onChange={handleChange}
                        placeholder="Amberwood, Vanilla"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="occasions">Occasions</Label>
                      <Input
                        id="occasions"
                        name="occasions"
                        value={formValues.occasions}
                        onChange={handleChange}
                        placeholder="Evening, Date Night"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="seasons">Seasons</Label>
                      <Input
                        id="seasons"
                        name="seasons"
                        value={formValues.seasons}
                        onChange={handleChange}
                        placeholder="Fall, Winter"
                      />
                    </div>

                    <div className="space-y-3 rounded-lg border border-dashed border-border p-4">
                      <label className="flex items-center gap-3 text-sm text-foreground">
                        <input
                          type="checkbox"
                          name="inStock"
                          checked={formValues.inStock}
                          onChange={handleChange}
                          className="h-4 w-4 rounded"
                        />
                        In stock
                      </label>

                      <label className="flex items-center gap-3 text-sm text-foreground">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formValues.featured}
                          onChange={handleChange}
                          className="h-4 w-4 rounded"
                        />
                        Feature on the storefront
                      </label>

                      <label className="flex items-center gap-3 text-sm text-foreground">
                        <input
                          type="checkbox"
                          name="isNewArrival"
                          checked={formValues.isNewArrival}
                          onChange={handleChange}
                          className="h-4 w-4 rounded"
                        />
                        Mark as new arrival
                      </label>
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-foreground/60">
                  Required fields: name, brand, description, price, and size.
                </p>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/products">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
