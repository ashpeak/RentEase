import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Clock, MinusCircle, PlusCircle, Trash, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CartPage() {
  // Mock cart items - would come from API/state in a real app
  const cartItems = [
    {
      id: 1,
      name: "DSLR Camera",
      description: "Canon EOS 5D Mark IV with 24-70mm lens",
      image: "/placeholder.svg?height=120&width=120",
      price: 75,
      period: "day",
      startDate: "2023-08-15",
      endDate: "2023-08-18",
      days: 4,
      deposit: 500,
    },
    {
      id: 2,
      name: "Mountain Bike",
      description: "Trek Fuel EX 8 29er Full Suspension",
      image: "/placeholder.svg?height=120&width=120",
      price: 45,
      period: "day",
      startDate: "2023-08-20",
      endDate: "2023-08-22",
      days: 3,
      deposit: 300,
    },
  ]

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.days, 0)
  const serviceFee = subtotal * 0.1 // 10% service fee
  const tax = (subtotal + serviceFee) * 0.07 // 7% tax
  const depositTotal = cartItems.reduce((sum, item) => sum + item.deposit, 0)
  const total = subtotal + serviceFee + tax

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue shopping
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
        <p className="text-muted-foreground">Review your items and proceed to checkout</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-40 w-full sm:h-auto sm:w-40 bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${item.price}/{item.period}
                          </div>
                          <div className="text-sm text-muted-foreground">Total: ${item.price * item.days}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-6">
                        <div className="flex gap-2 items-center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <p>
                              {item.startDate} - {item.endDate}
                            </p>
                            <p className="text-muted-foreground">{item.days} days</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                            <MinusCircle className="h-4 w-4" />
                            <span className="sr-only">Decrease days</span>
                          </Button>

                          <span className="text-sm font-medium w-4 text-center">{item.days}</span>

                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                            <PlusCircle className="h-4 w-4" />
                            <span className="sr-only">Increase days</span>
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm font-medium">Security deposit: ${item.deposit}</span>
                        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full dark:bg-amber-900/20 dark:text-amber-300">
                          Refundable
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle>Pickup & Delivery Options</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="pickup" className="space-y-4">
                  <div className="flex items-start space-x-3 border p-4 rounded-md">
                    <RadioGroupItem id="pickup" value="pickup" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="pickup" className="font-medium text-base">
                        In-person pickup
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pick up items directly from the owner at an agreed location
                      </p>
                    </div>
                    <div className="font-medium">Free</div>
                  </div>

                  <div className="flex items-start space-x-3 border p-4 rounded-md">
                    <RadioGroupItem id="local-delivery" value="local-delivery" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="local-delivery" className="font-medium text-base">
                        Local delivery
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Have the owner deliver to your location (within 10 miles)
                      </p>
                    </div>
                    <div className="font-medium">$15.00</div>
                  </div>

                  <div className="flex items-start space-x-3 border p-4 rounded-md">
                    <RadioGroupItem id="shipping" value="shipping" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="shipping" className="font-medium text-base">
                        Shipping
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Have the item shipped to your address (available for select items)
                      </p>
                    </div>
                    <div className="font-medium">$25.00</div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Security deposit (refundable)</span>
                  <span>${depositTotal.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Security deposits are fully refundable when items are returned in the same condition.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Proceed to Checkout</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Have a coupon?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Enter coupon code" />
                  <Button>Apply</Button>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-400">Secure checkout</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-500">
                All payments are processed securely, and deposits are held in escrow until item return.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      ) : (
        <div className="mt-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Looks like you haven't added any items to your cart yet.</p>
          <Button className="mt-8 bg-teal-600 hover:bg-teal-700" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
