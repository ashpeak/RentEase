"use client"

import { useEffect, useCallback } from "react";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, ShoppingCart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { useAuth } from "@clerk/nextjs";
import { useUserStore } from "@/stores/useUserStore";

export function SiteHeader() {
  const pathname = usePathname()

  const { getToken } = useAuth();
  
  // Extract only what we need from the store with individual selectors
  const itemCount = useNotificationStore(state => state.itemCount);
  const wishlistCount = useNotificationStore(state => state.wishlistCount);
  const fetchItems = useNotificationStore(state => state.fetchItems);
  const user = useUserStore(state => state.profile);

  const fetchNotificationCount = useCallback(async () => {
    const token = await getToken()
    if (token) {
      try {
        fetchItems(token);
      } catch (error) {
        console.error("Error fetching notification count:", error)
      }
    }
  }, [getToken, fetchItems]);

  // Fetch notification count
  useEffect(() => {
    fetchNotificationCount()

    // Setup polling for notification count (every 30 seconds)
    const intervalId = setInterval(fetchNotificationCount, 30000)

    return () => clearInterval(intervalId)
  }, [fetchNotificationCount])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <span className="font-bold text-teal-600">RentEase</span>
              </Link>
              <Link
                href="/"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/" ? "text-foreground" : "text-foreground/60",
                )}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith("/products") ? "text-foreground" : "text-foreground/60",
                )}
              >
                Products
              </Link>
              <Link
                href="/products"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith("/categories") ? "text-foreground" : "text-foreground/60",
                )}
              >
                Categories
              </Link>
              <Link
                href="/"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith("/") ? "text-foreground" : "text-foreground/60",
                )}
              >
                How It Works
              </Link>
              <div className="pt-4">
                <div className="border-t pt-4">
                  <Link
                    href="/dashboard"
                    className={cn(
                      "block transition-colors hover:text-foreground/80",
                      pathname?.startsWith("/dashboard") ? "text-foreground" : "text-foreground/60",
                    )}
                  >
                    Dashboard
                  </Link>
                </div>
                <div className="pt-2">
                  <Link
                    href="/dashboard/wishlist"
                    className={cn(
                      "block transition-colors hover:text-foreground/80",
                      pathname?.startsWith("/dashboard/wishlist") ? "text-foreground" : "text-foreground/60",
                    )}
                  >
                    Wishlist
                  </Link>
                </div>
                <div className="pt-2">
                  <Link
                    href="/cart"
                    className={cn(
                      "block transition-colors hover:text-foreground/80",
                      pathname?.startsWith("/cart") ? "text-foreground" : "text-foreground/60",
                    )}
                  >
                    Cart
                  </Link>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 hidden md:flex items-center space-x-2">
          <span className="hidden font-bold text-xl text-teal-600 sm:inline-block">RentEase</span>
        </Link>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                  pathname === "/" ? "bg-accent text-accent-foreground" : "text-foreground/60",
                )}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  pathname?.startsWith("/products") || pathname?.startsWith("/categories")
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/60",
                )}
              >
                Shop
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-teal-500 to-teal-700 p-6 no-underline outline-none focus:shadow-md"
                        href="/products"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">Browse All Products</div>
                        <p className="text-sm leading-tight text-white/90">
                          Explore our extensive range of rental items
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/products"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Electronics</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Cameras, computers, audio equipment and more
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/products"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Outdoors</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Camping gear, bikes, sports equipment and more
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/products"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">All Categories</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Browse all product categories in our marketplace
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                  pathname?.startsWith("/") ? "bg-accent text-accent-foreground" : "text-foreground/60",
                )}
              >
                How It Works
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/dashboard/wishlist">
              <Button variant="ghost" size="icon" aria-label="Wishlist" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs bg-teal-600 hover:bg-teal-600">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs bg-teal-600 hover:bg-teal-600">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Button>
            </Link>

            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage ?? 'https://api.dicebear.com/9.x/thumbs/svg?seed=${data.username}'} alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/rentals" className="w-full cursor-pointer">
                    My Rentals
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/listings" className="w-full cursor-pointer">
                    My Listings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/messages" className="w-full cursor-pointer">
                    Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/payments" className="w-full cursor-pointer">
                    Payments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="w-full cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="w-full cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <SignedOut>
                  <SignInButton>
                    <DropdownMenuItem className="cursor-pointer">Sign In</DropdownMenuItem>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <SignOutButton>
                    <DropdownMenuItem className="cursor-pointer">Sign Out</DropdownMenuItem>
                  </SignOutButton>
                </SignedIn>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
