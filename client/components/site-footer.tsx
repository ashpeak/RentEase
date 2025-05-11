import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="flex flex-col gap-2">
          <Link href="/" className="font-bold text-xl text-teal-600">
            RentEase
          </Link>
          <p className="text-sm text-muted-foreground">
            Rent anything from anyone, anywhere. The peer-to-peer marketplace for all your rental needs.
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="ghost" size="icon" asChild aria-label="Facebook">
              <Link href="#">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Twitter">
              <Link href="#">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Instagram">
              <Link href="#">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="LinkedIn">
              <Link href="#">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Quick Links</h3>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-foreground">
                Browse Products
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-foreground">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-foreground">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Help & Support</h3>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-foreground">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/trust-safety" className="hover:text-foreground">
                Trust & Safety
              </Link>
            </li>
          </ul>
        </div>
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Newsletter</h3>
          <p className="text-sm text-muted-foreground">
            Subscribe to our newsletter for the latest updates and offers.
          </p>
          <form className="mt-2 flex gap-2">
            <Input type="email" placeholder="Enter your email" className="max-w-[220px]" required />
            <Button type="submit" size="sm">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} RentEase. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
