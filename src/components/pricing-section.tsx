"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ArrowRight } from "lucide-react"

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: ButtonVariant
  popular: boolean
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Explorer",
    price: "Free",
    period: "",
    description: "Perfect for trying out AI-powered travel planning",
    features: [
      "1 AI-generated itinerary per month",
      "Basic destination recommendations",
      "Standard templates",
      "Email support",
      "Mobile app access"
    ],
    buttonText: "Start Free",
    buttonVariant: "outline",
    popular: false
  },
  {
    name: "Wanderer",
    price: "₹999",
    period: "/month",
    description: "Ideal for frequent travelers and adventure seekers",
    features: [
      "Unlimited AI itineraries",
      "Real-time trip adjustments",
      "Local expert recommendations",
      "One-click booking integration",
      "Priority support",
      "Offline access",
      "Custom budget optimization"
    ],
    buttonText: "Start Planning",
    buttonVariant: "default",
    popular: true
  },
  {
    name: "Nomad Pro",
    price: "₹2,499",
    period: "/month",
    description: "For travel agencies and professional trip planners",
    features: [
      "Everything in Wanderer",
      "Multi-client management",
      "White-label solutions",
      "Advanced analytics",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "Team collaboration tools"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    popular: false
  }
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary text-sm font-medium">Simple Pricing</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-space-grotesk">
            Choose Your Adventure Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty font-dm-sans">
            From free exploration to professional travel planning, find the perfect plan for your journey needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan: PricingPlan) => (
            <Card
              key={plan.name}
              className={`relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${plan.popular
                ? 'border-primary/50 shadow-lg ring-1 ring-primary/20'
                : 'border-border/50 hover:border-primary/20'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <h3 className="text-2xl font-bold text-foreground mb-2 font-space-grotesk">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground text-lg">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground font-dm-sans">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <li key={`${plan.name}-feature-${featureIndex}`} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground font-dm-sans">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full group ${plan.popular
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : ''
                    }`}
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  {plan.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground font-dm-sans mb-4">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span>Secure payment processing</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span>24/7 customer support</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
