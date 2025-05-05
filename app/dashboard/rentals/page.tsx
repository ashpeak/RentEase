import Image from "next/image"
import Link from "next/link"
import { CalendarRange, Check, ChevronRight, Clock, MessagesSquare, X } from "lucide-react"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RentalsPage() {
  // Mock data - would come from API in real application
  const activeRentals = [
    {
      id: 1,
      role: "renting", // renting = user is renting from someone else
      product: {
        id: 101,
        name: "Mountain Bike",
        description: "Trek Fuel EX 8 29er Full Suspension",
        image: "/placeholder.svg?height=120&width=120",
      },
      price: 45,
      period: "day",
      startDate: "2023-08-15",
      endDate: "2023-08-19",
      totalDays: 5,
      daysLeft: 3,
      owner: {
        id: 201,
        name: "David Wilson",
        avatar: "/placeholder.svg?height=48&width=48",
        initials: "DW",
      },
      status: "active",
    },
    {
      id: 2,
      role: "lending", // lending = user is lending to someone else
      product: {
        id: 102,
        name: "DSLR Camera",
        description: "Canon EOS 5D Mark IV with 24-70mm lens",
        image: "/placeholder.svg?height=120&width=120",
      },
      price: 75,
      period: "day",
      startDate: "2023-08-12",
      endDate: "2023-08-15",
      totalDays: 4,
      daysLeft: 1,
      renter: {
        id: 202,
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=48&width=48",
        initials: "SJ",
      },
      status: "active",
    },
  ]

  const pendingRentals = [
    {
      id: 3,
      role: "renting",
      product: {
        id: 103,
        name: "Drone with 4K Camera",
        description: "DJI Mavic Air 2",
        image: "/placeholder.svg?height=120&width=120",
      },
      price: 65,
      period: "day",
      startDate: "2023-08-25",
      endDate: "2023-08-28",
      totalDays: 4,
      owner: {
        id: 203,
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=48&width=48",
        initials: "MC",
      },
      status: "pending",
    },
    {
      id: 4,
      role: "lending",
      product: {
        id: 104,
        name: "DJ Equipment",
        description: "Complete DJ setup with mixer and speakers",
        image: "/placeholder.svg?height=120&width=120",
      },
      price: 120,
      period: "day",
      startDate: "2023-08-20",
      endDate: "2023-08-21",
      totalDays: 2,
      renter: {
        id: 204,
        name: "Emma Rodriguez",
        avatar: "/placeholder.svg?height=48&width=48",
        initials: "ER",
      },
      status: "pending",
    },
  ]

  const completedRentals = [
    {
      id: 5,
      role: "renting",
      product: {
        id: 105,
        name: "Stand Up Paddle Board",
        description: "Inflatable SUP with paddle and pump",
        image: "/placeholder.svg?height=120&width=120",
      },
      price: 30,
      period: "day",
      startDate: "2023-07-15",
      endDate: "2023-07-18",
      totalDays: 4,
      owner: {
        id: 205,
        name: "Jason Lee",
        avatar: "/placeholder.svg?height=48&width=48",
        initials: "JL",
      },
      status: "completed",
      rating: 5,
    },
    {
      id: 6,
      role: "lending",
      product: {
        id: 106,
        name: "Projector and Screen",
        description: "HD Projector with 100-inch screen",
        image: "/placeholder.svg?height=120&width=120",
      },
      price: 45,
      period: "day",
      startDate: "2023-07-10",
      endDate: "2023-07-12",
      totalDays: 3,
      renter: {
        id: 206,
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=48&width=48",
        initials: "AT",
      },
      status: "completed",
      rating: 4,
    },
  ]

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Rentals</h1>
            <p className="text-muted-foreground">Manage all your rental transactions in one place</p>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active ({activeRentals.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingRentals.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedRentals.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6 pt-6">
              {activeRentals.map((rental) => (
                <Card key={rental.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-teal-600 hover:bg-teal-700">
                        {rental.role === "renting" ? "Renting" : "Lending"}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {rental.daysLeft > 0 ? `${rental.daysLeft} days left` : "Due today"}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={rental.product.image || "/placeholder.svg"}
                          alt={rental.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold">{rental.product.name}</h3>
                          <p className="text-sm text-muted-foreground">{rental.product.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarRange className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {rental.startDate} - {rental.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{rental.totalDays} days total</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Rental progress</span>
                            <span>
                              {rental.totalDays - rental.daysLeft}/{rental.totalDays} days
                            </span>
                          </div>
                          <Progress
                            value={((rental.totalDays - rental.daysLeft) / rental.totalDays) * 100}
                            className="h-2"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={rental.role === "renting" ? rental.owner.avatar : rental.renter.avatar}
                                alt={rental.role === "renting" ? rental.owner.name : rental.renter.name}
                              />
                              <AvatarFallback>
                                {rental.role === "renting" ? rental.owner.initials : rental.renter.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {rental.role === "renting" ? rental.owner.name : rental.renter.name}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                            <MessagesSquare className="h-3.5 w-3.5" />
                            Message
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${rental.price}/{rental.period}
                        </div>
                        <div className="text-sm text-muted-foreground">Total: ${rental.price * rental.totalDays}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-4">
                    <div>
                      {rental.role === "renting" ? (
                        <Button variant="outline" size="sm">
                          Report Issue
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          Contact Renter
                        </Button>
                      )}
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/dashboard/rentals/${rental.id}`}>
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-6 pt-6">
              {pendingRentals.map((rental) => (
                <Card key={rental.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{rental.role === "renting" ? "Requested" : "Request Received"}</Badge>
                      <div className="text-sm text-muted-foreground">Starts on {rental.startDate}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={rental.product.image || "/placeholder.svg"}
                          alt={rental.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold">{rental.product.name}</h3>
                          <p className="text-sm text-muted-foreground">{rental.product.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarRange className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {rental.startDate} - {rental.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{rental.totalDays} days total</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={rental.role === "renting" ? rental.owner.avatar : rental.renter.avatar}
                                alt={rental.role === "renting" ? rental.owner.name : rental.renter.name}
                              />
                              <AvatarFallback>
                                {rental.role === "renting" ? rental.owner.initials : rental.renter.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {rental.role === "renting" ? rental.owner.name : rental.renter.name}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                            <MessagesSquare className="h-3.5 w-3.5" />
                            Message
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${rental.price}/{rental.period}
                        </div>
                        <div className="text-sm text-muted-foreground">Total: ${rental.price * rental.totalDays}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-4">
                    {rental.role === "renting" ? (
                      <Button variant="outline" size="sm">
                        Cancel Request
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <X className="h-4 w-4" /> Decline
                        </Button>
                        <Button size="sm" className="gap-1 bg-teal-600 hover:bg-teal-700">
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                      </div>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/rentals/${rental.id}`}>
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6 pt-6">
              {completedRentals.map((rental) => (
                <Card key={rental.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-muted-foreground">
                        {rental.role === "renting" ? "Rented" : "Lent"}
                      </Badge>
                      <div className="text-sm text-muted-foreground">Completed on {rental.endDate}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={rental.product.image || "/placeholder.svg"}
                          alt={rental.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold">{rental.product.name}</h3>
                          <p className="text-sm text-muted-foreground">{rental.product.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarRange className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {rental.startDate} - {rental.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{rental.totalDays} days total</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Rating:</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={i < rental.rating ? "currentColor" : "none"}
                                stroke="currentColor"
                                className={`h-4 w-4 ${
                                  i < rental.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
                                }`}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${rental.price}/{rental.period}
                        </div>
                        <div className="text-sm text-muted-foreground">Total: ${rental.price * rental.totalDays}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-4">
                    {rental.role === "renting" && !rental.rating && (
                      <Button variant="outline" size="sm">
                        Leave Review
                      </Button>
                    )}
                    {rental.role === "lending" && !rental.rating && (
                      <Button variant="outline" size="sm">
                        Rate Renter
                      </Button>
                    )}
                    {rental.rating && (
                      <div className="text-sm text-muted-foreground">
                        {rental.role === "renting" ? "You rated this rental" : "Renter left a review"}
                      </div>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/rentals/${rental.id}`}>
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
