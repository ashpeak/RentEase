"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, Check, Info, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function ListItemPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Item listed successfully!",
      description: "Your item has been listed and is now available for rent.",
    })
  }
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">List Your Item</h1>
          <p className="text-muted-foreground">
            Share your items with others and earn money when they rent from you
          </p>
        </div>

        <div className="mt-8">
          <div className="relative mb-12">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"></div>
            <ol className="relative z-10 flex justify-between">
              {[1, 2, 3].map((step) => (
                <li key={step} className="flex items-center justify-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      currentStep >= step
                        ? "bg-teal-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step ? <Check className="h-4 w-4" /> : step}
                  </div>
                </li>
              ))}
            </ol>
            <ol className="relative z-0 flex justify-between px-2 pt-3 text-sm">
              <li className="text-center font-medium">Item Details</li>
              <li className="text-center font-medium">Photos & Pricing</li>
              <li className="text-center font-medium">Rules & Availability</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                  <CardDescription>
                    Provide detailed information about your item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Item Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Professional DSLR Camera"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      A clear, descriptive title helps renters find your item
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="cameras">Cameras</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="computers">Computers</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="camping">Camping</SelectItem>
                        <SelectItem value="vehicles">Vehicles</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail, including condition, features, and any included accessories"
                      rows={5}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Be specific about the condition, features, and any included accessories
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" placeholder="e.g., Canon" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input id="model" placeholder="e.g., EOS 5D Mark IV" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">
                      Condition <span className="text-red-500">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Like New</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="worn">Worn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    type="button"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos & Pricing</CardTitle>
                  <CardDescription>
                    Add photos and set your rental pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>
                      Photos <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      <div className="relative flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 p-2">
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <div className="text-xs font-medium">Main Photo</div>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                          >
                            <Upload className="mr-1 h-3 w-3" />
                            Upload
                          </Button>
                        </div>
                      </div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="relative flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 p-2"
                        >
                          <div className="flex flex-col items-center justify-center space-y-2 text-center">
                            <Camera className="h-8 w-8 text-muted-foreground" />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="text-xs"
                            >
                              <Upload className="mr-1 h-3 w-3" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload clear, well-lit photos from multiple angles. The first photo will be your main listing image.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>
                        Pricing <span className="text-red-500">*</span>
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4"  size="icon" />
                              <span className="sr-only">Pricing Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">
                              Set competitive prices to attract renters. Consider the item's value, condition, and market rates when pricing.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Tabs defaultValue="daily">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      </TabsList>
                      <TabsContent value="daily" className="space-y-4 pt-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="daily-price">
                              Daily Price ($) <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                              <Input
                                id="daily-price"
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-7"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="min-rental-days">
                              Minimum Rental Days <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="min-rental-days"
                              type="number"
                              min="1"
                              defaultValue="1"
                              required
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="weekly" className="space-y-4 pt-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="weekly-price">
                              Weekly Price ($) <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                              <Input
                                id="weekly-price"
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-7"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="min-rental-weeks">
                              Minimum Rental Weeks
                            </Label>
                            <Input
                              id="min-rental-weeks"
                              type="number"
                              min="1"
                              defaultValue="1"
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="monthly" className="space-y-4 pt-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="monthly-price">
                              Monthly Price ($)
                            </Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                              <Input
                                id="monthly-price"
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-7"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="min-rental-months">
                              Minimum Rental Months
                            </Label>
                            <Input
                              id="min-rental-months"
                              type="number"
                              min="1"
                              defaultValue="1"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-deposit">
                      Security Deposit ($) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="security-deposit"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This refundable amount will be held as security against damage or loss
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={() => setCurrentStep(3)}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Availability</CardTitle>
                  <CardDescription>
                    Set rental rules and availability for your item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="rental-rules">
                      Rental Rules <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="rental-rules"
                      placeholder="Specify any rules or requirements for renting your item"
                      rows={4}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Include any specific requirements, restrictions, or care instructions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickup-location">
                      Pickup/Delivery Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pickup-location"
                      placeholder="e.g., New York, NY"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the general area where renters can pick up the item
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Delivery Options
                    </Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="pickup" className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="pickup" className="text-sm font-normal">
                          In-person pickup
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="local-delivery" className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="local-delivery" className="text-sm font-normal">
                          Local delivery
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="shipping" className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="shipping" className="text-sm font-normal">
                          Shipping
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Availability <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="available-from">Available From</Label>
                        <Input
                          id="available-from"
                          type="date"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="available-to">Available To</Label>
                        <Input
                          id="available-to"
                          type="date"
                        />
                        <p className="text-xs text-muted-foreground">
                          Leave blank if always available
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="terms" className="h-4 w-4 rounded border-gray-300" required />
                      <Label htmlFor="terms" className="text-sm font-normal">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          privacy policy
                        </Link>
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    List Item
                  </Button>
                </CardFooter>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
