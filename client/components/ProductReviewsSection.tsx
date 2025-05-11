"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ReviewFormDialog } from "@/components/ReviewFormDialog"
import ReviewsList from "@/components/ReviewsList"
import { useToast } from "@/hooks/use-toast"

interface ProductReviewsSectionProps {
  productId: string
  productName: string
}

export default function ProductReviewsSection({ productId, productName }: ProductReviewsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getToken, isSignedIn } = useAuth()
  const { toast } = useToast()

  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      setIsSubmitting(true)
      
      if (!isSignedIn) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit a review",
          variant: "destructive"
        })
        return
      }
      
      const token = await getToken()
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
          reviewType: 'product' // This is a product review
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit review')
      }
      
      // Close the dialog
      setIsDialogOpen(false)
      
      // Show success message
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
        variant: "default"
      })
      
      // Force a refresh of the reviews list
      // This is a simple way to refresh - in a real app, you might want to use a more efficient approach
      window.location.reload()
      
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error",
        description: "There was a problem submitting your review. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <Button onClick={() => setIsDialogOpen(true)} disabled={isSubmitting}>
          Write a Review
        </Button>
      </div>
      
      <ReviewsList productId={productId} />
      
      <ReviewFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitReview}
        productName={productName}
      />
    </div>
  )
}
