import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast"

interface Product {
  _id: number;
  title: string;
  description: string;
  rate: number;
  selectedPricingModel: string;
  images: string;
  averageRating: number;
  numReviews: number;
  location: any;
  category: string;
}

export function RelatedProducts({ category }: { category: string }) {

  const { toast } = useToast();
  const [products, setProducts] = useState<Array<Product>>([]);

  const fetchProducts = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${category}`);
    if (!response.ok) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
    const data = await response.json();
    setProducts(data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return (
    <section className="mt-16">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Related Products</h2>
          <p className="text-muted-foreground">You might also be interested in these items</p>
        </div>
        <Button asChild variant="ghost" className="gap-1">
          <Link href="/products">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        {products.map((product) => (
          <Card key={product._id} className="group overflow-hidden">
            <CardHeader className="p-0">
              <Link href={`/products/${product._id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span>{product.averageRating}</span>
                    <span className="text-xs">({product.numReviews})</span>
                  </div>
                </div>
                <Link href={`/products/${product._id}`} className="group-hover:underline">
                  <h3 className="font-semibold">{product.title}</h3>
                </Link>
                <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <div className="font-medium">
                <span className="text-lg">₹{product.rate}</span>
                <span className="text-sm text-muted-foreground">/{product.selectedPricingModel}</span>
              </div>
              <div className="text-xs text-muted-foreground">{product.location.city}</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
