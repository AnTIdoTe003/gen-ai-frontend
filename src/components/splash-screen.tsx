"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "./logo";

interface SplashScreenProps {
  onComplete: () => void;
  minDisplayTime?: number; // Minimum time to show splash in ms
}

export function SplashScreen({ onComplete, minDisplayTime = 2000 }: SplashScreenProps) {
  const [phase, setPhase] = useState<"initial" | "animating" | "completing">("initial");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Start animation after a brief delay
    const timer = setTimeout(() => {
      setPhase("animating");
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "animating") {
      // Wait for minimum display time, then fade out
      const timer = setTimeout(() => {
        setPhase("completing");
        // Call onComplete after fade animation completes
        setTimeout(() => {
          onComplete();
        }, 500); // Match fade-out duration
      }, minDisplayTime);

      return () => clearTimeout(timer);
    }
  }, [phase, minDisplayTime, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-opacity duration-500 ${phase === "completing" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 ${loaded ? "animate-float" : ""
              }`}
            style={{
              width: Math.random() * 100 + 20 + "px",
              height: Math.random() * 100 + 20 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 3 + 4 + "s",
            }}
          />
        ))}

        {/* Gradient Orbs */}
        <div
          className={`absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${loaded ? "animate-pulse-slow" : ""
            }`}
        />
        <div
          className={`absolute bottom-20 right-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${loaded ? "animate-pulse-slow" : ""
            }`}
          style={{ animationDelay: "1s" }}
        />
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 ${loaded ? "animate-pulse-slow" : ""
            }`}
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center transition-all duration-700 ${phase === "initial"
            ? "opacity-0 scale-90 translate-y-4"
            : phase === "animating"
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2"
          }`}
      >
        {/* Logo with Animation */}
        <div className="mb-8">
          <Logo size="xl" animated={loaded} />
        </div>

        {/* App Name */}
        <h1
          className={`text-xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent font-space-grotesk transition-all duration-700 ${phase === "initial"
              ? "opacity-0 translate-y-4"
              : phase === "animating"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          style={{ transitionDelay: phase === "animating" ? "200ms" : "0ms" }}
        >
          Roxy AI - EaseMyTrip
        </h1>

        {/* Tagline */}
        <p
          className={`text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 font-dm-sans transition-all duration-700 ${phase === "initial"
              ? "opacity-0 translate-y-4"
              : phase === "animating"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          style={{ transitionDelay: phase === "animating" ? "400ms" : "0ms" }}
        >
          Your AI Travel Companion
        </p>

        {/* Loading Indicator */}
        <div
          className={`flex items-center space-x-2 transition-all duration-700 ${phase === "initial"
              ? "opacity-0"
              : phase === "animating"
                ? "opacity-100"
                : "opacity-0"
            }`}
          style={{ transitionDelay: phase === "animating" ? "600ms" : "0ms" }}
        >
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            />
            <div
              className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms", animationDuration: "1s" }}
            />
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms", animationDuration: "1s" }}
            />
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-40px) translateX(-10px) rotate(180deg);
            opacity: 0.25;
          }
          75% {
            transform: translateY(-20px) translateX(5px) rotate(270deg);
            opacity: 0.3;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.1);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

