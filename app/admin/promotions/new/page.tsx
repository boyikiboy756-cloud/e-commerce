'use client'

import { useRouter } from 'next/navigation'
import { AdminPromotionEditor } from '@/components/admin-promotion-editor'
import { ProtectedRoute } from '@/components/protected-route'
import { toast } from '@/hooks/use-toast'
import {
  createPromotionFromForm,
  getStoredPromotions,
  initialPromotionFormValues,
  saveStoredPromotions,
  type PromotionFormValues,
} from '@/lib/admin-promotions'

export default function NewPromotionPage() {
  const router = useRouter()

  const handleSubmit = async (values: PromotionFormValues) => {
    const nextPromotion = createPromotionFromForm(values)
    const currentPromotions = getStoredPromotions()
    const duplicateCode = currentPromotions.some(
      (promotion) =>
        promotion.code.toLowerCase() === nextPromotion.code.toLowerCase(),
    )

    if (duplicateCode) {
      toast({
        title: 'Promotion code already exists',
        description: 'Choose a different code before saving this promotion.',
        variant: 'destructive',
      })
      return
    }

    saveStoredPromotions([nextPromotion, ...currentPromotions])
    toast({
      title: 'Promotion created',
      description: `${nextPromotion.code} is now available in your promotions list.`,
    })
    router.push('/admin/promotions')
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPromotionEditor
        title="Create Promotion"
        description="Build a discount campaign with clear timing, usage controls, and a code your team can manage easily."
        submitLabel="Save Promotion"
        backHref="/admin/promotions"
        backLabel="Back to Promotions"
        cancelHref="/admin/promotions"
        initialValues={initialPromotionFormValues}
        onSubmit={handleSubmit}
      />
    </ProtectedRoute>
  )
}
