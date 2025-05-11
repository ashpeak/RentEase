"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarRange, Check, ChevronRight, Clock, MessagesSquare, Star, X, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@clerk/nextjs"

// Define interfaces based on the database schema
interface User {
  _id: string
  name: string
  email: string
  profileImage: string
  clerkId?: string
}

interface Product {
  _id: string
  title: string
  description: string
  images: string[]
  rate: number
  status: string
  averageRating?: number
  numReviews?: number
}

interface Order {
  _id: string
  orderNumber: string
  renter: User
  product: Product
  owner: User
  startDate: string
  endDate: string
  totalDays: number
  rentalRate: number
  totalAmount: number
  status: string
  isReviewed: boolean
}

interface Review {
  reviewer: string
  product: string
  rating: number
  comment: string
  reviewType: string
}

export default function RentalsPage() {
  const [activeRentals, setActiveRentals] = useState<Order[]>([])
  const [pendingRentals, setPendingRentals] = useState<Order[]>([])
  const [completedRentals, setCompletedRentals] = useState<Order[]>([])
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [currentRentalForReview, setCurrentRentalForReview] = useState<Order | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviewType, setReviewType] = useState("product")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const { user } = useUser()
  const { toast } = useToast()

  // Function to calculate days left in an active rental
  const calculateDaysLeft = (endDate: string): number => {
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Function to format date to standard format
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Fetch orders from the API
  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const token = await getToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()

        // Filter orders by status
        const active = data.filter((order: Order) => order.status === 'active')
        const pending = data.filter((order: Order) =>
          order.status === 'pending' || order.status === 'confirmed')
        const completed = data.filter((order: Order) => order.status === 'completed')

        setActiveRentals(active)
        setPendingRentals(pending)
        setCompletedRentals(completed)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // Handle opening the review dialog
  const handleOpenReviewDialog = (rental: Order, type: string) => {
    setCurrentRentalForReview(rental)
    setReviewType(type)
    setRating(0)
    setComment("")
    setIsReviewDialogOpen(true)
  }

  // Handle submitting a review
  const handleReviewSubmit = async () => {
    if (!currentRentalForReview || rating === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a rating",
        variant: "destructive"
      })
      return
    }

    const reviewData = {
      reviewer: user?.id || '',
      product: currentRentalForReview.product._id,
      rating,
      comment,
      reviewType,
    }

    try {
      const token = await getToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      // Also update the order to mark it as reviewed
      const orderUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${currentRentalForReview._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isReviewed: true }),
      })

      if (!orderUpdateResponse.ok) {
        throw new Error('Failed to mark order as reviewed')
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
        variant: "default",
      })

      // Update local state to reflect the review
      if (reviewType === 'product') {
        setCompletedRentals(prev =>
          prev.map(rental =>
            rental._id === currentRentalForReview._id
              ? { ...rental, isReviewed: true }
              : rental
          )
        )
      }

      setIsReviewDialogOpen(false)
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderStars = (currentRating: number, setRatingFunc: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${star <= currentRating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
              }`}
            onClick={() => setRatingFunc(star)}
          />
        ))}
      </div>
    )
  }

  // Generate initials from a name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Get user role in the rental (renting or lending)
  const getUserRole = (order: Order): string => {
    if (!user) return 'renting'
    return order.renter.clerkId === user.id ? 'renting' : 'lending'
  }

  // Handle approval of rental requests
  const toggleApproval = async (rental: Order) => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not available');
      }

      // Ensure we're using a valid URL with the environment variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = `${apiUrl}/api/orders/${rental._id}/status`;

      console.log('Making API request to:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'active' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        console.error('Server response:', errorData);
        throw new Error(errorData.message || 'Failed to approve request');
      }

      // Update local state
      setPendingRentals(prev => prev.filter(r => r._id !== rental._id));
      setActiveRentals(prev => [...prev, { ...rental, status: 'active' }]);

      toast({
        title: "Request Approved",
        description: "You have approved the rental request.",
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve request. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Handle cancellation of rental requests by the renter
  const cancelRequest = async (rental: Order) => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not available');
      }

      // Ensure we're using a valid URL with the environment variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = `${apiUrl}/api/orders/${rental._id}/status`;

      console.log('Making API request to:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        console.error('Server response:', errorData);
        throw new Error(errorData.message || 'Failed to cancel request');
      }

      // Update local state
      setPendingRentals(prev => prev.filter(r => r._id !== rental._id));

      toast({
        title: "Request Cancelled",
        description: "Your rental request has been cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel request. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Handle declining of rental requests by the owner
  const declineRequest = async (rental: Order) => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication token not available');
      }

      // Ensure we're using a valid URL with the environment variable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const url = `${apiUrl}/api/orders/${rental._id}/status`;

      console.log('Making API request to:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        console.error('Server response:', errorData);
        throw new Error(errorData.message || 'Failed to decline request');
      }

      // Update local state
      setPendingRentals(prev => prev.filter(r => r._id !== rental._id));

      toast({
        title: "Request Declined",
        description: "You have declined the rental request.",
      });
    } catch (error) {
      console.error('Error declining request:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to decline request. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Rentals</h1>
            <p className="text-muted-foreground">Manage all your rental transactions in one place</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-teal-600"></div>
              <p className="mt-4 text-muted-foreground">Loading rentals...</p>
            </div>
          ) : (
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active ({activeRentals.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingRentals.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedRentals.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6 pt-6">
                {activeRentals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-lg font-medium">No active rentals</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      When you have active rentals, they will appear here.
                    </p>
                  </div>
                ) : (
                  activeRentals.map((rental) => {
                    const role = getUserRole(rental)
                    const daysLeft = calculateDaysLeft(rental.endDate)

                    return (
                      <Card key={rental._id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-teal-600 hover:bg-teal-700">
                              {role === "renting" ? "Renting" : "Lending"}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              {daysLeft > 0 ? `${daysLeft} days left` : "Due today"}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative h-24 w-24 rounded-md overflow-hidden shrink-0">
                              <Image
                                src={rental.product.images[0] || "/placeholder.svg"}
                                alt={rental.product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <h3 className="font-semibold">{rental.product.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{rental.product.description}</p>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-1 text-sm">
                                  <CalendarRange className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{rental.totalDays} days total</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Rental progress</span>
                                  <span>
                                    {rental.totalDays - daysLeft}/{rental.totalDays} days
                                  </span>
                                </div>
                                <Progress
                                  value={((rental.totalDays - daysLeft) / rental.totalDays) * 100}
                                  className="h-2"
                                />
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={role === "renting" ? rental.owner.profileImage : rental.renter.profileImage}
                                      alt={role === "renting" ? rental.owner.name : rental.renter.name}
                                    />
                                    <AvatarFallback>
                                      {role === "renting"
                                        ? getInitials(rental.owner.name)
                                        : getInitials(rental.renter.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {role === "renting" ? rental.owner.name : rental.renter.name}
                                  </span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                                  <MessagesSquare className="h-3.5 w-3.5" />
                                  Message
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                ₹{rental.rentalRate}/day
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Total: ₹{rental.totalAmount}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-4">
                          <div>
                            {role === "renting" ? (
                              <Button variant="outline" size="sm">
                                Report Issue
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                Contact Renter
                              </Button>
                            )}
                          </div>
                          <Button asChild size="sm">
                            <p className="cursor-pointer">
                              View Details <ChevronRight className="ml-1 h-4 w-4" />
                            </p>
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-6 pt-6">
                {pendingRentals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-lg font-medium">No pending rentals</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      When you have pending rental requests, they will appear here.
                    </p>
                  </div>
                ) : (
                  pendingRentals.map((rental) => {
                    const role = getUserRole(rental)

                    return (
                      <Card key={rental._id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              {role === "renting" ? "Requested" : "Request Received"}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              Starts on {formatDate(rental.startDate)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative h-24 w-24 rounded-md overflow-hidden shrink-0">
                              <Image
                                src={rental.product.images[0] || "/placeholder.svg"}
                                alt={rental.product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <h3 className="font-semibold">{rental.product.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{rental.product.description}</p>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-1 text-sm">
                                  <CalendarRange className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{rental.totalDays} days total</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={role === "renting" ? rental.owner.profileImage : rental.renter.profileImage}
                                      alt={role === "renting" ? rental.owner.name : rental.renter.name}
                                    />
                                    <AvatarFallback>
                                      {role === "renting"
                                        ? getInitials(rental.owner.name)
                                        : getInitials(rental.renter.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {role === "renting" ? rental.owner.name : rental.renter.name}
                                  </span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                                  <MessagesSquare className="h-3.5 w-3.5" />
                                  Message
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                ₹{rental.rentalRate}/day
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Total: ₹{rental.totalAmount}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-4">
                          {role === "renting" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelRequest(rental)}
                            >
                              Cancel Request
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => declineRequest(rental)}
                              >
                                <X className="h-4 w-4" /> Decline
                              </Button>
                              <Button
                                size="sm"
                                className="gap-1 bg-teal-600 hover:bg-teal-700"
                                onClick={() => toggleApproval(rental)}
                              >
                                <Check className="h-4 w-4" /> Approve
                              </Button>
                            </div>
                          )}
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/rentals/${rental._id}`}>
                              View Details <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-6 pt-6">
                {completedRentals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-lg font-medium">No completed rentals</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your completed rentals will appear here.
                    </p>
                  </div>
                ) : (
                  completedRentals.map((rental) => {
                    const role = getUserRole(rental)

                    return (
                      <Card key={rental._id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-muted-foreground">
                              {role === "renting" ? "Rented" : "Lent"}
                            </Badge>
                            <div className="text-sm text-muted-foreground">
                              Completed on {formatDate(rental.endDate)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative h-24 w-24 rounded-md overflow-hidden shrink-0">
                              <Image
                                src={rental.product.images[0] || "/placeholder.svg"}
                                alt={rental.product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <h3 className="font-semibold">{rental.product.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{rental.product.description}</p>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-1 text-sm">
                                  <CalendarRange className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{rental.totalDays} days total</span>
                                </div>
                              </div>
                              {rental.isReviewed && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">Rating:</span>
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= (rental.product.averageRating || 0)
                                          ? "fill-amber-500 text-amber-500"
                                          : "text-muted-foreground"
                                          }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                ₹{rental.rentalRate}/day
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Total: ₹{rental.totalAmount}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-4">
                          {role === "renting" && !rental.isReviewed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReviewDialog(rental, 'product')}
                            >
                              Leave Review
                            </Button>
                          )}
                          {role === "lending" && !rental.isReviewed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReviewDialog(rental, 'renter')}
                            >
                              Rate Renter
                            </Button>
                          )}
                          {rental.isReviewed && (
                            <div className="text-sm text-muted-foreground">
                              {role === "renting" ? "You rated this rental" : "Renter left a review"}
                            </div>
                          )}
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/rentals/${rental._id}`}>
                              View Details <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {currentRentalForReview && (
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {reviewType === 'product'
                  ? `Review ${currentRentalForReview.product.title}`
                  : `Rate Renter`
                }
              </DialogTitle>
              <DialogDescription>
                {reviewType === 'product'
                  ? "Share your experience with this product and its owner."
                  : "Rate your experience with the renter."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Rating
                </Label>
                <div className="col-span-3">{renderStars(rating, setRating)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">
                  Comment
                </Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="col-span-3"
                  placeholder={reviewType === 'product'
                    ? "Describe your experience with the product and owner..."
                    : "Describe your experience with the renter..."
                  }
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleReviewSubmit} className="bg-teal-600 hover:bg-teal-700">
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
