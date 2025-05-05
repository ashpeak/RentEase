import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Bell, Calendar, CreditCard, DollarSign, Heart, Package, Star, Upload, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your rental activity.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,248.50</div>
                <p className="text-xs text-muted-foreground">+18.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 as renter, 1 as owner</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Listed Items</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">5 active, 2 paused</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.9</div>
                <p className="text-xs text-muted-foreground">From 28 reviews</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="rentals">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rentals">My Rentals</TabsTrigger>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>
            <TabsContent value="rentals" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Current Rentals</h2>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link href="/dashboard/rentals">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge>Renting</Badge>
                      <div className="text-sm text-muted-foreground">3 days left</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md">
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          alt="Mountain Bike"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Mountain Bike</h3>
                        <p className="text-sm text-muted-foreground">Trek Fuel EX 8 29er</p>
                        <div className="mt-2 flex items-center text-sm">
                          <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                          <span>Apr 10 - Apr 17, 2023</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <div className="font-medium">
                      <span>$45</span>
                      <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge>Renting</Badge>
                      <div className="text-sm text-muted-foreground">1 day left</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md">
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          alt="DSLR Camera"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">DSLR Camera</h3>
                        <p className="text-sm text-muted-foreground">Canon EOS 5D Mark IV</p>
                        <div className="mt-2 flex items-center text-sm">
                          <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                          <span>Apr 12 - Apr 15, 2023</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <div className="font-medium">
                      <span>$75</span>
                      <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <h2 className="text-xl font-semibold mt-8">Rental History</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Completed</Badge>
                      <div className="text-sm text-muted-foreground">Mar 25, 2023</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md">
                        <Image src="/placeholder.svg?height=80&width=80" alt="Drone" fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Drone with 4K Camera</h3>
                        <p className="text-sm text-muted-foreground">DJI Mavic Air 2</p>
                        <div className="mt-2 flex items-center text-sm">
                          <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                          <span>Mar 20 - Mar 25, 2023</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <div className="font-medium">
                      <span>$65</span>
                      <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="listings" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Listed Items</h2>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/list-item">List New Item</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="gap-1">
                    <Link href="/dashboard/listings">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-teal-600 hover:bg-teal-700">Active</Badge>
                      <div className="text-sm text-muted-foreground">5 rentals</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md">
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          alt="Professional DSLR Camera"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Professional DSLR Camera</h3>
                        <p className="text-sm text-muted-foreground">Canon EOS 5D Mark IV</p>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <div className="flex items-center">
                            <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
                            <span>4.9</span>
                          </div>
                          <span>•</span>
                          <span>Listed on Apr 1, 2023</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <div className="font-medium">
                      <span>$75</span>
                      <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Listing
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-teal-600 hover:bg-teal-700">Active</Badge>
                      <div className="text-sm text-muted-foreground">2 rentals</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md">
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          alt="DJ Equipment Set"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">DJ Equipment Set</h3>
                        <p className="text-sm text-muted-foreground">Complete DJ setup</p>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <div className="flex items-center">
                            <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
                            <span>4.8</span>
                          </div>
                          <span>•</span>
                          <span>Listed on Mar 15, 2023</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <div className="font-medium">
                      <span>$120</span>
                      <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Listing
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Wishlist</h2>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link href="/dashboard/wishlist">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Luxury Tent"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 bg-background/80 hover:bg-background/90"
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        <span className="sr-only">Remove from wishlist</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Luxury Tent</h3>
                    <p className="text-sm text-muted-foreground">6-Person Waterproof Camping Tent</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="font-medium">
                        <span>$35</span>
                        <span className="text-sm text-muted-foreground">/day</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
                        <span>4.7</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">Rent Now</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Stand Up Paddle Board"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 bg-background/80 hover:bg-background/90"
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        <span className="sr-only">Remove from wishlist</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Stand Up Paddle Board</h3>
                    <p className="text-sm text-muted-foreground">Inflatable SUP with paddle and pump</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="font-medium">
                        <span>$30</span>
                        <span className="text-sm text-muted-foreground">/day</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
                        <span>4.6</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">Rent Now</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to increase trust and get more rentals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Profile completion</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="grid gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Verify your identity</span>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Upload your ID to verify your identity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Add payment method</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Add a payment method for rentals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Set up notifications</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Configure your notification preferences</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/settings">Complete Your Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
