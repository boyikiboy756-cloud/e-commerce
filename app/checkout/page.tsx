'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { formatPHP } from '@/lib/currency'

const STEPS = ['Shipping', 'Payment', 'Review']

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    // Billing
    billingDifferent: false,
    // Payment
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setOrderNumber(`PUR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`)
      setOrderPlaced(true)
    }
  }

  const subtotal = 245
  const tax = 24.50
  const shipping: number = 0
  const total = subtotal + tax + shipping

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="font-serif text-4xl text-foreground">
              Order Confirmed
            </h1>
            <p className="text-foreground/60 text-lg">
              Thank you for your purchase! Your order has been confirmed and will be shipped shortly.
            </p>
            <p className="text-sm text-foreground/50">
              Order #{orderNumber}
            </p>
            <Button size="lg" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/cart" className="inline-flex items-center gap-2 text-accent hover:underline mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                {STEPS.map((s, idx) => (
                  <div key={idx} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        idx <= step
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-foreground/50'
                      }`}
                    >
                      {idx < step ? <Check className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div className="flex-1 mx-2 h-0.5 bg-border" />
                  </div>
                ))}
                <span className="text-sm font-medium text-foreground">
                  {STEPS[step]}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Step */}
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl text-foreground">
                    Shipping Address
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP Code"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="billingDifferent"
                      checked={formData.billingDifferent}
                      onChange={handleChange}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-foreground">
                      Billing address is different
                    </span>
                  </label>
                </div>
              )}

              {/* Payment Step */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl text-foreground">
                    Payment Information
                  </h2>

                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name on Card"
                    value={formData.cardName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />

                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              )}

              {/* Review Step */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl text-foreground">
                    Review Order
                  </h2>

                  <div className="space-y-4 bg-muted p-6 rounded-lg">
                    <div>
                      <p className="text-sm text-foreground/60 mb-2">Shipping To</p>
                      <p className="text-foreground font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {formData.address}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {formData.city}, {formData.state} {formData.zip}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-foreground/60 mb-2">Payment Method</p>
                      <p className="text-foreground font-medium">
                        •••• {formData.cardNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className="ml-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {step === STEPS.length - 1 ? 'Place Order' : 'Continue'}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted rounded-lg p-6 sticky top-24 space-y-6">
              <h2 className="font-serif text-xl text-foreground">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>{formatPHP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPHP(shipping)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Tax</span>
                  <span>{formatPHP(tax)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-serif text-2xl text-foreground">
                    {formatPHP(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
