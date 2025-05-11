"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Clock, Trash, ShoppingCart, Loader2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNotificationStore } from "@/stores/useNotificationStore"

interface CartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: string[];
    rate: number;
    category: string;
    isAvailable: boolean;
    securityDeposit: number;
    description: string;
  };
  startDate: string;
  endDate: string;
  days: number;
  message: string;
  price: number;
  securityDeposit: number;
  addedAt: string;
}

interface CartResponse {
  items: CartItem[];
  total: number;
  updatedAt: string;
}

export default function CartPage() {
  const router = useRouter();
  const { getToken, userId, isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [isRemoving, setIsRemoving] = useState<{ [key: string]: boolean }>({});
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const fetchItems = useNotificationStore(state => state.fetchItems);

  // Calculate additional fees
  const serviceFee = total * 0.1; // 10% service fee
  const tax = (total + serviceFee + deliveryFee) * 0.07; // 7% tax
  const depositTotal = cartItems?.reduce((sum, item) => sum + item.securityDeposit, 0);
  const finalTotal = total + serviceFee + tax + deliveryFee;

  useEffect(() => {
    // Set delivery fee based on selected option
    if (deliveryOption === "pickup") {
      setDeliveryFee(0);
    } else if (deliveryOption === "local-delivery") {
      setDeliveryFee(15);
    } else if (deliveryOption === "shipping") {
      setDeliveryFee(25);
    }
  }, [deliveryOption]);

  const fetchCart = async () => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      setLoading(false);
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get<CartResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCartItems(response.data.items);
      setTotal(response.data.total);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError(err.response?.data?.message || "Failed to load cart");
      toast({
        title: "Error",
        description: "Failed to load cart items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setIsRemoving(prev => ({ ...prev, [itemId]: true }));
      const token = await getToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh cart after removing
      await fetchCart();

      token && fetchItems(token);
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (err: any) {
      console.error("Error removing item:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(prev => ({ ...prev, [itemId]: false }));
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoaded, isSignedIn, userId]);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }

    setCheckoutLoading(true);
    
    try {
      // Calculate total rental days across all items
      const totalDays = cartItems.reduce((sum, item) => sum + item.days, 0);
      
      // Prepare order details to send to payment page
      const orderDetails = {
        items: cartItems,
        total,
        serviceFee,
        deliveryFee,
        tax,
        finalTotal,
        depositTotal,
        deliveryOption,
        totalDays
      };
      
      // Store order details in localStorage instead of URL parameter
      localStorage.setItem('rentalOrderDetails', JSON.stringify(orderDetails));
      
      // Redirect to payment page without order details in URL
      router.push('/checkout/payment');
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      });
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }

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

      {error && (
        <Alert className="mt-6 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50">
          <AlertTitle className="text-red-800 dark:text-red-400">Error loading cart</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-500">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {!loading && cartItems?.length > 0 ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {cartItems?.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-40 w-full sm:h-auto sm:w-40 bg-muted">
                      <Image 
                        src={item.product.images?.[0] || "/placeholder.svg"} 
                        alt={item.product.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{item.product.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.product.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ₹{item.product.rate}/day
                          </div>
                          <div className="text-sm text-muted-foreground">Total: ₹{item.price}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-6">
                        <div className="flex gap-2 items-center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <p>
                              {formatDate(item.startDate)} - {formatDate(item.endDate)}
                            </p>
                            <p className="text-muted-foreground">{item.days} days</p>
                          </div>
                        </div>
                      </div>

                      {item.message && (
                        <div className="mt-4 text-sm">
                          <p className="font-medium">Message to owner:</p>
                          <p className="text-muted-foreground">{item.message}</p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm font-medium">Security deposit: ₹{item.securityDeposit}</span>
                        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full dark:bg-amber-900/20 dark:text-amber-300">
                          Refundable
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          onClick={() => removeFromCart(item._id)}
                          disabled={isRemoving[item._id]}
                        >
                          {isRemoving[item._id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
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
                <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="space-y-4">
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
                    <div className="font-medium">₹15.00</div>
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
                    <div className="font-medium">₹25.00</div>
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
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>₹{serviceFee.toFixed(2)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delivery fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Security deposit (refundable)</span>
                  <span>₹{depositTotal.toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Security deposits are fully refundable when items are returned in the same condition.
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-teal-600 hover:bg-teal-700" 
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
                </Button>
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
