"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, CreditCard, Heart, Home, ListChecks, Package, Settings, Upload, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "My Rentals",
      href: "/dashboard/rentals",
      icon: Package,
    },
    {
      title: "My Listings",
      href: "/dashboard/listings",
      icon: Upload,
    },
    {
      title: "Wishlist",
      href: "/dashboard/wishlist",
      icon: Heart,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: ListChecks,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 px-2">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">john.doe@example.com</p>
        </div>
      </div>
      <nav className="grid gap-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn("justify-start", pathname === item.href && "bg-muted font-medium")}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  )
}
