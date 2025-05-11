"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarRange, Heart, Star } from "lucide-react"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");
  const { getToken, userId } = useAuth();
  const { toast } = useToast();

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!userId) {
        setError("You must be logged in to view your wishlist");
        setLoading(false);
        return;
      }

      const token = await getToken();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.products) {
        setWishlistItems(response.data.products);
      } else {
        setWishlistItems([]);
      }
    } catch (err: any) {
      console.error("Error fetching wishlist:", err);
      setError(err.response?.data?.message || "Failed to fetch wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const token = await getToken();
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the local state
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      
      toast({
        title: "Removed from Wishlist",
        description: "The item has been removed from your wishlist.",
      });
    } catch (err: any) {
      console.error("Error removing from wishlist:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to remove from wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter and sort the wishlist items
  const getFilteredAndSortedItems = () => {
    let items = [...wishlistItems];
    
    // Apply filter
    if (filterBy === "available") {
      items = items.filter(item => item.isAvailable !== false);
    } else if (filterBy === "unavailable") {
      items = items.filter(item => item.isAvailable === false);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title?.toLowerCase().includes(query) || 
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }
    
    // Apply sort
    switch (sortBy) {
      case "date":
        return items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case "date-asc":
        return items.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
      case "price":
        return items.sort((a, b) => a.rate - b.rate);
      case "price-desc":
        return items.sort((a, b) => b.rate - a.rate);
      case "name":
        return items.sort((a, b) => a.title?.localeCompare(b.title || '') || 0);
      default:
        return items;
    }
  };
  

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

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
              <Input 
                placeholder="Search wishlist..." 
                className="w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select 
                defaultValue="date"
                onValueChange={(value) => setSortBy(value)}
              >
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

              <Select 
                defaultValue="all"
                onValueChange={(value) => setFilterBy(value)}
              >
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

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">Loading your wishlist items...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchWishlist}>Try Again</Button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">Items you save to your wishlist will appear here.</p>
              <Link href="/products">
                <Button className="bg-teal-600 hover:bg-teal-700">Browse Products</Button>
              </Link>
            </div>
          ) : getFilteredAndSortedItems().length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground mb-4">No items match your current filters or search.</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSortBy("date");
                setFilterBy("all");
              }}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredAndSortedItems().map((item) => (
                <Card key={item._id} className="group overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.title || "Product image"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 bg-background/80 hover:bg-background/90 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(item._id);
                          }}
                        >
                          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                          <span className="sr-only">Remove from wishlist</span>
                        </Button>
                        {item.isAvailable === false && (
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
                          {item.category || "Other"}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <span>{item.rating || 'N/A'}</span>
                          <span className="text-xs">({item.reviews || 0})</span>
                        </div>
                      </div>
                      <Link href={`/products/${item._id}`} className="group-hover:underline">
                        <h3 className="font-semibold">{item.title}</h3>
                      </Link>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="font-medium">
                          <span className="text-lg">₹{item.rate}</span>
                          <span className="text-sm text-muted-foreground">/{item.rateType || 'day'}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarRange className="h-3.5 w-3.5 mr-1" />
                          {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : 'Recently added'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="w-full space-y-2">
                      <Link href={`/products/${item._id}`}>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700" disabled={item.isAvailable === false}>
                          Rent Now
                        </Button>
                      </Link>
                      <Link href={`/products/${item._id}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
