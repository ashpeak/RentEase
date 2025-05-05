import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function FeaturedProducts() {
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
  ]

  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground">Discover our most popular rental items</p>
          </div>
          <Button asChild variant="ghost" className="gap-1">
            <Link href="/products">
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
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
      </div>
    </section>
  )
}
