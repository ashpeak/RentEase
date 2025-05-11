import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Photographer",
      content:
        "RentEase has been a game-changer for my photography business. I can rent high-end equipment for specific shoots without the huge investment of buying everything.",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Weekend Adventurer",
      content:
        "I love camping but don't have storage space for all the gear. This platform lets me rent quality equipment only when I need it. Saved me thousands!",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Small Business Owner",
      content:
        "As a small business owner, I've been able to generate extra income by renting out equipment we only use occasionally. The platform is intuitive and secure.",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4,
    },
  ]

  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="max-w-[700px] text-muted-foreground mt-2">
            Thousands of people are already saving money and making extra income with RentEase
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-0 bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{testimonial.content}</p>
              </CardContent>
              <CardFooter>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
