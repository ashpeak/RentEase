"use client"

import { Check, ChevronRight, Clock, DollarSign, MessageSquare, ShoppingBag, User, Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface NotificationDropdownProps {
  onClose: () => void
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  // These would normally come from an API or state management
  const notifications = [
    {
      id: 1,
      title: "New Rental Request",
      message: "John Smith wants to rent your DSLR Camera",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      read: false,
      type: "request",
      link: "/dashboard/rentals",
    },
    {
      id: 2,
      title: "Payment Received",
      message: "You received $75.00 for Canon DSLR Camera rental",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      type: "payment",
      link: "/dashboard/payments",
    },
    {
      id: 3,
      title: "New Message",
      message: "Emma Wilson: Hi, is the mountain bike still available for next weekend?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: false,
      type: "message",
      link: "/dashboard/messages",
    },
    {
      id: 4,
      title: "Rental Reminder",
      message: "Your rental of the DJ Equipment is due to end tomorrow",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      type: "reminder",
      link: "/dashboard/rentals",
    },
    {
      id: 5,
      title: "New Review",
      message: "Sarah Johnson left a 5-star review on your DJ Equipment",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
      read: true,
      type: "review",
      link: "/dashboard/listings",
    },
  ]

  const getIconForType = (type: string) => {
    switch (type) {
      case "request":
        return <ShoppingBag className="h-5 w-5 text-teal-500" />
      case "payment":
        return <DollarSign className="h-5 w-5 text-green-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "reminder":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "review":
        return <User className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Card className="w-full border shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <CardDescription>You have {notifications.filter((n) => !n.read).length} unread notifications</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="max-h-[350px] overflow-y-auto">
          {notifications.map((notification, index) => (
            <li key={notification.id}>
              <Link
                href={notification.link}
                className="block"
                onClick={() => {
                  // Would normally update the read status in an API
                  onClose()
                }}
              >
                <div
                  className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-muted/30" : ""}`}
                >
                  <div className="mt-1">{getIconForType(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2 text-muted-foreground">{notification.message}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </Link>
              {index < notifications.length - 1 && <Separator />}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between p-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-8"
          onClick={() => {
            // Would normally mark all as read in an API
            onClose()
          }}
        >
          <Check className="h-3 w-3 mr-1" /> Mark all as read
        </Button>
        <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
          <Link href="/dashboard/notifications" onClick={onClose}>
            View all notifications
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
