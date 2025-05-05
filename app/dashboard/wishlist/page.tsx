import Image from "next/image"
import Link from "next/link"
import { CalendarRange, Heart, Share, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function WishlistPage() {
  // Mock wishlist items - would come from API/state in a real app
  const wishlistItems = [
    {
      id: 1,
      name: "Professional DSLR Camera",
      description: "Canon EOS 5D Mark IV with 24-70mm lens",
      price: 75,
      period: "day",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 127,
      location: "New York",
      category: "Electronics",
      dateAdded: "2023-07-15",
      available: true,
    },
    {
      id: 2,
      name: "Mountain Bike",
      description: "Trek Fuel EX 8 29er Full Suspension",
      price: 45,
      period: "day",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 84,
      location: "Denver",
      category: "Sports",
      dateAdded: "2023-07-20",
      available: true,
    },
    {
      id: 3,
      name: "Luxury Tent",
      description: "6-Person Waterproof Camping Tent",
      price: 35,
      period: "day",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 56,
      location: "Portland",
      category: "Outdoors",
      dateAdded: "2023-07-25",
      available: false,
    },
    {
      id: 4,
      name: "DJ Equipment Set",
      description: "Complete DJ setup with mixer and speakers",
      price: 120,
      period: "day",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 42,
      location: "Los Angeles",
      category: "Music",
      dateAdded: "2023-08-01",
      available: true,
    },
    {
      id: 5,
      name: "Stand Up Paddle Board",
      description: "Inflatable SUP with paddle and pump",
      price: 30,
      period: "day",
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 38,
      location: "San Diego",
      category: "Water Sports",
      dateAdded: "2023-08-05",
      available: true,
    },
  ]

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
            <p className="text-muted-foreground">Manage your saved items and compare products</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
            <div className="flex flex-1 gap-2 w-full sm:max-w-xs">
              <Input placeholder="Search wishlist..." className="w-full" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="date">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Added: Newest</SelectItem>
                  <SelectItem value="date-asc">Date Added: Oldest</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 bg-background/80 hover:bg-background/90 z-10"
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        <span className="sr-only">Remove from wishlist</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-12 bg-background/80 hover:bg-background/90 z-10"
                      >
                        <Share className="h-5 w-5" />
                        <span className="sr-only">Share item</span>
                      </Button>
                      {!item.available && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                          <div className="px-4 py-2 bg-red-500 text-white font-medium rounded-md">
                            Currently Unavailable
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span>{item.rating}</span>
                        <span className="text-xs">({item.reviews})</span>
                      </div>
                    </div>
                    <Link href={`/products/${item.id}`} className="group-hover:underline">
                      <h3 className="font-semibold">{item.name}</h3>
                    </Link>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="font-medium">
                        <span className="text-lg">${item.price}</span>
                        <span className="text-sm text-muted-foreground">/{item.period}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarRange className="h-3.5 w-3.5 mr-1" />
                        Added {item.dateAdded}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="w-full space-y-2">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700" disabled={!item.available}>
                      Rent Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
