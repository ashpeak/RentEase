import Link from "next/link"
import Image from "next/image"
import { Filter, Search, SlidersHorizontal, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Professional DSLR Camera",
      description: "Canon EOS 5D Mark IV with 24-70mm lens",
      price: 75,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.9,
      reviews: 127,
      location: "New York",
      category: "Electronics",
      featured: true,
    },
    {
      id: 2,
      name: "Mountain Bike",
      description: "Trek Fuel EX 8 29er Full Suspension",
      price: 45,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.8,
      reviews: 84,
      location: "Denver",
      category: "Sports",
      featured: true,
    },
    {
      id: 3,
      name: "Luxury Tent",
      description: "6-Person Waterproof Camping Tent",
      price: 35,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.7,
      reviews: 56,
      location: "Portland",
      category: "Outdoors",
      featured: true,
    },
    {
      id: 4,
      name: "DJ Equipment Set",
      description: "Complete DJ setup with mixer and speakers",
      price: 120,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.9,
      reviews: 42,
      location: "Los Angeles",
      category: "Music",
      featured: true,
    },
    {
      id: 5,
      name: "Drone with 4K Camera",
      description: "DJI Mavic Air 2 with extra batteries",
      price: 65,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.8,
      reviews: 93,
      location: "Miami",
      category: "Electronics",
    },
    {
      id: 6,
      name: "Stand Up Paddle Board",
      description: "Inflatable SUP with paddle and pump",
      price: 30,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.6,
      reviews: 38,
      location: "San Diego",
      category: "Water Sports",
    },
    {
      id: 7,
      name: "Projector and Screen",
      description: "HD Projector with 100-inch screen",
      price: 45,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.7,
      reviews: 64,
      location: "Chicago",
      category: "Electronics",
    },
    {
      id: 8,
      name: "Power Tools Set",
      description: "Complete set of DeWalt power tools",
      price: 55,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.8,
      reviews: 47,
      location: "Dallas",
      category: "Tools",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Browse Products</h1>
          <p className="text-muted-foreground">Find the perfect items to rent from our wide selection</p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search products..." className="w-full pl-8" />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow down your product search</SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Categories</h3>
                    <div className="grid gap-3">
                      {["Electronics", "Sports", "Outdoors", "Music", "Tools", "Vehicles", "Home"].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox id={`category-${category}`} />
                          <Label htmlFor={`category-${category}`}>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Price Range</h3>
                      <span className="text-sm text-muted-foreground">$0 - $200</span>
                    </div>
                    <Slider defaultValue={[0, 200]} min={0} max={200} step={1} />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Location</h3>
                    <div className="grid gap-3">
                      {["New York", "Los Angeles", "Chicago", "Miami", "Denver", "Portland", "San Diego", "Dallas"].map(
                        (location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox id={`location-${location}`} />
                            <Label htmlFor={`location-${location}`}>{location}</Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Rating</h3>
                    <div className="grid gap-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox id={`rating-${rating}`} />
                          <Label htmlFor={`rating-${rating}`} className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < rating ? "fill-primary text-primary" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                            {rating === 5 && <span className="ml-1 text-xs">& up</span>}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline">Reset Filters</Button>
                    <Button className="bg-teal-600 hover:bg-teal-700">Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Select defaultValue="featured">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <CardHeader className="p-0">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {product.featured && (
                      <Badge className="absolute right-2 top-2 bg-teal-600 hover:bg-teal-700">Featured</Badge>
                    )}
                  </div>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span>{product.rating}</span>
                      <span className="text-xs">({product.reviews})</span>
                    </div>
                  </div>
                  <Link href={`/products/${product.id}`} className="group-hover:underline">
                    <h3 className="font-semibold">{product.name}</h3>
                  </Link>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <div className="font-medium">
                  <span className="text-lg">${product.price}</span>
                  <span className="text-sm text-muted-foreground">/{product.period}</span>
                </div>
                <div className="text-xs text-muted-foreground">{product.location}</div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <span className="sr-only">Previous page</span>
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
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button variant="outline" size="sm" className="bg-teal-600 text-white hover:bg-teal-700">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              4
            </Button>
            <Button variant="outline" size="sm">
              5
            </Button>
            <Button variant="outline" size="icon">
              <span className="sr-only">Next page</span>
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
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
