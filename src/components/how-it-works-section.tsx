"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Brain, MapPin, Zap } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Chat with Your AI Agent",
    description:
      "Start a natural conversation with your AI travel agent. Share your dreams, preferences, budget, and timeline. The AI learns and adapts to your style.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Agent Analyzes & Plans",
    description:
      "Your AI agent processes real-time data, local insights, weather patterns, and cultural factors to create a dynamic, personalized itinerary that evolves.",
  },
  {
    step: "03",
    icon: MapPin,
    title: "Interactive Itinerary Building",
    description:
      "Watch your AI agent build your itinerary in real-time. Ask questions, request changes, and see instant updates as your plan takes shape.",
  },
  {
    step: "04",
    icon: Zap,
    title: "Continuous AI Support",
    description:
      "Your AI agent stays with you throughout your journey, adapting to changes, providing real-time recommendations, and solving problems as they arise.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-space-grotesk">
            How Your AI Travel Agent Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto text-pretty font-dm-sans">
            Experience the future of travel planning with our intelligent AI agent that thinks, learns, and adapts to create
            the perfect journey for you. No static plans - just dynamic, intelligent travel experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary/20 font-space-grotesk">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 font-space-grotesk">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-dm-sans">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/20 transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
