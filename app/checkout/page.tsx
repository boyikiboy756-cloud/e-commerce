'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ChevronLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Spinner } from '@/components/ui/spinner'
import { formatPHP } from '@/lib/currency'
import { ONLINE_PAYMENT_METHODS, useStore } from '@/lib/store-context'
import { isPaymentTestCart } from '@/lib/store-engine'
import { useAuth } from '@/lib/auth-context'
import { toast } from '@/hooks/use-toast'

const STEPS = ['Shipping', 'Payment', 'Review']
const CHECKOUT_SIGN_IN_HREF = '/auth/signin?redirectTo=%2Fcheckout&reason=checkout'
const PAYMONGO_PENDING_CHECKOUT_KEY = 'paymongo-pending-checkout'
const PAYMONGO_PAYMENT_METHOD_VALUE = 'PayMongo'
const PAYMONGO_PAYMENT_METHOD_LABEL = 'PayMongo Checkout'

interface PendingPaymongoCheckout {
  checkoutSessionId: string
  shippingAddress: string
  customerName: string
  customerEmail: string
  reference: string
  notes: string
  paymentMethodLabel?: string
}

function isPaymongoCheckoutMethod(method: string) {
  return method === PAYMONGO_PAYMENT_METHOD_VALUE
}

function getCheckoutPaymentLabel(method: string) {
  return isPaymongoCheckoutMethod(method) ? PAYMONGO_PAYMENT_METHOD_LABEL : method
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cart, getAvailableStock, getInventoryRecord, getProductById, placeOnlineOrder } = useStore()
  const { user, isAuthenticated, canAccessBackoffice, isLoading: authLoading } = useAuth()
  const [step, setStep] = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)
  const paymentVerificationStarted = useRef(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'PH',
    billingDifferent: false,
    paymentMethod: ONLINE_PAYMENT_METHODS[0],
    reference: '',
    notes: '',
  })

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.replace(CHECKOUT_SIGN_IN_HREF)
      return
    }

    if (!user || user.role !== 'USER') {
      router.replace(canAccessBackoffice ? '/admin/dashboard' : '/')
    }
  }, [authLoading, canAccessBackoffice, isAuthenticated, router, user])

  useEffect(() => {
    if (!user) {
      return
    }

    const [firstName = '', ...rest] = user.name.split(' ')
    setFormData((current) => ({
      ...current,
      firstName: current.firstName || firstName,
      lastName: current.lastName || rest.join(' '),
      email: user.email,
    }))
  }, [user])

  const orderItems = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        product: getProductById(item.productId),
      })),
    [cart, getProductById],
  )

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const isTestCart = isPaymentTestCart(cart)
  const shipping = isTestCart ? 0 : subtotal >= 400 || subtotal === 0 ? 0 : 75
  const tax = isTestCart ? 0 : subtotal * 0.12
  const total = subtotal + shipping + tax
  const paymentFlow = searchParams.get('paymongo')
  const hasUnavailableItems = cart.some((item) => {
    const record = getInventoryRecord(item.productId)
    const availableStock = getAvailableStock(item.productId)

    return !record || record.isArchived || availableStock < item.quantity
  })

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target
    setFormData((current) => ({
      ...current,
      [name]:
        type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : value,
    }))
  }

  const buildShippingAddress = () =>
    `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`

  const buildFullName = () => `${formData.firstName} ${formData.lastName}`.trim()

  const storePendingPaymongoCheckout = (checkout: PendingPaymongoCheckout) => {
    if (typeof window === 'undefined') {
      return
    }

    window.sessionStorage.setItem(PAYMONGO_PENDING_CHECKOUT_KEY, JSON.stringify(checkout))
  }

  const readPendingPaymongoCheckout = () => {
    if (typeof window === 'undefined') {
      return null
    }

    const rawValue = window.sessionStorage.getItem(PAYMONGO_PENDING_CHECKOUT_KEY)

    if (!rawValue) {
      return null
    }

    try {
      return JSON.parse(rawValue) as PendingPaymongoCheckout
    } catch {
      return null
    }
  }

  const clearPendingPaymongoCheckout = () => {
    if (typeof window === 'undefined') {
      return
    }

    window.sessionStorage.removeItem(PAYMONGO_PENDING_CHECKOUT_KEY)
  }

  const finalizeOrder = async (pendingCheckout: PendingPaymongoCheckout) => {
    const result = await placeOnlineOrder({
      customerEmail: pendingCheckout.customerEmail,
      customerName: pendingCheckout.customerName,
      notes: [
        pendingCheckout.reference,
        pendingCheckout.notes,
        `PayMongo session: ${pendingCheckout.checkoutSessionId}`,
        pendingCheckout.paymentMethodLabel ? `PayMongo channel: ${pendingCheckout.paymentMethodLabel}` : '',
      ]
        .filter(Boolean)
        .join(' | '),
      paymentMethod: PAYMONGO_PAYMENT_METHOD_VALUE,
      shippingAddress: pendingCheckout.shippingAddress,
    })

    if (!result.ok || !result.data) {
      throw new Error(result.message)
    }

    setOrderNumber(result.data.id)
    setOrderPlaced(true)
    clearPendingPaymongoCheckout()
    router.replace('/checkout')
    toast({
      title: 'Payment confirmed',
      description: `${result.data.id} has been recorded as a paid ${pendingCheckout.paymentMethodLabel ?? 'PayMongo'} order.`,
    })
  }

  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated ||
      !user ||
      user.role !== 'USER' ||
      paymentFlow !== 'success' ||
      paymentVerificationStarted.current
    ) {
      return
    }

    const pendingCheckout = readPendingPaymongoCheckout()

    if (!pendingCheckout?.checkoutSessionId) {
      toast({
        title: 'Missing payment session',
        description: 'We could not find your pending PayMongo checkout session. Please try checking out again.',
        variant: 'destructive',
      })
      router.replace('/checkout')
      return
    }

    paymentVerificationStarted.current = true
    setIsVerifyingPayment(true)

    fetch(`/api/paymongo/checkout/${pendingCheckout.checkoutSessionId}`, {
      method: 'GET',
      cache: 'no-store',
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to verify the PayMongo payment.')
        }

        if (!payload.paid) {
          throw new Error('Your PayMongo payment is still pending or was not completed.')
        }

        await finalizeOrder(pendingCheckout)
      })
      .catch((error) => {
        paymentVerificationStarted.current = false
        toast({
          title: 'Payment verification failed',
          description:
            error instanceof Error
              ? error.message
              : 'We could not confirm your PayMongo payment yet.',
          variant: 'destructive',
        })
      })
      .finally(() => {
        setIsVerifyingPayment(false)
      })
  }, [authLoading, isAuthenticated, paymentFlow, placeOnlineOrder, router, user])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!user) {
      toast({
        title: 'Sign-in required',
        description: 'Sign in before completing your purchase.',
        variant: 'destructive',
      })
      router.replace(CHECKOUT_SIGN_IN_HREF)
      return
    }

    if (step < STEPS.length - 1) {
      setStep((current) => current + 1)
      return
    }

    const shippingAddress = buildShippingAddress()
    const fullName = buildFullName()

    if (isPaymongoCheckoutMethod(formData.paymentMethod)) {
      try {
        setIsSubmittingPayment(true)

        const response = await fetch('/api/paymongo/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerEmail: user.email,
            customerName: fullName,
            reference: formData.reference,
            shippingAddress,
            lineItems: orderItems
              .filter((item) => item.product)
              .map((item) => ({
                name: `${item.product?.name ?? 'Product'} ${item.size}ml`,
                amount: Math.round(item.unitPrice * 100),
                quantity: item.quantity,
                currency: 'PHP',
                description: item.product?.description,
                images:
                  item.product?.images?.[0] && item.product.images[0].startsWith('http')
                    ? [item.product.images[0]]
                    : undefined,
              })),
          }),
        })

        const payload = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to start the PayMongo checkout.')
        }

        if (!payload.checkoutUrl) {
          throw new Error('PayMongo did not return a checkout URL for this session.')
        }

        const paymentMethodLabel =
          typeof payload.paymentMethodLabel === 'string' && payload.paymentMethodLabel.trim().length > 0
            ? payload.paymentMethodLabel
            : 'PayMongo'

        if (payload.requiresManualPaymentConfirmation) {
          const shouldOpenHostedCheckout = window.confirm(
            `${paymentMethodLabel} is currently running in PayMongo test mode. QR Ph test checkouts can still generate scannable QR codes. Continue only if you want to inspect the hosted checkout and you will not complete the payment.`,
          )

          if (!shouldOpenHostedCheckout) {
            toast({
              title: 'PayMongo session created',
              description: `A ${paymentMethodLabel} session is ready, but the hosted checkout was not opened.`,
            })
            return
          }
        }

        storePendingPaymongoCheckout({
          checkoutSessionId: payload.checkoutSessionId,
          customerEmail: user.email,
          customerName: fullName,
          notes: formData.notes,
          paymentMethodLabel,
          reference: formData.reference,
          shippingAddress,
        })

        window.location.href = payload.checkoutUrl
        return
      } catch (error) {
        toast({
          title: 'PayMongo checkout failed',
          description:
            error instanceof Error
              ? error.message
              : 'We could not open the PayMongo checkout.',
          variant: 'destructive',
        })
        return
      } finally {
        setIsSubmittingPayment(false)
      }
    }

    const result = await placeOnlineOrder({
      customerEmail: user.email,
      customerName: fullName,
      notes: [formData.reference, formData.notes].filter(Boolean).join(' | '),
      paymentMethod: formData.paymentMethod as (typeof ONLINE_PAYMENT_METHODS)[number],
      shippingAddress,
    })

    if (!result.ok || !result.data) {
      toast({
        title: 'Checkout failed',
        description: result.message,
        variant: 'destructive',
      })
      return
    }

    setOrderNumber(result.data.id)
    setOrderPlaced(true)
    toast({
      title: 'Order placed',
      description: `${result.data.id} is now in processing.`,
    })
  }

  if (authLoading || !isAuthenticated || !user || user.role !== 'USER' || isVerifyingPayment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="flex items-center gap-3 text-foreground/70">
            <Spinner className="h-5 w-5" />
            <p>
              {isVerifyingPayment
                ? 'Verifying your PayMongo payment...'
                : authLoading
                  ? 'Checking your account...'
                  : 'Redirecting to sign in...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-xl text-foreground/60 mb-6">
            Your cart is empty. Add products before checking out.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">Return to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

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
              Thank you for your purchase. Inventory has been updated and your order is now being processed.
            </p>
            <p className="text-sm text-foreground/50">Order #{orderNumber}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/orders">Track My Order</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
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
          <div className="lg:col-span-2">
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                {STEPS.map((label, index) => (
                  <div key={label} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        index <= step
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-foreground/50'
                      }`}
                    >
                      {index < step ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    <div className="flex-1 mx-2 h-0.5 bg-border" />
                  </div>
                ))}
                <span className="text-sm font-medium text-foreground">
                  {STEPS[step]}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
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
                    required
                    readOnly
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-sm text-foreground/60">
                    Your order confirmation will be sent to your signed-in email.
                  </p>

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
                      placeholder="Province / State"
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
                      <option value="PH">Philippines</option>
                      <option value="SG">Singapore</option>
                      <option value="US">United States</option>
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

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl text-foreground">
                    Payment Method
                  </h2>

                  <div className="grid gap-3">
                    {ONLINE_PAYMENT_METHODS.map((method) => (
                      <label
                        key={method}
                        className={`flex items-center justify-between rounded-lg border px-4 py-4 ${
                          formData.paymentMethod === method
                            ? 'border-accent bg-accent/10'
                            : 'border-border'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-foreground">{getCheckoutPaymentLabel(method)}</p>
                          <p className="text-sm text-foreground/60">
                            {method === 'Cash on Delivery'
                              ? 'Payment is collected when the order arrives.'
                              : 'You will continue to PayMongo using the enabled payment channel on your account. QR Ph is preferred when available.'}
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                      </label>
                    ))}
                  </div>

                  <input
                    type="text"
                    name="reference"
                    placeholder="Reference note for your order (optional)"
                    value={formData.reference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />

                  {isPaymongoCheckoutMethod(formData.paymentMethod) && (
                    <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm text-foreground/75">
                      You will be redirected to the secure PayMongo-hosted checkout after you confirm the order.
                      The checkout uses your account's enabled payment channels and prefers QR Ph when it is available.
                      If the account is still using test keys and only QR Ph is enabled, the app will ask for
                      confirmation before opening the hosted checkout.
                    </div>
                  )}

                  <textarea
                    name="notes"
                    placeholder="Delivery notes or order instructions"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full min-h-28 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}

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
                      <p className="text-sm text-foreground/70">{formData.address}</p>
                      <p className="text-sm text-foreground/70">
                        {formData.city}, {formData.state} {formData.zip}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-foreground/60 mb-2">Payment Method</p>
                      <p className="text-foreground font-medium">{getCheckoutPaymentLabel(formData.paymentMethod)}</p>
                      {isPaymongoCheckoutMethod(formData.paymentMethod) && (
                        <p className="mt-2 text-sm text-foreground/60">
                          PayMongo hosted checkout will use the enabled payment channel on your account. QR Ph is
                          preferred when available.
                        </p>
                      )}
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-foreground/60 mb-2">Items</p>
                      <div className="space-y-2">
                        {orderItems.map((item) =>
                          item.product ? (
                            <div
                              key={`${item.productId}-${item.size}`}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-foreground">
                                {item.product.name} {item.size}ml x{item.quantity}
                              </span>
                              <span className="text-foreground/70">
                                {formatPHP(item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          ) : null,
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((current) => current - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className="ml-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={hasUnavailableItems || isSubmittingPayment}
                >
                  {step === STEPS.length - 1 ? (
                    isSubmittingPayment ? (
                      <span className="inline-flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        Opening PayMongo...
                      </span>
                    ) : isPaymongoCheckoutMethod(formData.paymentMethod) ? (
                      <span className="inline-flex items-center gap-2">
                        Open PayMongo Checkout
                        <ExternalLink className="h-4 w-4" />
                      </span>
                    ) : (
                      'Place Order'
                    )
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>

              {hasUnavailableItems && (
                <p className="text-sm text-destructive">
                  One or more items in your cart are no longer available. Return to the cart to update your order before checkout.
                </p>
              )}
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-muted rounded-lg p-6 sticky top-24 space-y-6">
              <h2 className="font-serif text-xl text-foreground">
                Order Summary
              </h2>

              <div className="space-y-3">
                {orderItems.map((item) =>
                  item.product ? (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex items-center justify-between text-sm text-foreground/70"
                    >
                      <span>
                        {item.product.name} x{item.quantity}
                      </span>
                      <span>{formatPHP(item.unitPrice * item.quantity)}</span>
                    </div>
                  ) : null,
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
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
                {isTestCart && (
                  <p className="text-xs text-accent">
                    Payment test item: tax and shipping waived.
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-serif text-2xl text-foreground">
                    {formatPHP(total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-foreground/50">
                Availability is checked again when you place the order so stock levels stay accurate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
            <div className="flex items-center gap-3 text-foreground/70">
              <Spinner className="h-5 w-5" />
              <p>Loading checkout...</p>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
