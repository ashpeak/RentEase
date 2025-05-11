"use client"

import Link from "next/link"
import Image from "next/image"
import { Filter, Search, SlidersHorizontal, Star } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 5000]) // Assuming max price is 5000
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  
  // Extract unique categories and locations from products with safety checks
  const categories = Array.from(new Set(
    Array.isArray(products) 
      ? products
          .map(p => p?.category)
          .filter((name): name is string => Boolean(name))
      : []
  )).sort()
  
  const locations = Array.from(new Set(
    Array.isArray(products)
      ? products
          .filter(p => p?.location?.city)
          .map(p => `${p.location.city}, ${p.location.state}`)
      : []
  )).sort()
  
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
  
  // Filter and sort products
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    if (!product) return false;
    
    // Text search filter
    const matchesSearch = !searchTerm || (
      (product.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.location?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.location?.state || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // Price range filter
    const rate = Number(product.rate) || 0
    const matchesPrice = rate >= priceRange[0] && rate <= priceRange[1]
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      (product.category && selectedCategories.includes(product.category))
      
    // Location filter
    const matchesLocation = selectedLocations.length === 0 || 
      (product.location?.city && selectedLocations.includes(`${product.location.city}, ${product.location.state}`))
      
    // Rating filter
    const averageRating = Number(product.averageRating) || 0
    const matchesRating = averageRating >= minRating
    
    return matchesSearch && matchesPrice && matchesCategory && matchesLocation && matchesRating
  }) : [];
  
  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!a || !b) return 0;
    switch (sortOption) {
      case 'price-low':
        return (Number(a.rate) || 0) - (Number(b.rate) || 0)
      case 'price-high':
        return (Number(b.rate) || 0) - (Number(a.rate) || 0)
      case 'rating':
        // Sort by average rating if available
        return (Number(b.averageRating) || 0) - (Number(a.averageRating) || 0)
      case 'newest':
        // Use creation date for sorting, fallback to IDs if dates not available
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      case 'featured':
      default:
        // Default to featured items first, then by id
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || 
               ((a._id && b._id) ? a._id.localeCompare(b._id) : 0)
    }
  })

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
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="w-full pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                      {categories.length > 0 ? categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category])
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category))
                              }
                            }}
                          />
                          <Label htmlFor={`category-${category}`}>{category}</Label>
                        </div>
                      )) : (
                        <div className="text-sm text-muted-foreground">Loading categories...</div>
                      )}
                      {categories.length === 0 && !loading && (
                        <div className="text-sm text-muted-foreground">No categories available</div>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Price Range</h3>
                      <span className="text-sm text-muted-foreground">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                    </div>
                    <Slider 
                      defaultValue={priceRange} 
                      min={0} 
                      max={5000} 
                      step={100}
                      onValueChange={setPriceRange}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Location</h3>
                    <div className="grid gap-3">
                      {locations.length > 0 ? locations.map((locationString) => (
                        <div key={locationString} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`location-${locationString}`}
                            checked={selectedLocations.includes(locationString)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLocations([...selectedLocations, locationString])
                              } else {
                                setSelectedLocations(selectedLocations.filter(l => l !== locationString))
                              }
                            }}
                          />
                          <Label htmlFor={`location-${locationString}`}>{locationString}</Label>
                        </div>
                      )) : (
                        <div className="text-sm text-muted-foreground">Loading locations...</div>
                      )}
                      {locations.length === 0 && !loading && (
                        <div className="text-sm text-muted-foreground">No locations available</div>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Rating</h3>
                    <div className="grid gap-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`rating-${rating}`}
                            checked={minRating === rating}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setMinRating(rating)
                              } else if (minRating === rating) {
                                setMinRating(0)
                              }
                            }}
                          />
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
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedCategories([])
                        setSelectedLocations([])
                        setMinRating(0)
                        setPriceRange([0, 5000])
                        setSearchTerm("")
                      }}
                    >
                      Reset Filters
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      Apply Filters
                    </Button>
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
            <Select value={sortOption} onValueChange={(value) => setSortOption(value)}>
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
          {loading ? (
            // Loading skeletons
            Array(8).fill(0).map((_, i) => (
              <Card key={i} className="group overflow-hidden animate-pulse">
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-800"></div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 pt-0">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </CardFooter>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full py-10 text-center">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4 bg-teal-600 hover:bg-teal-700">
                Try Again
              </Button>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="col-span-full py-10 text-center">
              <p className="text-muted-foreground">No products found. Try adjusting your search.</p>
            </div>
          ) : (
            sortedProducts.map((product) => (
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
            ))
          )}
        </div>

        {!loading && !error && sortedProducts.length > 0 && (
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
              {sortedProducts.length > 8 && (
                <>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  {sortedProducts.length > 16 && (
                    <>
                      <Button variant="outline" size="sm">
                        3
                      </Button>
                      {sortedProducts.length > 24 && (
                        <>
                          <Button variant="outline" size="sm">
                            4
                          </Button>
                          <Button variant="outline" size="sm">
                            5
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
              <Button variant="outline" size="icon" disabled={sortedProducts.length <= 8}>
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
        )}
      </div>
    </div>
  )
}
