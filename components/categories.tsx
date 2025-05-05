import Link from "next/link"
import {
  ArrowRight,
  Bike,
  Camera,
  Car,
  Cpu,
  Headphones,
  Home,
  Laptop,
  Music,
  Shirt,
  Tent,
  Tv,
  Utensils,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function Categories() {
  const categories = [
    {
      name: "Electronics",
      icon: Cpu,
      count: 245,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    },
    {
      name: "Cameras",
      icon: Camera,
      count: 128,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
    },
    {
      name: "Audio",
      icon: Headphones,
      count: 97,
      color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
    },
    {
      name: "Computers",
      icon: Laptop,
      count: 156,
      color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    },
    {
      name: "Sports",
      icon: Bike,
      count: 184,
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
    },
    {
      name: "Camping",
      icon: Tent,
      count: 112,
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
    },
    {
      name: "Vehicles",
      icon: Car,
      count: 68,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
    },
    {
      name: "Home",
      icon: Home,
      count: 215,
      color: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
    },
    {
      name: "Clothing",
      icon: Shirt,
      count: 92,
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
    },
    {
      name: "Kitchen",
      icon: Utensils,
      count: 143,
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
    },
    {
      name: "Entertainment",
      icon: Tv,
      count: 76,
      color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300",
    },
    {
      name: "Music",
      icon: Music,
      count: 89,
      color: "bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300",
    },
  ]

  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Browse Categories</h2>
            <p className="text-muted-foreground">Find what you need from our wide range of rental categories</p>
          </div>
          <Button asChild variant="ghost" className="gap-1">
            <Link href="/categories">
              View all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-8">
          {categories.map((category) => (
            <Card key={category.name} className="group overflow-hidden">
              <Link href={`/categories/${category.name.toLowerCase()}`}>
                <CardContent className="p-4 text-center">
                  <div
                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${category.color}`}
                  >
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{category.count} items</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="ghost" size="sm" className="w-full">
                    Browse
                  </Button>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
