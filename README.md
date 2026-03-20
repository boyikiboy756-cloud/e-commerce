# SPRAY & SNIFF - Luxury Fragrance eCommerce Platform

A complete luxury fragrance eCommerce platform built with Next.js, featuring both customer-facing and admin-facing experiences.

## Features

### Customer Experience
- **Homepage & Collections**: Discover featured fragrances and curated collections
- **Product Browsing**: Advanced filtering by scent family, gender, price, and more
- **Product Details**: Detailed scent profiles with notes breakdown, intensity/longevity indicators
- **Shopping Cart**: Full cart management with quantity control
- **Checkout**: Multi-step checkout with shipping, billing, and payment
- **Wishlist**: Save favorite fragrances for later
- **Authentication**: Sign in/Sign up pages
- **Account Management**: User profiles and order tracking
- **Discovery Quiz**: Personalized fragrance recommendations
- **Support**: FAQ and contact pages

### Admin Experience
- **Dashboard**: Overview of sales, orders, customers, and performance KPIs
- **Products Management**: Create, edit, and manage product listings
- **Inventory Management**: Track stock levels and manage availability
- **Orders Management**: Process and track customer orders
- **Customer Management**: View customer profiles and purchase history
- **Promotions**: Create and manage discount codes and campaigns
- **Collections**: Manage product collections and categories
- **Analytics**: Sales trends and performance metrics (template included)

## Design System

### Color Palette
- **Primary**: Warm Gold/Rose (#b89968) - Accent color for CTAs and highlights
- **Neutral**: Warm Taupes & Creams - Sophisticated background and text
- **Dark**: Deep Charcoal (#332d29) - Primary text color
- **Light**: Creamy Ivory (#faf8f5) - Main background

### Typography
- **Headings**: Playfair Display (Serif) - Elegant luxury feel
- **Body**: Geist (Sans-serif) - Clean, readable text

### Components
- Built with Radix UI and shadcn/ui
- Responsive design with Tailwind CSS
- Smooth animations for luxury aesthetic

## Project Structure

```
app/
├── page.tsx                      # Homepage
├── about/page.tsx               # About page
├── collections/page.tsx         # Collections listing
├── shop/page.tsx                # Product shop with filters
├── products/[id]/page.tsx       # Product detail page
├── cart/page.tsx                # Shopping cart
├── checkout/page.tsx            # Checkout flow
├── wishlist/page.tsx            # Saved favorites
├── auth/
│   ├── signin/page.tsx          # Sign in
│   └── signup/page.tsx          # Sign up
├── help/
│   └── faq/page.tsx             # FAQ
├── admin/
│   ├── login/page.tsx           # Admin login
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── products/page.tsx        # Product management
│   ├── orders/page.tsx          # Order management
│   ├── customers/page.tsx       # Customer management
│   └── promotions/page.tsx      # Promotions management
├── layout.tsx                   # Root layout
└── globals.css                  # Global styles

components/
├── header.tsx                   # Navigation header
├── product-card.tsx             # Product card component
└── ui/                          # shadcn/ui components

lib/
└── products.ts                  # Product data and utilities

public/
├── hero-banner.jpg              # Hero image
└── products/                    # Product images
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. Clone or download the project
2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app

### Building for Production

```bash
pnpm build
pnpm start
```

## Key Pages & Routes

### Customer Routes
- `/` - Homepage
- `/about` - Brand story
- `/collections` - Collections listing
- `/shop` - Product shop with filtering
- `/products/[id]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/wishlist` - Wishlist
- `/auth/signin` - Sign in
- `/auth/signup` - Sign up
- `/help/faq` - FAQ

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/promotions` - Promotions

## Demo Credentials

Admin access:
- Email: `admin@pureimage.com`
- Password: `demo1234`

## Sample Data

The project includes 8 premium fragrance products with:
- Multiple sizes and pricing
- Detailed scent profiles (top, heart, base notes)
- Ratings and reviews
- Gender and occasion tags
- Longevity and intensity indicators
- Related product recommendations

## Customization

### Adding Products
Edit `lib/products.ts` to add more fragrances:
```typescript
{
  id: 'unique-id',
  name: 'Fragrance Name',
  brand: 'SPRAY & SNIFF',
  description: 'Description',
  price: 185,
  // ... other properties
}
```

### Updating Colors
Edit the design tokens in `app/globals.css`:
```css
:root {
  --primary: oklch(0.7 0.12 45); /* Warm gold */
  --background: oklch(0.99 0.01 50); /* Creamy ivory */
  /* ... other colors */
}
```

### Modifying Layout
The layout structure is in `components/header.tsx` and can be customized with your branding and navigation.

## Technologies Used

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4.2
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Database Ready**: Schema defined, ready for integration (Supabase, Neon, etc.)
- **Auth Ready**: Login pages ready for Auth.js or Supabase Auth integration
- **Payments Ready**: Checkout flow ready for Stripe integration

## Integration Ready

This platform is built to integrate with:
- **Authentication**: Supabase Auth, Auth.js, or custom auth
- **Database**: Supabase, Neon PostgreSQL, or any backend
- **Payments**: Stripe integration
- **Email**: SendGrid, Mailgun, or similar
- **Images**: Vercel Blob or any CDN
- **Analytics**: Vercel Analytics, Google Analytics

## Performance Features

- Image optimization with Next.js Image component
- Responsive design mobile-first approach
- Smooth animations and transitions
- Accessible components with proper ARIA labels
- SEO-optimized metadata

## License

Created with v0.app

## Support

For questions or issues, please contact support or check the FAQ page in the application.
