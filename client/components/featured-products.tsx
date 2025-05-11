"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";

export function FeaturedProducts() {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)

        console.log("API Response:", response.data)

        // Handle API response structure where products are in a 'data' field
        const productsData = response.data.data || response.data;

        // Ensure that productsData is an array
        if (!productsData) {
          throw new Error("Invalid response format. Expected products data.")
        }

        // Handle case where productsData is not an array
        if (!Array.isArray(productsData)) {
          console.error("API response data is not an array:", productsData)
          setProducts([])
          setError("Invalid response format from server. Expected an array of products.")
          return
        }

        setProducts(productsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        let errorMessage = "Failed to load products. Please try again later."

        if (axios.isAxiosError(err)) {
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            errorMessage = `Server error: ${err.response.status} - ${err.response.data?.message || err.message}`
          } else if (err.request) {
            // The request was made but no response was received
            errorMessage = "No response from server. Please check your connection."
          }
        }

        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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
          {products.slice(0, 4).map((product) => (
            <Card key={product._id || `product-${Math.random().toString(36).substr(2, 9)}`} className="group overflow-hidden">
              <CardHeader className="p-0">
                <Link href={product._id ? `/products/${product._id}` : "#"}>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.title || "Product image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105"
                      priority={false}
                      onError={(e) => {
                        // @ts-ignore - typescript doesn't know about currentTarget.src
                        e.currentTarget.src = "/placeholder.svg";
                      }}
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
                      {product.category || "Uncategorized"}
                    </Badge>
                    {(product.averageRating !== undefined && product.averageRating !== null) && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span>{Number(product.averageRating).toFixed(1)}</span>
                        <span className="text-xs">({product.reviewCount || 0})</span>
                      </div>
                    )}
                  </div>
                  <Link href={product._id ? `/products/${product._id}` : "#"} className="group-hover:underline">
                    <h3 className="font-semibold">{product.title || "Untitled Product"}</h3>
                  </Link>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{product.description || "No description available"}</p>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <div className="font-medium">
                  <span className="text-lg">₹{Number(product.rate).toFixed(0)}</span>
                  <span className="text-sm text-muted-foreground">/day</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {product.location?.city ? `${product.location.city}, ${product.location.state}` : "N/A"}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
