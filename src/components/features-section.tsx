"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Brain, MapPin, Clock, MessageSquare, Globe, Zap, Shield, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Intelligent AI Agent",
    description:
      "Our agentic AI learns from every interaction, remembers your preferences, and continuously improves your travel recommendations with machine learning.",
  },
  {
    icon: MessageSquare,
    title: "Natural Conversation",
    description:
      "Chat naturally with your AI travel agent. Ask questions, request changes, or get instant recommendations through intuitive conversation.",
  },
  {
    icon: MapPin,
    title: "Dynamic Itinerary Creation",
    description:
      "Watch your AI agent build personalized itineraries in real-time, considering weather, events, local insights, and your unique preferences.",
  },
  {
    icon: Clock,
    title: "Real-Time Adaptation",
    description:
      "Your AI agent monitors your journey and automatically adjusts plans for weather changes, delays, or new opportunities that arise.",
  },
  {
    icon: Globe,
    title: "Context-Aware Intelligence",
    description:
      "Our AI understands cultural nuances, local customs, and regional preferences to provide authentic, respectful travel recommendations.",
  },
  {
    icon: Zap,
    title: "Instant Decision Making",
    description:
      "Get immediate responses to travel queries, instant booking confirmations, and real-time problem-solving from your AI travel companion.",
  },
  {
    icon: Shield,
    title: "Proactive Safety",
    description:
      "Your AI agent monitors travel advisories, weather alerts, and safety conditions to keep you informed and protected throughout your journey.",
  },
  {
    icon: TrendingUp,
    title: "Learning & Evolution",
    description:
      "The more you travel with our AI, the better it becomes at understanding your style, preferences, and creating perfect experiences.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-space-grotesk">
            Meet Your Intelligent Travel Agent
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto text-pretty font-dm-sans">
            Experience the next generation of travel planning with our agentic AI that thinks, learns, and adapts to create
            the perfect journey for you. No more static itineraries - just intelligent, evolving travel experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 font-space-grotesk">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-dm-sans text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
