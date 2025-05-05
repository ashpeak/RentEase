import Image from "next/image"
import Link from "next/link"
import { Calendar, ChevronRight, Edit, Eye, Star, ToggleLeft, ToggleRight, Trash } from "lucide-react"

import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function ListingsPage() {
  // Mock data - would come from API in real application
  const activeListings = [
    {
      id: 1,
      name: "Professional DSLR Camera",
      description: "Canon EOS 5D Mark IV with 24-70mm lens",
      price: 75,
      period: "day",
      image: "/placeholder.svg?height=120&width=120",
      category: "Electronics",
      status: "active",
      featured: true,
      views: 342,
      rentals: 5,
      income: 675,
      rating: 4.9,
      reviews: 8,
      dateAdded: "2023-06-15",
    },
    {
      id: 2,
      name: "DJ Equipment Set",
      description: "Complete DJ setup with mixer and speakers",
      price: 120,
      period: "day",
      image: "/placeholder.svg?height=120&width=120",
      category: "Music",
      status: "active",
      featured: false,
      views: 184,
      rentals: 3,
      income: 720,
      rating: 4.7,
      reviews: 3,
      dateAdded: "2023-07-02",
    },
    {
      id: 3,
      name: "Mountain Bike",
      description: "Trek Fuel EX 8 29er Full Suspension",
      price: 45,
      period: "day",
      image: "/placeholder.svg?height=120&width=120",
      category: "Sports",
      status: "active",
      featured: false,
      views: 231,
      rentals: 4,
      income: 540,
      rating: 4.8,
      reviews: 6,
      dateAdded: "2023-05-20",
    },
  ]

  const inactiveListings = [
    {
      id: 4,
      name: "Luxury Tent",
      description: "6-Person Waterproof Camping Tent",
      price: 35,
      period: "day",
      image: "/placeholder.svg?height=120&width=120",
      category: "Outdoors",
      status: "inactive",
      featured: false,
      views: 97,
      rentals: 2,
      income: 210,
      rating: 4.7,
      reviews: 2,
      dateAdded: "2023-06-28",
    },
    {
      id: 5,
      name: "Drone with 4K Camera",
      description: "DJI Mavic Air 2 with extra batteries",
      price: 65,
      period: "day",
      image: "/placeholder.svg?height=120&width=120",
      category: "Electronics",
      status: "inactive",
      featured: false,
      views: 128,
      rentals: 1,
      income: 195,
      rating: 5.0,
      reviews: 1,
      dateAdded: "2023-07-10",
    },
  ]

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
              <p className="text-muted-foreground">Manage your product listings</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700" asChild>
              <Link href="/list-item">
                <Plus className="mr-1 h-4 w-4" /> Add New Listing
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Listing Summary</CardTitle>
              <CardDescription>Overview of your item listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total Listings</span>
                  <p className="text-2xl font-bold">{activeListings.length + inactiveListings.length}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Active Listings</span>
                  <p className="text-2xl font-bold">{activeListings.length}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total Rentals</span>
                  <p className="text-2xl font-bold">
                    {activeListings.reduce((acc, listing) => acc + listing.rentals, 0) +
                      inactiveListings.reduce((acc, listing) => acc + listing.rentals, 0)}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total Income</span>
                  <p className="text-2xl font-bold">
                    $
                    {activeListings.reduce((acc, listing) => acc + listing.income, 0) +
                      inactiveListings.reduce((acc, listing) => acc + listing.income, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
            <div className="flex flex-1 gap-2 w-full sm:max-w-xs">
              <Input placeholder="Search your listings..." className="w-full" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Date Added: Newest</SelectItem>
                  <SelectItem value="oldest">Date Added: Oldest</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="rentals">Most Rentals</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="outdoors">Outdoors</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveListings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6 pt-6">
              {activeListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-48 sm:h-auto sm:w-40 w-full bg-muted">
                        <Image
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.name}
                          fill
                          className="object-cover"
                        />
                        {listing.featured && (
                          <Badge className="absolute left-2 top-2 bg-teal-600 hover:bg-teal-700">Featured</Badge>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{listing.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {listing.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{listing.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              ${listing.price}/{listing.period}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                              <span>{listing.rating}</span>
                              <span>({listing.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Views</span>
                            <p className="font-medium">{listing.views}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Rentals</span>
                            <p className="font-medium">{listing.rentals}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Income</span>
                            <p className="font-medium">${listing.income}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Listed on {listing.dateAdded}</span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                            <Link href={`/products/${listing.id}`}>
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                            <Link href={`/dashboard/listings/${listing.id}/edit`}>
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <ToggleLeft className="h-3.5 w-3.5" />
                            Pause
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8">
                                More
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Promote listing</DropdownMenuItem>
                              <DropdownMenuItem>Update availability</DropdownMenuItem>
                              <DropdownMenuItem>Update pricing</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete listing
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button asChild size="sm" className="ml-auto h-8 bg-teal-600 hover:bg-teal-700">
                            <Link href={`/dashboard/listings/${listing.id}`}>
                              Analytics <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="inactive" className="space-y-6 pt-6">
              {inactiveListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-48 sm:h-auto sm:w-40 w-full bg-muted">
                        <Image
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute left-0 right-0 bottom-0 bg-background/80 py-1 text-center text-xs font-medium">
                          Inactive
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{listing.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {listing.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{listing.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              ${listing.price}/{listing.period}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                              <span>{listing.rating}</span>
                              <span>({listing.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Views</span>
                            <p className="font-medium">{listing.views}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Rentals</span>
                            <p className="font-medium">{listing.rentals}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Income</span>
                            <p className="font-medium">${listing.income}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Listed on {listing.dateAdded}</span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                            <Link href={`/products/${listing.id}`}>
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                            <Link href={`/dashboard/listings/${listing.id}/edit`}>
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <ToggleRight className="h-3.5 w-3.5" />
                            Activate
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8">
                                More
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Update availability</DropdownMenuItem>
                              <DropdownMenuItem>Update pricing</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete listing
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button asChild size="sm" className="ml-auto h-8 bg-teal-600 hover:bg-teal-700">
                            <Link href={`/dashboard/listings/${listing.id}`}>
                              Analytics <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function Plus({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}
