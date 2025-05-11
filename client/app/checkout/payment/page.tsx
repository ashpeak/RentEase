"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, CreditCard, Landmark, Clock, Shield } from "lucide-react"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function PaymentPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  useEffect(() => {
    // Get order details from localStorage instead of URL params
    const orderDetailsStr = localStorage.getItem('rentalOrderDetails')
    if (orderDetailsStr) {
      try {
        const parsedOrderDetails = JSON.parse(orderDetailsStr)
        setOrderDetails(parsedOrderDetails)
      } catch (error) {
        console.error('Failed to parse order details:', error)
      }
    }
  }, [])
  
  if (!orderDetails) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center">
        <Alert variant="destructive">
          <AlertTitle>Invalid Order</AlertTitle>
          <AlertDescription>
            We couldn't find the order details. Please go back to your cart and try again.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" asChild>
          <Link href="/cart">Return to Cart</Link>
        </Button>
      </div>
    )
  }

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      
      // 1. Create order
      const orderResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          ...orderDetails,
          paymentMethod,
          paymentStatus: "paid"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
        // 2. Clear cart
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      // Clear order details from localStorage
      localStorage.removeItem('rentalOrderDetails')
      
      setPaymentStatus("success")
      
      toast({
        title: "Payment successful!",
        description: `Your order #${orderResponse.data.orderNumber} has been confirmed.`,
      })
    } catch (error: any) {
      console.error("Payment processing error:", error)
      toast({
        title: "Payment processing failed",
        description: error.response?.data?.message || "Something went wrong processing your payment.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentFailure = () => {
    setPaymentStatus("failed")
    toast({
      title: "Payment failed",
      description: "Your payment could not be processed. Please try again with a different payment method.",
      variant: "destructive",
    })
  }

  const resetPayment = () => {
    setPaymentStatus("pending")
  }

  if (paymentStatus === "success") {
    return (
      <div className="container py-20 max-w-md mx-auto text-center">
        <div className="rounded-full bg-green-100 w-20 h-20 mx-auto flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Your payment has been processed successfully. Your items have been added to your orders.
        </p>
        <div className="space-y-4">
          <Button className="w-full bg-teal-600 hover:bg-teal-700" asChild>
            <Link href="/dashboard/rentals">View My Orders</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (paymentStatus === "failed") {
    return (
      <div className="container py-20 max-w-md mx-auto text-center">
        <div className="rounded-full bg-red-100 w-20 h-20 mx-auto flex items-center justify-center mb-6">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          There was a problem processing your payment. No charges have been made.
        </p>
        <div className="space-y-4">
          <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={resetPayment}>
            Try Again
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/cart">Return to Cart</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to cart
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">Complete your order by providing payment details</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="card">Credit Card</TabsTrigger>
                <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                <TabsTrigger value="wallet">Digital Wallet</TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="4111 1111 1111 1111" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" placeholder="John Smith" />
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <Alert>
                  <Landmark className="h-4 w-4" />
                  <AlertTitle>Bank Transfer</AlertTitle>
                  <AlertDescription>
                    Make a direct bank transfer to our account. Your order will be processed once payment is confirmed.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-medium">Universal Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-medium">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IFSC Code:</span>
                    <span className="font-medium">UBPL0001234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium">Rental Marketplace Pvt Ltd</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4">
                <RadioGroup defaultValue="paytm">
                  <div className="flex items-center space-x-2 space-y-0 p-4 border rounded-md">
                    <RadioGroupItem value="paytm" id="paytm" />
                    <Label htmlFor="paytm" className="flex-1 cursor-pointer">Paytm</Label>
                    <Image src="/placeholder.svg" width={40} height={40} alt="Paytm" />
                  </div>
                  <div className="flex items-center space-x-2 space-y-0 p-4 border rounded-md">
                    <RadioGroupItem value="gpay" id="gpay" />
                    <Label htmlFor="gpay" className="flex-1 cursor-pointer">Google Pay</Label>
                    <Image src="/placeholder.svg" width={40} height={40} alt="Google Pay" />
                  </div>
                  <div className="flex items-center space-x-2 space-y-0 p-4 border rounded-md">
                    <RadioGroupItem value="phonepe" id="phonepe" />
                    <Label htmlFor="phonepe" className="flex-1 cursor-pointer">PhonePe</Label>
                    <Image src="/placeholder.svg" width={40} height={40} alt="PhonePe" />
                  </div>
                </RadioGroup>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button 
                onClick={handlePaymentSuccess} 
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Processing..." : "Simulate Payment Success"}
              </Button>
              <Button 
                onClick={handlePaymentFailure} 
                variant="outline" 
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={loading}
              >
                Simulate Payment Failure
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              This is a mock payment page for demonstration purposes. No actual payment will be processed.
            </p>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{orderDetails.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span>₹{orderDetails.serviceFee.toFixed(2)}</span>
              </div>
              {orderDetails.deliveryFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Delivery fee</span>
                  <span>₹{orderDetails.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>₹{orderDetails.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>₹{orderDetails.finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Security deposit (refundable)</span>
                <span>₹{orderDetails.depositTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{orderDetails.items.length} items, {orderDetails.totalDays} rental days</span>
              </div>
              <div className="flex items-center">
                <Shield className="mr-1 h-4 w-4" />
                <span>Secure payment</span>
              </div>
            </CardFooter>
          </Card>

          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50">
            <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-400">Demo payment gateway</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-500">
              This is a demo payment page. Choose "Simulate Payment Success" or "Simulate Payment Failure" to see the respective flows.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
