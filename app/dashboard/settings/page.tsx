"use client"

import { useState } from "react"
import { Bell, CreditCard, Globe, Lock, ShieldCheck, User } from "lucide-react"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("account")

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <div className="flex overflow-x-auto pb-2">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <TabsTrigger value="account" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="security" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Lock className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="payments" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="preferences" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Globe className="mr-2 h-4 w-4" />
                  Preferences
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    <p className="text-xs text-muted-foreground">
                      We will send you a verification email if you change your email address
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="New York, NY" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deactivate Account</CardTitle>
                  <CardDescription>
                    Temporarily deactivate or permanently delete your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/20">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                      <h3 className="font-medium text-amber-800 dark:text-amber-500">Important Information</h3>
                    </div>
                    <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                      Deactivating your account will hide your profile and listings from other users. You can reactivate
                      your account at any time by logging back in. Deleting your account is permanent and cannot be
                      undone.
                    </p>
                  </div>

                  <RadioGroup defaultValue="deactivate">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deactivate" id="deactivate" />
                      <Label htmlFor="deactivate">Temporarily deactivate my account</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delete" id="delete" />
                      <Label htmlFor="delete">Permanently delete my account</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive">Deactivate Account</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password or enable two-factor authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-teal-600 hover:bg-teal-700">Update Password</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Authenticator App</div>
                      <div className="text-sm text-muted-foreground">
                        Use an authenticator app to generate verification codes
                      </div>
                    </div>
                    <Button variant="outline">Set Up</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Text Message (SMS)</div>
                      <div className="text-sm text-muted-foreground">
                        Receive verification codes via text message
                      </div>
                    </div>
                    <Button variant="outline">Set Up</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login History</CardTitle>
                  <CardDescription>
                    View your recent login activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-[1fr_auto] gap-1">
                      <div>
                        <div className="font-medium">New York, United States</div>
                        <div className="text-sm text-muted-foreground">
                          Yesterday at 2:30 PM • Chrome on Windows
                        </div>
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full h-fit dark:bg-green-900/20 dark:text-green-300">
                        Current
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="font-medium">New York, United States</div>
                      <div className="text-sm text-muted-foreground">
                        August 10, 2023 at 10:15 AM • Safari on macOS
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="font-medium">Boston, United States</div>
                      <div className="text-sm text-muted-foreground">
                        August 5, 2023 at 8:30 PM • Chrome on Android
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View All Activity</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-rental-requests">Rental Requests</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when someone requests to rent your items
                          </p>
                        </div>
                        <Switch id="email-rental-requests" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-messages">Messages</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for new messages
                          </p>
                        </div>
                        <Switch id="email-messages" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-reviews">Reviews</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you receive a new review
                          </p>
                        </div>
                        <Switch id="email-reviews" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-marketing">Marketing & Promotions</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive marketing emails, promotions, and newsletters
                          </p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-rental-requests">Rental Requests</Label>
                          <p className="text-sm text-muted-foreground">
                            Get push notifications for new rental requests
                          </p>
                        </div>
                        <Switch id="push-rental-requests" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-messages">Messages</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications for new messages
                          </p>
                        </div>
                        <Switch id="push-messages" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-reminders">Rental Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Get reminders about upcoming and ending rentals
                          </p>
                        </div>
                        <Switch id="push-reminders" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-teal-600 hover:bg-teal-700">Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods for renting items
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Add Payment Method</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payout Methods</CardTitle>
                  <CardDescription>
                    Set up payout methods to receive money from rentals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Add Payout Method</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Information</CardTitle>
                  <CardDescription>
                    Manage your tax information for reporting income
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax Identification Number</Label>
                    <Input id="tax-id" placeholder="Enter your Tax ID" />
                    <p className="text-xs text-muted-foreground">
                      For US residents, enter your Social Security Number (SSN) or Employer Identification Number (EIN)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-form">Tax Form</Label>
                    <Input id="tax-form" placeholder="Select your tax form" />
                    <p className="text-xs text-muted-foreground">
                      Select the appropriate tax form for your situation
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-status">Tax Status</Label>
                    <Input id="tax-status" placeholder="Select your tax status" />
                    <p className="text-xs text-muted-foreground">
                      Select your tax status for reporting income
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

