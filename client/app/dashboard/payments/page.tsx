"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Calendar, ChevronRight, Download, Filter } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types for our payments data
interface PaymentData {
  balance: number
  pendingPayouts: number
  totalEarnings: number
  totalSpent: number
  transactions: Transaction[]
}

interface Transaction {
  id: string
  type: "income" | "expense" | "payout" | "refund"
  amount: number
  status: "completed" | "pending" | "failed"
  description: string
  date: string
  from?: {
    name: string
    avatar?: string
    initials: string
  }
  to?: {
    name: string
    avatar?: string
    initials: string
  }
  product?: string
}

export default function PaymentsPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        
        // Make the actual API call to our backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/payments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch payment data');
        }
        
        const data = await response.json();
        setPaymentData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payment data:', err);
        setError('Could not load payment data. Please try again later.');
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [])

  // Function to format the transaction amount with positive/negative sign
  const formatAmount = (transaction: Transaction) => {
    if (transaction.type === "income") {
      return `+₹${transaction.amount.toFixed(2)}`
    } else {
      return `-₹${transaction.amount.toFixed(2)}`
    }
  }

  // Function to get the transaction status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "outline"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Display loading state
  if (loading) {
    return (
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <DashboardNav />
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
              <p className="text-muted-foreground">Loading payment data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Display error state
  if (error) {
    return (
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <DashboardNav />
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
              <p className="text-red-500">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If not loading and no data, show empty state
  if (!paymentData) {
    return (
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <DashboardNav />
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
              <p className="text-muted-foreground">No payment data available</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            <p className="text-muted-foreground">Manage your payments, transactions and payouts</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{paymentData.balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Available for payout to your bank account</p>
              </CardContent>
              <CardFooter className="p-2">
                <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                  Withdraw Funds
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{paymentData.pendingPayouts.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Will be available within 3-5 business days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{paymentData.totalEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Lifetime earnings from rentals</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{paymentData.totalSpent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Lifetime rental expenses</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment and payout methods</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payment">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                  <TabsTrigger value="payout">Payout Methods</TabsTrigger>
                </TabsList>
                <TabsContent value="payment" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted w-12 h-8 rounded-md flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Visa ending in 4242</div>
                        <div className="text-sm text-muted-foreground">Expires 12/2024</div>
                      </div>
                    </div>
                    <Badge variant="outline">Default</Badge>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </TabsContent>

                <TabsContent value="payout" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted w-12 h-8 rounded-md flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M2 9H22" stroke="currentColor" strokeWidth="2" />
                          <path d="M2 15H7" stroke="currentColor" strokeWidth="2" />
                          <path d="M17 15H22" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Bank Account (ACH)</div>
                        <div className="text-sm text-muted-foreground">Account ending in 6789</div>
                      </div>
                    </div>
                    <Badge variant="outline">Default</Badge>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline">Add Payout Method</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </Button>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px] h-8">
                    <SelectValue placeholder="Transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                    <SelectItem value="payout">Payouts</SelectItem>
                    <SelectItem value="refund">Refunds</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_120px_120px_100px] p-4 bg-muted/50 font-medium text-sm">
                <span>Description</span>
                <span>Date</span>
                <span className="text-right">Amount</span>
                <span className="hidden md:block text-right">Status</span>
              </div>

              <div className="divide-y">
                {paymentData.transactions.map((transaction, i) => (
                  <div
                    key={transaction.id+i}
                    className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_120px_120px_100px] p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/50">
                        {transaction.type === "income" ? (
                          <ArrowDown className="h-4 w-4 text-green-500" />
                        ) : transaction.type === "expense" ? (
                          <ArrowUp className="h-4 w-4 text-red-500" />
                        ) : transaction.type === "payout" ? (
                          <ArrowDown className="h-4 w-4 text-amber-500" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="grid gap-0.5">
                        <div className="font-medium text-sm">{transaction.description}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{transaction.id}</span>
                          {transaction.type === "income" && transaction.from && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <span>From</span>
                                <Avatar className="h-4 w-4">
                                  <AvatarImage
                                    src={transaction.from.avatar || "/placeholder.svg"}
                                    alt={transaction.from.name}
                                  />
                                  <AvatarFallback className="text-[8px]">{transaction.from.initials}</AvatarFallback>
                                </Avatar>
                                <span>{transaction.from.name}</span>
                              </div>
                            </>
                          )}
                          {(transaction.type === "expense" ||
                            transaction.type === "refund" ||
                            transaction.type === "payout") && transaction.to && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <span>To</span>
                                {transaction.to.avatar ? (
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage
                                      src={transaction.to.avatar || "/placeholder.svg"}
                                      alt={transaction.to.name}
                                    />
                                    <AvatarFallback className="text-[8px]">{transaction.to.initials}</AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center">
                                    <span className="text-[8px]">{transaction.to.initials}</span>
                                  </div>
                                )}
                                <span>{transaction.to.name}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                      {transaction.date}
                    </div>
                    <div
                      className={`flex items-center justify-end font-medium ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : transaction.type === "expense" || transaction.type === "refund"
                            ? "text-red-600 dark:text-red-400"
                            : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {formatAmount(transaction)}
                    </div>
                    <div className="hidden md:flex items-center justify-end">
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>{transaction.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 text-center">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all transactions <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
