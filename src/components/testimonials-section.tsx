"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    image: "/indian-woman-smiling-professional-headshot.jpg",
    rating: 5,
    text: "TripCraft AI planned our Rajasthan trip perfectly! The AI understood we wanted heritage sites but also some adventure. The itinerary was spot-on and booking everything was so easy.",
  },
  {
    name: "Arjun Patel",
    location: "Bangalore",
    image: "/placeholder-h7ex4.png",
    rating: 5,
    text: "As a solo traveler, I was nervous about planning my Kerala backwaters trip. The AI created an amazing itinerary with local experiences I never would have found on my own.",
  },
  {
    name: "Sarah Johnson",
    location: "New York",
    image: "/placeholder-slw3q.png",
    rating: 5,
    text: "Planning our India honeymoon seemed overwhelming until we found TripCraft AI. It created the perfect romantic itinerary covering Goa, Udaipur, and Agra. Absolutely magical!",
  },
  {
    name: "Rahul Gupta",
    location: "Delhi",
    image: "/placeholder-rmnd8.png",
    rating: 5,
    text: "The real-time adjustments saved our Himachal trip when weather changed. The AI instantly rearranged our plans and we still had an incredible adventure. Technology at its finest!",
  },
  {
    name: "Lisa Chen",
    location: "Singapore",
    image: "/placeholder-xq8ym.png",
    rating: 5,
    text: "TripCraft AI made our family trip to Golden Triangle effortless. The kids loved the interactive experiences it recommended, and parents appreciated the cultural depth.",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur",
    image: "/placeholder-4n6lk.png",
    rating: 5,
    text: "Even as a local, TripCraft AI showed me hidden gems in my own state! The AI found experiences and places I had never heard of. Incredible local insights.",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-space-grotesk">
            Loved by Travelers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty font-dm-sans">
            Join thousands of happy travelers who discovered their perfect India experience with TripCraft AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed font-dm-sans">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground font-space-grotesk">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
