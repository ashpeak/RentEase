"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowRight, Bell, Calendar, CreditCard, DollarSign, Heart, Package, Star, Upload, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardNav } from "@/components/dashboard-nav"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@clerk/nextjs"

// Types for our dashboard data
interface DashboardData {
  earnings: {
    total: number
    lastMonth: number
    percentageChange: string
  }
  activeRentals: {
    total: number
    asRenter: number
    asOwner: number
  }
  listedItems: {
    total: number
    active: number
    inactive: number
  }
  profileRating: {
    average: string
    totalReviews: number
  }
  recentRentals: any[]
  recentListings: any[]
  wishlistItems: any[]
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = await getToken();
      try {
        setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Could not load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get time remaining for rentals
  const getTimeLeft = (endDate: string) => {
    try {
      return formatDistanceToNow(new Date(endDate), { addSuffix: true })
    } catch (err) {
      return 'N/A'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <DashboardNav />
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Loading your dashboard data...</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-14 bg-muted/40" />
                  <CardContent className="h-20 bg-muted/20" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <DashboardNav />
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-red-500">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4 w-fit"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your rental activity.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData?.earnings.total || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.earnings.percentageChange && Number(dashboardData.earnings.percentageChange) > 0 ? 
                    <span className="text-green-500">+{dashboardData.earnings.percentageChange}%</span> : 
                    <span className="text-red-500">{dashboardData?.earnings.percentageChange}%</span>
                  } from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.activeRentals.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.activeRentals.asRenter || 0} renting, {dashboardData?.activeRentals.asOwner || 0} rented out
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Listed Items</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.listedItems.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.listedItems.active || 0} active, {dashboardData?.listedItems.inactive || 0} inactive
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.profileRating.average || '0.0'}</div>
                <p className="text-xs text-muted-foreground">From {dashboardData?.profileRating.totalReviews || 0} reviews</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="rentals">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rentals">My Rentals</TabsTrigger>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>
            <TabsContent value="rentals" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Current Rentals</h2>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link href="/dashboard/rentals">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {dashboardData?.recentRentals && dashboardData.recentRentals.length > 0 ? (
                  dashboardData.recentRentals.map((rental) => (
                    <Card key={rental._id}>
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge>{rental.status === 'active' ? 'Renting' : 'Completed'}</Badge>
                          <div className="text-sm text-muted-foreground">
                            {rental.endDate && getTimeLeft(rental.endDate)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 overflow-hidden rounded-md">
                            <Image
                              src={rental.product?.images?.[0] || "/placeholder.svg?height=80&width=80"}
                              alt={rental.product?.title || "Rental item"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{rental.product?.title || "Rental Item"}</h3>
                            <p className="text-sm text-muted-foreground">{rental.product?.description?.substring(0, 30) || "No description"}</p>
                            <div className="mt-2 flex items-center text-sm">
                              <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                              <span>
                                {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <div className="font-medium">
                          <span>₹{rental.dailyRate || rental.product?.rate || 0}</span>
                          <span className="text-sm text-muted-foreground">/day</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No active rentals</h3>
                    <p className="text-sm text-muted-foreground">Once you rent items, they will appear here.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="listings" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Listed Items</h2>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/list-item">List New Item</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="gap-1">
                    <Link href="/dashboard/listings">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {dashboardData?.recentListings && dashboardData.recentListings.length > 0 ? (
                  dashboardData.recentListings.map((listing) => (
                    <Card key={listing._id}>
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge className={listing.status=="available" ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-600 hover:bg-gray-700"}>
                            {listing.status || "Inactive"}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {listing.totalRentals || 0} rentals
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 overflow-hidden rounded-md">
                            <Image
                              src={listing.images?.[0] || "/placeholder.svg?height=80&width=80"}
                              alt={listing.title || "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground">{listing.description?.substring(0, 30) || "No description"}</p>
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <div className="flex items-center">
                                <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
                                <span>{listing.rating || "N/A"}</span>
                              </div>
                              <span>•</span>
                              <span>Listed on {new Date(listing.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <div className="font-medium">
                          <span>₹{listing.rate}</span>
                          <span className="text-sm text-muted-foreground">/day</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit Listing
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 py-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No listings yet</h3>
                    <p className="text-sm text-muted-foreground">Start earning by listing your items for rent.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/list-item">List Your First Item</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Wishlist</h2>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link href="/dashboard/wishlist">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dashboardData?.wishlistItems && dashboardData.wishlistItems.length > 0 ? (
                  dashboardData.wishlistItems.map((item) => (
                    <Card key={item._id}>
                      <CardHeader className="p-0">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={item.images?.[0] || "/placeholder.svg?height=300&width=300"}
                            alt={item.title || "Wishlist item"}
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 bg-background/80 hover:bg-background/90"
                          >
                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            <span className="sr-only">Remove from wishlist</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description?.substring(0, 40) || "No description"}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="font-medium">
                            <span>₹{item.rate}</span>
                            <span className="text-sm text-muted-foreground">/day</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
                            <span>{item.rating || "N/A"}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700" asChild>
                          <Link href={`/products/${item._id}`}>Rent Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
                    <p className="text-sm text-muted-foreground">Save items you're interested in renting later.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to increase trust and get more rentals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Profile completion</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="grid gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Verify your identity</span>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Upload your ID to verify your identity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Add payment method</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Add a payment method for rentals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Set up notifications</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Configure your notification preferences</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/settings">Complete Your Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
