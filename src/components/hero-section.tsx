"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, MapPin, Clock, Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/stunning-indian-landscape-with-taj-mahal-at-sunset.jpg"
          alt="Beautiful Indian landscape with Taj Mahal at sunset - AI-powered travel planning destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Brain className="h-4 w-4 text-blue-400" />
              <span className="text-white text-sm font-medium">
                Agentic AI Travel Assistant
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space-grotesk text-balance">
            Meet Your Personal
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 block">
              AI Travel Agent
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto text-pretty font-dm-sans">
            Experience the future of travel planning with our intelligent AI
            agent that learns your preferences, adapts to real-time conditions,
            and creates dynamic itineraries that evolve with your journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold group"
              >
                Chat with AI Agent
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg"
            >
              See AI in Action
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-3xl font-bold text-white">100%</span>
              </div>
              <p className="text-white/80">AI-Powered</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-emerald-400 mr-2" />
                <span className="text-3xl font-bold text-white">500+</span>
              </div>
              <p className="text-white/80">Destinations</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="text-3xl font-bold text-white">Real-time</span>
              </div>
              <p className="text-white/80">Adaptation</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-purple-400 mr-2" />
                <span className="text-3xl font-bold text-white">24/7</span>
              </div>
              <p className="text-white/80">AI Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
