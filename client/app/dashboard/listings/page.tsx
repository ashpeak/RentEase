"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Edit, Eye, Star, ToggleLeft, ToggleRight, Trash } from "lucide-react";
import axios from "axios";

import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Trash as TrashIcon } from "lucide-react";


interface ListingsPageProps {
  _id: string;
  title: string;
  description: string;
  images: string[];
  viewCount: number;
  category: string;
  tags: string[];
  condition: string;
  rate: number;
  securityDeposit: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      type: string;
      coordinates: number[];
    };
  };
  availabilityCalendar: {
    startDate: string;
    endDate: string;
    _id: string;
  }[];
  userId: string;
  isAvailable: boolean;
  isApproved: boolean;
  specifications: {
    brand: string;
    model: string;
    minRentalDays: number;
    minRentalWeeks: number;
    minRentalMonths: number;
    rentalRules: string;
    deliveryOptions: {
      pickup: boolean;
      localDelivery: boolean;
      shipping: boolean;
    };
  };
  selectedPricingModel: string;
  createdAt: string;
  updatedAt: string;
};

export default function ListingsPage() {
  const { userId, getToken } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<ListingsPageProps[]>([]);
  const [activeListings, setActiveListings] = useState<ListingsPageProps[]>([]);
  const [inactiveListings, setInactiveListings] = useState<ListingsPageProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/user/my-listings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const allListings = response.data.products || [];
      setListings(allListings);
      setActiveListings(allListings.filter((listing: ListingsPageProps) => listing.isAvailable));
      setInactiveListings(allListings.filter((listing: ListingsPageProps) => !listing.isAvailable));
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Error",
        description: "Failed to load your listings. Please try again.",
        variant: "destructive",
      });
      setListings([]);
      setActiveListings([]);
      setInactiveListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, getToken, toast]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDeleteListing = async (listingId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error Deleting Listing",
          description: errorData.message || "An unexpected error occurred.",
          variant: "destructive",
        });
        // Return early if deletion failed
        return;
      }

      // Remove the deleted listing from all local states
      setListings((prevData) => prevData.filter((listing) => listing._id !== listingId));
      setActiveListings((prevData) => prevData.filter((listing) => listing._id !== listingId));
      setInactiveListings((prevData) => prevData.filter((listing) => listing._id !== listingId));

      toast({
        title: "Listing Deleted",
        description: "The listing has been successfully deleted.",
      });

    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error Deleting Listing",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (listingId: string, currentAvailability: boolean) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${listingId}/toggle-availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update listing availability");
      }

      // Refetch data to update UI
      await fetchListings();

      toast({
        title: "Listing Updated",
        description: `Listing has been successfully ${currentAvailability ? "paused" : "activated"}.`,
      });

    } catch (error) {
      console.error("Error toggling listing availability:", error);
      toast({
        title: "Error Updating Listing",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />
        <div className="space-y-6">
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
                  <p className="text-2xl font-bold">{listings.length}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Active Listings</span>
                  <p className="text-2xl font-bold">{activeListings.length}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total Rentals</span>
                  <p className="text-2xl font-bold">
                    {Array.isArray(listings) && listings.length}
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

          {/* Tabs for different listing views */}
          <Tabs defaultValue="active">
            <div className="flex justify-between">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
                <TabsTrigger value="inactive">Inactive ({inactiveListings.length})</TabsTrigger>
              </TabsList>
            </div>

            {/* Grid View */}
            <TabsContent value="active" className="space-y-6 pt-6 mt-0">
              {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">Loading your listings...</div>
              ) : activeListings.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No active listings found.</div>
              ) : (
                <>
                  {activeListings.map((listing) => (
                    <Card key={listing._id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative h-48 sm:h-auto sm:w-40 w-full bg-muted">
                            <Image
                              src={listing.images[0] || "/placeholder.svg"}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{listing.title}</h3>
                                  <Badge variant="outline" className="text-xs">
                                    {listing.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
                              </div>
                              <div className="text-right pl-4">
                                <div className="font-medium">
                                  ₹{listing.rate}/{listing.selectedPricingModel}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                  <span>4.9</span>
                                  <span>(5 reviews)</span>
                                </div>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Views</span>
                                <p className="font-medium">{listing.viewCount ?? '0'}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Rentals</span>
                                <p className="font-medium">5</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Income</span>
                                <p className="font-medium">₹566</p>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Listed on {formatDistanceToNow(listing.createdAt)}</span>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                                <Link href={`/products/${listing._id}`}>
                                  <Eye className="h-3.5 w-3.5" />
                                  View
                                </Link>
                              </Button>
                              <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                                <Link href={`/dashboard/listings/${listing._id}/edit`}>
                                  <Edit className="h-3.5 w-3.5" />
                                  Edit
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1"
                                onClick={() => handleToggleAvailability(listing._id, listing.isAvailable)}
                              >
                                {listing.isAvailable ? <ToggleLeft className="h-3.5 w-3.5" /> : <ToggleRight className="h-3.5 w-3.5" />}
                                {listing.isAvailable ? "Pause" : "Activate"}
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
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                                    onClick={() => {}}
                                  >
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete listing
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button asChild size="sm" className="ml-auto h-8 bg-teal-600 hover:bg-teal-700">
                                <Link href={`/dashboard/listings/${listing._id}`}>
                                  Analytics <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </TabsContent>

            {/* List View */}
            <TabsContent value="inactive" className="mt-6">
              {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">Loading your listings...</div>
              ) : inactiveListings.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No inactive listings found.</div>
              ) : (
                <div className="space-y-4">
                  {inactiveListings.map((listing) => (
                    <Card key={listing._id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative h-48 sm:h-auto sm:w-40 w-full bg-muted">
                            <Image
                              src={listing.images[0] || "/placeholder.svg"}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{listing.title}</h3>
                                  <Badge variant="outline" className="text-xs">
                                    {listing.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{listing.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  ₹{listing.rate}/{listing.selectedPricingModel}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                  <span>4.9</span>
                                  <span>(5 reviews)</span>
                                </div>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Views</span>
                                <p className="font-medium">{listing.viewCount ?? '0'}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Rentals</span>
                                <p className="font-medium">5</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-muted-foreground">Income</span>
                                <p className="font-medium">₹566</p>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Listed on {formatDistanceToNow(listing.createdAt)}</span>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                                <Link href={`/products/${listing._id}`}>
                                  <Eye className="h-3.5 w-3.5" />
                                  View
                                </Link>
                              </Button>
                              <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                                <Link href={`/dashboard/listings/${listing._id}/edit`}>
                                  <Edit className="h-3.5 w-3.5" />
                                  Edit
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1"
                                onClick={() => handleToggleAvailability(listing._id, listing.isAvailable)}
                              >
                                {listing.isAvailable ? <ToggleLeft className="h-3.5 w-3.5" /> : <ToggleRight className="h-3.5 w-3.5" />}
                                {listing.isAvailable ? "Pause" : "Activate"}
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
                                <Link href={`/dashboard/listings/${listing._id}`}>
                                  Analytics <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function Plus({ className, ...props }: { className?: string }) {
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
