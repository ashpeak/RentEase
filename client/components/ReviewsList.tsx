"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface Reviewer {
  name: string
  avatar?: string | null
  initials: string
}

interface Review {
  id: string
  reviewer: Reviewer
  rating: number
  date: string
  comment: string
}

interface ReviewSummary {
  count: number
  average: number
  distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

interface ReviewsListProps {
  productId: string
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<ReviewSummary>({
    count: 0,
    average: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${productId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }
        
        const data = await response.json()
        setReviews(data.reviews)
        setSummary(data.summary)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError("Could not load reviews. Please try again later.")
        setLoading(false)
      }
    }
    
    if (productId) {
      fetchReviews()
    }
  }, [productId])

  // Calculate percentage for each star rating
  const getPercentage = (count: number) => {
    if (summary.count === 0) return 0
    return (count / summary.count) * 100
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>Loading reviews...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardDescription>
          {summary.count > 0 ? `${summary.count} reviews for this product` : "No reviews yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summary.count > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-4xl font-bold">{summary.average.toFixed(1)}</span>
                <div className="flex flex-col">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(summary.average) 
                            ? "fill-primary text-primary" 
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{summary.count} reviews</span>
                </div>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <div className="flex items-center w-12">
                      <span>{star}</span>
                      <Star className="h-4 w-4 ml-1 fill-primary text-primary" />
                    </div>
                    <Progress value={getPercentage(summary.distribution[star as 1|2|3|4|5])} className="h-2" />
                    <span className="text-sm w-10 text-right">
                      {summary.distribution[star as 1|2|3|4|5]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={review.reviewer.avatar || "/placeholder.svg"} alt={review.reviewer.name} />
                        <AvatarFallback>{review.reviewer.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.reviewer.name}</div>
                        <div className="text-xs text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm">{review.comment}</p>
                    {review !== reviews[reviews.length - 1] && <Separator className="mt-4" />}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews for this product yet. Be the first to leave a review!
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No reviews for this product yet. Be the first to leave a review!
          </div>
        )}
      </CardContent>
    </Card>
  )
}
