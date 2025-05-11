"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Heart, MapPin, Share, Star, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RelatedProducts } from "@/components/related-products"
import { ReviewFormDialog } from "@/components/ReviewFormDialog"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays, addDays, isValid } from "date-fns";
import axios from "axios";
import { useNotificationStore } from "@/stores/useNotificationStore"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const { getToken, userId } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const fetchItems = useNotificationStore(state => state.fetchItems);

  const today = new Date();
  const tomorrow = addDays(today, 1);

  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(tomorrow);
  const [rentalDays, setRentalDays] = useState<number>(1);

  const handleAddToCart = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    const messageElement = document.getElementById("message-to-owner") as HTMLTextAreaElement;
    const message = messageElement ? messageElement.value : "";

    if (!startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please select start and end dates for your rental.",
        variant: "destructive",
      });
      return;
    }

    setCartLoading(true);
    try {
      const token = await getToken();

      // Add to cart
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          productId: product._id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          days: rentalDays,
          message
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Added to Cart",
        description: "This product has been added to your cart.",
      });

      token && fetchItems(token);

    } catch (err: any) {
      console.error("Error adding to cart:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate && isValid(startDate) && isValid(endDate)) {
      if (endDate < startDate) {
        // If endDate is before startDate, reset endDate to be one day after startDate
        const newEndDate = addDays(startDate, 1);
        setEndDate(newEndDate);
        setRentalDays(1);
        toast({
          title: "Invalid Date Range",
          description: "End date cannot be before start date. It has been adjusted.",
          variant: "destructive",
        });
      } else {
        const days = differenceInDays(endDate, startDate);
        setRentalDays(days > 0 ? days : 1); // Ensure at least 1 day rental if same day selected, or adjust as needed
      }
    } else {
      setRentalDays(1);
    }
  }, [startDate, endDate, toast]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDateString = e.target.value;
    const newStartDate = newStartDateString ? new Date(newStartDateString) : null;
    setStartDate(newStartDate);
    if (newStartDate && endDate && isValid(newStartDate) && isValid(endDate) && newStartDate >= endDate) {
      setEndDate(addDays(newStartDate, 1));
    } else if (!newStartDate) {
      setEndDate(null); // Clear end date if start date is cleared
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDateString = e.target.value;
    const newEndDate = newEndDateString ? new Date(newEndDateString) : null;
    setEndDate(newEndDate);
    if (startDate && newEndDate && isValid(startDate) && isValid(newEndDate) && newEndDate <= startDate) {

    } else if (!newEndDate && startDate) {
      setEndDate(addDays(startDate, 1));
    }
  };


  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const unwrappedParams = await params; // Await the params promise here
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${unwrappedParams.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch product");
      }
      const data = await response.json();
      setProduct(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch product");
      toast({
        title: "Error",
        description: err.message || "Failed to fetch product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReviewClick = () => {
    setIsReviewDialogOpen(true);
  };

  const fetchReviews = async () => {
    try {
      const unwrappedParams = await params;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${unwrappedParams.id}/reviews`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch reviews");
    }
  }

  const handleReviewSubmit = async (rating: number, comment: string) => {
    const unwrappedParams = await params;

    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit a review.",
          variant: "destructive",
        });
        setIsReviewDialogOpen(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: unwrappedParams.id,
          rating,
          comment,
          reviewType: "product",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to submit review",
          variant: "destructive",
        });
      }

      await response.json();
      toast({
        title: "Success",
        description: "Your review has been submitted successfully.",
        variant: "default",
      });
      setIsReviewDialogOpen(false);

      fetchReviews();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "The product link has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const checkWishlistStatus = async () => {
    if (!userId) return;

    setWishlistLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.products) {
        const isProductInWishlist = response.data.products.some(
          (item: any) => item._id === product._id
        );
        setIsInWishlist(isProductInWishlist);
      }
    } catch (err) {
      console.error("Error checking wishlist status:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    setWishlistLoading(true);
    try {
      const token = await getToken();

      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIsInWishlist(false);
        toast({
          title: "Removed from Wishlist",
          description: "This product has been removed from your wishlist.",
        });
      } else {
        // Add to wishlist
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
          { productId: product._id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        setIsInWishlist(true);
        toast({
          title: "Added to Wishlist",
          description: "This product has been added to your wishlist.",
        });
      }
    } catch (err: any) {
      console.error("Error updating wishlist:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (product && userId) {
      checkWishlistStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, userId]);

  if (loading) {
    return <div className="container py-10 text-center text-muted-foreground">Loading product...</div>;
  }
  if (error || !product) {
    return <div className="container py-10 text-center text-red-500">{error || "Product not found."}</div>;
  }

  const rentalPrice = product.rate * rentalDays;
  const serviceFee = 0;
  const totalAmount = rentalPrice + serviceFee + product.securityDeposit;

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-teal-600 shadow-sm">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {product.images.slice(1, 5).map((image: string, i: any) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-teal-600 shadow-sm">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} - Image ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{product.category}</Badge>
                  {product.featured && <Badge className="bg-teal-600 hover:bg-teal-700">Featured</Badge>}
                </div>
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                    <span>{product.rating}</span>
                    <span className="ml-1">({product.reviews} reviews)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{product.location?.address}, {product.location?.city}, {product.location?.state} {product.location?.zipCode}, {product.location?.country}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleWishlistToggle} disabled={wishlistLoading}>
                  <Heart className={`h-5 w-5 ${isInWishlist ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  <span className="sr-only">{isInWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
                </Button>
                <Button variant="outline" size="icon" onClick={handleShareClick}>
                  <Share className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="rules">Rental Rules</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <div className="space-y-4">
                <p>{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Brand</span>
                  <span className="text-muted-foreground">{product.specifications.brand}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Model</span>
                  <span className="text-muted-foreground">{product.specifications.model}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Rules</span>
                  <span className="text-muted-foreground pl-1">{product.specifications.rentalRules}</span>
                </div>

              </div>
            </TabsContent>
            <TabsContent value="rules" className="pt-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-lg">•</span>
                  <span>{product.specifications.rentalRules}</span>
                </li>
              </ul>
            </TabsContent>
          </Tabs>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <Button variant="outline" onClick={handleWriteReviewClick}>Write a Review</Button>
            </div>

            <div className="grid gap-6">
              {Array.isArray(reviews) && reviews.map((review) => (
                <div key={review._id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={review.reviewer.profileImage} alt="User" />
                      <AvatarFallback>{review.reviewer.name}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.reviewer.name}</div>
                      <div className="text-xs text-muted-foreground">{review.createdAt ? format(new Date(review.createdAt), "MMMM yyyy") : ""}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 5 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              Load More Reviews
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-end gap-1">
                <span className="text-2xl">₹{product.rate}</span>
                <span className="text-sm text-muted-foreground">/ {product.selectedPricingModel}</span>
              </CardTitle>
              {/* <CardDescription>
                <div className="flex gap-4 text-sm">
                  <div>Weekly: ${product.weeklyPrice}</div>
                  <div>Monthly: ${product.monthlyPrice}</div>
                </div>
              </CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      className="pl-9"
                      value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                      onChange={handleStartDateChange}
                      min={format(today, "yyyy-MM-dd")} // Prevent selecting past dates
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      className="pl-9"
                      value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                      onChange={handleEndDateChange}
                      min={startDate ? format(addDays(startDate, 0), "yyyy-MM-dd") : format(today, "yyyy-MM-dd")} // End date must be >= start date
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message to Owner</label>
                <Textarea
                  id="message-to-owner"
                  placeholder="Introduce yourself and explain why you need this item"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between">
                  <span>{rentalDays} {rentalDays === 1 ? 'day' : 'days'} rental</span>
                  <span>₹{rentalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security deposit (refundable)</span>
                  <span>₹{product.securityDeposit.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">You won't be charged yet</div>
              </div>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700"
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                {cartLoading ? "Adding to Cart..." : "Add to Cart"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">About the Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={product.owner.profileImage || "/placeholder.svg"} alt={product.owner.name} />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{product.owner.name}</div>
                  <div className="flex items-center text-sm">
                    <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
                    <span>{product.owner.rating}</span>
                    <span className="ml-1">({product.owner.reviews} reviews)</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Member since {product.owner.memberSince}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Identity verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{product.owner.responseTime}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Contact Owner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {product?.category && (
        <RelatedProducts category={product.category} />
      )}

      <ReviewFormDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
        productName={product.name}
      />
    </div>
  )
}
