"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, MapPin, Clock, Zap, Plane, Search } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-easemytrip-light to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-easemytrip-primary/5 to-easemytrip-secondary/5" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-easemytrip-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-easemytrip-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-easemytrip-primary/10 backdrop-blur-sm rounded-full px-6 py-3 border border-easemytrip-primary/20">
              <Brain className="h-5 w-5 text-easemytrip-primary" />
              <span className="text-easemytrip-primary text-sm font-semibold">
                AI-Powered Travel Planning
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 font-space-grotesk text-balance">
            Plan Your Perfect Trip with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-easemytrip-primary to-easemytrip-secondary block">
              Roxy AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto text-pretty font-dm-sans leading-relaxed">
            Experience the future of travel planning with our intelligent AI assistant.
            Get personalized itineraries, real-time recommendations, and seamless booking
            for your dream destinations across India and beyond.
          </p>

          {/* Search Widget */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-12 max-w-5xl mx-auto border border-gray-100 animate-bounce-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* From */}
              <div className="space-y-2 animate-slide-in">
                <label className="text-sm font-semibold text-gray-700">FROM</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Delhi"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-easemytrip-primary focus:border-transparent text-lg font-medium transition-all duration-300 hover:border-easemytrip-primary/50"
                  />
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">[DEL] Indira Gandhi International Airport</p>
              </div>

              {/* To */}
              <div className="space-y-2 animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <label className="text-sm font-semibold text-gray-700">TO</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-easemytrip-primary focus:border-transparent text-lg font-medium transition-all duration-300 hover:border-easemytrip-primary/50"
                  />
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">[BOM] Chhatrapati Shivaji International...</p>
              </div>

              {/* Departure */}
              <div className="space-y-2 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <label className="text-sm font-semibold text-gray-700">DEPARTURE DATE</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="26 Oct 2025"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-easemytrip-primary focus:border-transparent text-lg font-medium transition-all duration-300 hover:border-easemytrip-primary/50"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Sunday</p>
              </div>

              {/* Travellers */}
              <div className="space-y-2 animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <label className="text-sm font-semibold text-gray-700">TRAVELLER & CLASS</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1 Traveller"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-easemytrip-primary focus:border-transparent text-lg font-medium transition-all duration-300 hover:border-easemytrip-primary/50"
                  />
                  <Plane className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Economy</p>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-easemytrip-primary to-easemytrip-secondary hover:from-easemytrip-primary/90 hover:to-easemytrip-secondary/90 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group animate-float"
              >
                <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                SEARCH FLIGHTS
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Special Offers */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:text-easemytrip-primary transition-colors">
                <input type="checkbox" className="rounded border-gray-300 text-easemytrip-primary focus:ring-easemytrip-primary" />
                <span>Defence Forces</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:text-easemytrip-primary transition-colors">
                <input type="checkbox" className="rounded border-gray-300 text-easemytrip-primary focus:ring-easemytrip-primary" />
                <span>Students</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:text-easemytrip-primary transition-colors">
                <input type="checkbox" className="rounded border-gray-300 text-easemytrip-primary focus:ring-easemytrip-primary" />
                <span>Senior Citizens</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:text-easemytrip-primary transition-colors">
                <input type="checkbox" className="rounded border-gray-300 text-easemytrip-primary focus:ring-easemytrip-primary" />
                <span>Doctors Nurses</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-easemytrip-primary to-easemytrip-secondary hover:from-easemytrip-primary/90 hover:to-easemytrip-secondary/90 text-white px-8 py-4 text-lg font-semibold group rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Chat with AI Agent
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-easemytrip-primary/20 text-easemytrip-primary hover:bg-gradient-to-r hover:from-easemytrip-primary hover:to-easemytrip-secondary hover:text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              See AI in Action
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 hover:bg-white/70 transition-all duration-300 hover:scale-105 animate-fade-in-up">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-6 w-6 text-easemytrip-primary mr-2 animate-pulse-slow" />
                <span className="text-3xl font-bold text-gray-900">100%</span>
              </div>
              <p className="text-gray-600 font-medium">AI-Powered</p>
            </div>
            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 hover:bg-white/70 transition-all duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-easemytrip-secondary mr-2 animate-pulse-slow" />
                <span className="text-3xl font-bold text-gray-900">500+</span>
              </div>
              <p className="text-gray-600 font-medium">Destinations</p>
            </div>
            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 hover:bg-white/70 transition-all duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-yellow-500 mr-2 animate-pulse-slow" />
                <span className="text-3xl font-bold text-gray-900">Real-time</span>
              </div>
              <p className="text-gray-600 font-medium">Adaptation</p>
            </div>
            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 hover:bg-white/70 transition-all duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-purple-500 mr-2 animate-pulse-slow" />
                <span className="text-3xl font-bold text-gray-900">24/7</span>
              </div>
              <p className="text-gray-600 font-medium">AI Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-easemytrip-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-easemytrip-primary/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
