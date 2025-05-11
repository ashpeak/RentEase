"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Bell, Camera, Check, MapPin, Star, User } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/stores/useUserStore";

interface Review {
  id: string
  type: "asRenter" | "asOwner"
  reviewer: {
    name: string
    avatar?: string | null
    initials: string
  }
  rating: number
  date: string
  comment: string
  product: {
    title: string
  }
}

interface ReviewSummary {
  asRenter: {
    count: number
    average: number
  }
  asOwner: {
    count: number
    average: number
  }
}

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setReviewSummary] = useState<ReviewSummary>({
    asRenter: { count: 0, average: 0 },
    asOwner: { count: 0, average: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const profile = useUserStore((state) => state.profile);
  
  // Function to handle review deletion
  const handleDeleteReview = async (reviewId: string) => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        setError("Authentication token not available");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      
      // Remove the deleted review from state
      setReviews(reviews.filter(review => review.id !== reviewId));
      
      // Update review summary
      const updatedAsRenterReviews = reviews
        .filter(r => r.type === "asRenter" && r.id !== reviewId);
      const updatedAsOwnerReviews = reviews
        .filter(r => r.type === "asOwner" && r.id !== reviewId);
      
      setReviewSummary({
        asRenter: {
          count: updatedAsRenterReviews.length,
          average: updatedAsRenterReviews.length > 0 
            ? parseFloat((updatedAsRenterReviews.reduce((sum, r) => sum + r.rating, 0) / updatedAsRenterReviews.length).toFixed(1))
            : 0
        },
        asOwner: {
          count: updatedAsOwnerReviews.length,
          average: updatedAsOwnerReviews.length > 0 
            ? parseFloat((updatedAsOwnerReviews.reduce((sum, r) => sum + r.rating, 0) / updatedAsOwnerReviews.length).toFixed(1))
            : 0
        }
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error deleting review:', err);
      setError("Could not delete review. Please try again later.");
      setLoading(false);
    }
  };
  
  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        
        if (!token) {
          setError("Authentication token not available");
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        setReviews(data.reviews);
        setReviewSummary(data.summary);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError("Could not load reviews. Please try again later.");
        setLoading(false);
        
        // Fallback to empty state
        setReviews([]);
      }
    };
    
    if (profile) {
      fetchReviews();
    }
  }, [getToken, profile]);
  
  if (!profile) {
    return <div className="container py-10">Loading...</div>
  }
  
  // Format the date safely, handling both string and Date objects
  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'Unknown';
    try {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Unknown';
    }
  };

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and how others see you</p>
          </div>

          <Card className="overflow-hidden">
            <div className="relative h-40 md:h-60 w-full bg-muted">
              <Image src={profile.coverPhoto || "/placeholder.svg"} alt="Cover photo" fill className="object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 bg-background/80 hover:bg-background/90"
              >
                <Camera className="h-5 w-5" />
                <span className="sr-only">Change cover photo</span>
              </Button>
            </div>
            <CardContent className="p-6 pt-0">
              <div className="flex flex-col md:flex-row gap-6 -mt-12 md:-mt-16">
                <div className="relative">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                    <AvatarImage src={profile.profileImage || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 bottom-0 h-7 w-7 rounded-full bg-background"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change profile picture</span>
                  </Button>
                </div>
                <div className="flex-1 space-y-2 mt-[4.5rem]">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{'India'}</span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant={editMode ? "outline" : "default"}
                        className={editMode ? "" : "bg-teal-600 hover:bg-teal-700"}
                        onClick={() => setEditMode(!editMode)}
                      >
                        {editMode ? "Cancel" : "Edit Profile"}
                      </Button>
                      {editMode && (
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setEditMode(false)}>
                          Save Changes
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Member since {formatDate(profile.createdAt)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Bell className="h-3 w-3" />
                      1 hour response time
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      95% response rate
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">As Renter</div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(summary.asRenter.average)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">
                          {summary.asRenter.average}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!editMode ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold">About</h3>
                  <p className="mt-2 text-muted-foreground">Hey, {profile.name}! Feel free to share a bit about yourself. 
                    This will help others get to know you better.</p>
                </div>
              ) : (
                <div className="mt-8 space-y-6">
                  <div className="grid gap-3">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" defaultValue={profile.name} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={'India'} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      defaultValue={profile.bio}
                      rows={4}
                      placeholder="Tell others about yourself, your interests, and your rental preferences."
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>See what others are saying about you</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="asRenter">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="asRenter">Reviews as Renter ({summary.asRenter.count})</TabsTrigger>
                  </TabsList>
                  
                  {loading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading reviews...</div>
                  ) : error ? (
                    <div className="py-8 text-center text-red-500">{error}</div>
                  ) : (
                    <>
                      <TabsContent value="asRenter" className="space-y-6 pt-6">
                        {reviews?.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">No reviews as a renter yet</div>
                        ) : (
                          <>
                            {reviews?.map((review) => (
                                <div key={review.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Avatar>
                                        <AvatarImage
                                          src={profile.name || "/placeholder.svg"}
                                          alt={'ME'}
                                        />
                                        <AvatarFallback>ME</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">{profile.name}</div>
                                        <div className="text-xs text-muted-foreground">{review.date}</div>
                                      </div>
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
                                  <div className="text-xs text-muted-foreground">For: {review.product.title}</div>
                                  <Separator className="mt-4" />
                                </div>
                              ))}

                            {summary.asRenter.count > 3 && (
                              <Button variant="outline" className="w-full">
                                View All Renter Reviews
                              </Button>
                            )}
                          </>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="asOwner" className="space-y-6 pt-6">
                        {reviews.filter(review => review.type === "asOwner").length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">No reviews as an owner yet</div>
                        ) : (
                          <>
                            {reviews
                              .filter((review) => review.type === "asOwner")
                              .map((review) => (
                                <div key={review.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Avatar>
                                        <AvatarImage
                                          src={profile.profileImage || "/placeholder.svg"}
                                          alt={'ME'}
                                        />
                                        <AvatarFallback>ME</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">{profile.name}</div>
                                        <div className="text-xs text-muted-foreground">{review.date}</div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this review?")) {
                                          handleDeleteReview(review.id);
                                        }
                                      }}
                                    >
                                      Delete
                                    </Button>
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
                                  <div className="text-xs text-muted-foreground">For: {review.product.title}</div>
                                  <Separator className="mt-4" />
                                </div>
                              ))}

                            {summary.asOwner.count > 3 && (
                              <Button variant="outline" className="w-full">
                                View All Owner Reviews
                              </Button>
                            )}
                          </>
                        )}
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verifications</CardTitle>
                <CardDescription>Build trust with verified information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${profile?.email ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Email</span>
                  </div>
                  {profile?.email ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Verify
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${true ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Phone Number</span>
                  </div>
                  {true ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Verify
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${false ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Government ID</span>
                  </div>
                  {false ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Verify
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${true ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Facebook</span>
                  </div>
                  {true ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${true ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Google</span>
                  </div>
                  {true ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  More verifications means more trust from the community and higher rental success rates.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
