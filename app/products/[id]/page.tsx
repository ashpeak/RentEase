import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Heart, MapPin, Share, Star, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RelatedProducts } from "@/components/related-products"

export default function ProductPage({ params }: { params: { id: string } }) {
  // This would normally fetch the product data based on the ID
  const product = {
    id: Number.parseInt(params.id),
    name: "Professional DSLR Camera",
    description:
      "Canon EOS 5D Mark IV with 24-70mm lens, perfect for professional photography and videography. Includes extra battery, memory cards, and carrying case.",
    price: 75,
    period: "day",
    weeklyPrice: 450,
    monthlyPrice: 1500,
    deposit: 500,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 4.9,
    reviews: 127,
    location: "New York",
    category: "Electronics",
    featured: true,
    owner: {
      name: "Michael Scott",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      reviews: 42,
      responseTime: "Within 1 hour",
      memberSince: "January 2020",
    },
    specifications: [
      { name: "Brand", value: "Canon" },
      { name: "Model", value: "EOS 5D Mark IV" },
      { name: "Resolution", value: "30.4 MP" },
      { name: "Lens", value: "24-70mm f/2.8L" },
      { name: "Video", value: "4K at 30fps" },
      { name: "Weight", value: "1.76 lbs (800g)" },
      { name: "Condition", value: "Excellent" },
      { name: "Includes", value: "Extra battery, memory cards, carrying case" },
    ],
    rules: [
      "Valid ID required for rental",
      "Security deposit required",
      "Return in the same condition",
      "Late returns will incur additional fees",
      "Damage or loss is renter's responsibility",
    ],
  }

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
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {product.images.slice(1, 5).map((image, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${i + 2}`}
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
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                    <span>{product.rating}</span>
                    <span className="ml-1">({product.reviews} reviews)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
                <Button variant="outline" size="icon">
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
                <p>
                  This professional-grade camera is perfect for photographers of all levels. Whether you're shooting
                  portraits, landscapes, or events, this camera delivers exceptional image quality and performance.
                </p>
                <p>
                  The included 24-70mm lens is versatile for a wide range of photography styles, and the extra
                  accessories ensure you have everything you need for a successful shoot.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {product.specifications.map((spec) => (
                  <div key={spec.name} className="flex justify-between border-b pb-2">
                    <span className="font-medium">{spec.name}</span>
                    <span className="text-muted-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="rules" className="pt-4">
              <ul className="space-y-2">
                {product.rules.map((rule, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2 text-lg">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <Button variant="outline">Write a Review</Button>
            </div>

            <div className="grid gap-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">User Name</div>
                      <div className="text-xs text-muted-foreground">March 2023</div>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 5 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm">
                    Great camera! It was in excellent condition and worked perfectly for my weekend photoshoot. The
                    owner was very helpful and provided all the necessary accessories.
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
                <span className="text-2xl">${product.price}</span>
                <span className="text-sm text-muted-foreground">/ {product.period}</span>
              </CardTitle>
              <CardDescription>
                <div className="flex gap-4 text-sm">
                  <div>Weekly: ${product.weeklyPrice}</div>
                  <div>Monthly: ${product.monthlyPrice}</div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rental Duration</label>
                <Select defaultValue="day">
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Days</SelectItem>
                    <SelectItem value="week">Weeks</SelectItem>
                    <SelectItem value="month">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message to Owner</label>
                <Textarea placeholder="Introduce yourself and explain why you need this item" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between">
                  <span>3 days rental</span>
                  <span>${product.price * 3}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>$25</span>
                </div>
                <div className="flex justify-between">
                  <span>Security deposit (refundable)</span>
                  <span>${product.deposit}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${product.price * 3 + 25 + product.deposit}</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">You won't be charged yet</div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">Request to Book</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">About the Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={product.owner.image || "/placeholder.svg"} alt={product.owner.name} />
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

      <RelatedProducts />
    </div>
  )
}
