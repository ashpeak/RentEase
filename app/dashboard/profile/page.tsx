"use client"

import { useState } from "react"
import Image from "next/image"
import { Bell, Camera, Check, MapPin, Star, User } from "lucide-react"

import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false)

  // Mock data - would come from API in real application
  const profile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Hi, I'm John! I'm a photography enthusiast and outdoor adventurer. I love renting out my equipment when I'm not using it and trying new gear for my weekend hiking trips.",
    avatar: "/placeholder.svg?height=200&width=200",
    coverPhoto: "/placeholder.svg?height=400&width=1200",
    memberSince: "January 2022",
    responseRate: "95%",
    responseTime: "Within 1 hour",
    verifications: {
      email: true,
      phone: true,
      government: true,
      facebook: false,
      google: true,
    },
    reviews: {
      asRenter: {
        count: 12,
        average: 4.9,
      },
      asOwner: {
        count: 8,
        average: 4.8,
      },
    },
  }

  // Reviews mock data
  const reviews = [
    {
      id: 1,
      type: "asRenter",
      reviewer: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DW",
      },
      rating: 5,
      date: "Aug 10, 2023",
      comment:
        "John was great to work with! He took excellent care of my mountain bike and returned it in perfect condition. Would definitely rent to him again.",
      product: "Mountain Bike",
    },
    {
      id: 2,
      type: "asOwner",
      reviewer: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SJ",
      },
      rating: 5,
      date: "Jul 25, 2023",
      comment:
        "The DSLR camera was in perfect condition and John provided detailed instructions on how to use it. Fast response and easy pickup/return process.",
      product: "DSLR Camera",
    },
    {
      id: 3,
      type: "asRenter",
      reviewer: {
        name: "Emma Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "ER",
      },
      rating: 5,
      date: "Jul 15, 2023",
      comment: "John was very responsive and took great care of my DJ equipment. Would definitely rent to him again!",
      product: "DJ Equipment",
    },
    {
      id: 4,
      type: "asOwner",
      reviewer: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      rating: 4,
      date: "Jun 30, 2023",
      comment:
        "The tent was clean and in great condition. John was very helpful with setup instructions. Would rent from him again.",
      product: "Luxury Tent",
    },
  ]

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and how others see you</p>
          </div>

          <Card className="overflow-hidden">
            <div className="relative h-40 md:h-60 w-full bg-muted">
              <Image src={profile.coverPhoto || "/placeholder.svg"} alt="Cover photo" fill className="object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 bg-background/80 hover:bg-background/90"
              >
                <Camera className="h-5 w-5" />
                <span className="sr-only">Change cover photo</span>
              </Button>
            </div>
            <CardContent className="p-6 pt-0">
              <div className="flex flex-col md:flex-row gap-6 -mt-12 md:-mt-16">
                <div className="relative">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 bottom-0 h-7 w-7 rounded-full bg-background"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change profile picture</span>
                  </Button>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant={editMode ? "outline" : "default"}
                        className={editMode ? "" : "bg-teal-600 hover:bg-teal-700"}
                        onClick={() => setEditMode(!editMode)}
                      >
                        {editMode ? "Cancel" : "Edit Profile"}
                      </Button>
                      {editMode && (
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setEditMode(false)}>
                          Save Changes
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Member since {profile.memberSince}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Bell className="h-3 w-3" />
                      {profile.responseTime} response time
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {profile.responseRate} response rate
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">As Renter</div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(profile.reviews.asRenter.average)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{profile.reviews.asRenter.average}</span>
                        <span className="text-muted-foreground">({profile.reviews.asRenter.count})</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">As Owner</div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(profile.reviews.asOwner.average)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{profile.reviews.asOwner.average}</span>
                        <span className="text-muted-foreground">({profile.reviews.asOwner.count})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!editMode ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold">About</h3>
                  <p className="mt-2 text-muted-foreground">{profile.bio}</p>
                </div>
              ) : (
                <div className="mt-8 space-y-6">
                  <div className="grid gap-3">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" defaultValue={profile.name} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={profile.location} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      defaultValue={profile.bio}
                      rows={4}
                      placeholder="Tell others about yourself, your interests, and your rental preferences."
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>See what others are saying about you</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="asRenter">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="asRenter">Reviews as Renter ({profile.reviews.asRenter.count})</TabsTrigger>
                    <TabsTrigger value="asOwner">Reviews as Owner ({profile.reviews.asOwner.count})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="asRenter" className="space-y-6 pt-6">
                    {reviews
                      .filter((review) => review.type === "asRenter")
                      .map((review) => (
                        <div key={review.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={review.reviewer.avatar || "/placeholder.svg"}
                                alt={review.reviewer.name}
                              />
                              <AvatarFallback>{review.reviewer.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.reviewer.name}</div>
                              <div className="text-xs text-muted-foreground">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm">{review.comment}</p>
                          <div className="text-xs text-muted-foreground">For: {review.product}</div>
                          <Separator className="mt-4" />
                        </div>
                      ))}

                    <Button variant="outline" className="w-full">
                      View All Renter Reviews
                    </Button>
                  </TabsContent>
                  <TabsContent value="asOwner" className="space-y-6 pt-6">
                    {reviews
                      .filter((review) => review.type === "asOwner")
                      .map((review) => (
                        <div key={review.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={review.reviewer.avatar || "/placeholder.svg"}
                                alt={review.reviewer.name}
                              />
                              <AvatarFallback>{review.reviewer.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.reviewer.name}</div>
                              <div className="text-xs text-muted-foreground">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm">{review.comment}</p>
                          <div className="text-xs text-muted-foreground">For: {review.product}</div>
                          <Separator className="mt-4" />
                        </div>
                      ))}

                    <Button variant="outline" className="w-full">
                      View All Owner Reviews
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verifications</CardTitle>
                <CardDescription>Build trust with verified information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${profile.verifications.email ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Email</span>
                  </div>
                  {profile.verifications.email ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Verify
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${profile.verifications.phone ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Phone Number</span>
                  </div>
                  {profile.verifications.phone ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Verify
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${profile.verifications.government ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Government ID</span>
                  </div>
                  {profile.verifications.government ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Verify
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${profile.verifications.facebook ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Facebook</span>
                  </div>
                  {profile.verifications.facebook ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-5 w-5 ${profile.verifications.google ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span>Google</span>
                  </div>
                  {profile.verifications.google ? (
                    <Badge variant="outline" className="text-green-500 border-green-200">
                      Verified
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  More verifications means more trust from the community and higher rental success rates.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
