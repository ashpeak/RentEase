import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RelatedProducts() {
  const products = [
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
      name: "Mirrorless Camera",
      description: "Sony Alpha a7 III with 28-70mm lens",
      price: 70,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.9,
      reviews: 78,
      location: "New York",
      category: "Electronics",
    },
    {
      id: 7,
      name: "GoPro Hero 10",
      description: "Action camera with accessories",
      price: 40,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.7,
      reviews: 64,
      location: "Chicago",
      category: "Electronics",
    },
    {
      id: 8,
      name: "Camera Stabilizer",
      description: "DJI Ronin-S gimbal stabilizer",
      price: 35,
      period: "day",
      image: "/placeholder.svg?height=600&width=600",
      rating: 4.8,
      reviews: 47,
      location: "Dallas",
      category: "Electronics",
    },
  ]

  return (
    <section className="mt-16">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Related Products</h2>
          <p className="text-muted-foreground">You might also be interested in these items</p>
        </div>
        <Button asChild variant="ghost" className="gap-1">
          <Link href="/products">
            View all
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
    </section>
  )
}
