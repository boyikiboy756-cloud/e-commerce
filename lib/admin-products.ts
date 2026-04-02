import type { Product } from '@/lib/products'
import { products } from '@/lib/products'
import { SITE_NAME } from '@/lib/site'

export const ADMIN_PRODUCTS_STORAGE_KEY = 'admin-products'

export const PRODUCT_CATEGORIES = [
  'Eau de Parfum',
  'Eau de Toilette',
  'Extrait de Parfum',
  'Cologne',
  'Body Mist',
] as const

export interface ProductFormValues {
  name: string
  brand: string
  description: string
  category: string
  gender: Product['gender']
  price: string
  sizeMl: string
  scentFamily: string
  topNotes: string
  middleNotes: string
  baseNotes: string
  occasions: string
  seasons: string
  uploadedImage: string
  featured: boolean
  isNewArrival: boolean
  inStock: boolean
  stockQuantity: string
  reorderPoint: string
  storageLocation: string
}

export const initialProductFormValues: ProductFormValues = {
  name: '',
  brand: SITE_NAME,
  description: '',
  category: PRODUCT_CATEGORIES[0],
  gender: 'unisex',
  price: '',
  sizeMl: '50',
  scentFamily: '',
  topNotes: '',
  middleNotes: '',
  baseNotes: '',
  occasions: 'Day, Evening',
  seasons: 'All Seasons',
  uploadedImage: '',
  featured: false,
  isNewArrival: true,
  inStock: true,
  stockQuantity: '12',
  reorderPoint: '3',
  storageLocation: 'A1-01',
}

function parseList(value: string, fallback: string[]): string[] {
  const parsed = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return parsed.length > 0 ? parsed : fallback
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getStoredAdminProducts(): Product[] {
  if (typeof window === 'undefined') {
    return products
  }

  try {
    const storedProducts = window.localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY)

    if (!storedProducts) {
      return products
    }

    const parsedProducts = JSON.parse(storedProducts)
    return Array.isArray(parsedProducts) ? parsedProducts : products
  } catch {
    return products
  }
}

export function saveStoredAdminProducts(nextProducts: Product[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    ADMIN_PRODUCTS_STORAGE_KEY,
    JSON.stringify(nextProducts),
  )
}

export function createProductFromForm(values: ProductFormValues): Product {
  const price = Number(values.price)
  const sizeMl = Number(values.sizeMl)
  const timestamp = Date.now()
  const slugBase = slugify(values.name) || `product-${timestamp}`

  return {
    id: `${slugBase}-${timestamp}`,
    name: values.name.trim(),
    brand: values.brand.trim(),
    description: values.description.trim(),
    price,
    category: values.category,
    scentFamily: parseList(values.scentFamily, ['Signature']),
    gender: values.gender,
    topNotes: parseList(values.topNotes, ['Signature Opening']),
    middleNotes: parseList(values.middleNotes, ['Heart Accord']),
    baseNotes: parseList(values.baseNotes, ['Soft Musk']),
    longevity: 4,
    intensity: 3,
    sizes: [
      {
        ml: sizeMl,
        price,
      },
    ],
    images: [values.uploadedImage.trim() || '/placeholder.jpg'],
    rating: 5,
    reviewCount: 0,
    inStock: values.inStock,
    featured: values.featured,
    isNewArrival: values.isNewArrival,
    occasions: parseList(values.occasions, ['Day']),
    seasons: parseList(values.seasons, ['All Seasons']),
    relatedProducts: [],
  }
}
