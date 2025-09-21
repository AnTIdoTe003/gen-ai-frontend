"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <Brain className="h-4 w-4 text-blue-300" />
            <span className="text-white text-sm font-medium">
              Ready to Meet Your AI Agent?
            </span>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-space-grotesk text-balance">
          Start Your Intelligent
          <span className="block">Travel Journey Today</span>
        </h2>

        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-4xl mx-auto text-pretty font-dm-sans">
          Experience the future of travel planning with our intelligent AI
          agent. Get personalized, adaptive itineraries that evolve with your
          journey. Your perfect travel companion is just one conversation away.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold group"
            >
              Chat with AI Agent
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
          >
            See AI in Action
          </Button>
        </div>

        <p className="text-sm text-primary-foreground/70 mt-6">
          Free to start • No credit card required • AI learns your preferences
        </p>
      </div>
    </section>
  );
}
