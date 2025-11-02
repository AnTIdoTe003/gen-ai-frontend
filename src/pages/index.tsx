"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/seo";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/chat");
  }, [router]);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Roxy AI - Best AI Itinerary Generator for Travel",
      "alternateName": "Roxy AI",
      "description": "Roxy AI is the best AI itinerary generator for travel planning. Create personalized travel itineraries with our online AI itinerary generator. Plan your perfect trip with intelligent AI assistance.",
      "url": "https://tripcraft.debmalya.in",
      "applicationCategory": "TravelApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Best AI for itinerary creation",
        "Online itinerary generator",
        "AI-powered travel planning",
        "Personalized travel itineraries",
        "Intelligent travel assistant",
        "Automated itinerary planning",
        "Smart trip planner",
        "AI travel agent",
        "Real-time recommendations",
        "Dynamic itinerary building"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Roxy AI",
      "url": "https://tripcraft.debmalya.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://tripcraft.debmalya.in/chat?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://tripcraft.debmalya.in"
        }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="Roxy AI - Best AI Itinerary Generator for Travel | Online Itinerary Planner"
        description="Roxy AI is the best AI itinerary generator for travel planning. Create personalized travel itineraries with our online AI itinerary generator. Best AI for itinerary planning - try Roxy AI today!"
        keywords="Roxy AI, best ai for itinerary, online itinerary generator, best ai itinerary generator for travel, AI travel planner, intelligent travel assistant, automated itinerary planner, smart travel planner, AI trip planner, best itinerary planner, travel itinerary generator, AI travel agent, AI powered itinerary, intelligent trip planning, personalized travel planner, AI vacation planner, smart itinerary creator, automated travel planning, AI travel planning tool, best travel planner app, free itinerary generator, create travel itinerary, AI itinerary maker, trip planning AI, travel planning software"
        canonical="https://tripcraft.debmalya.in/"
        structuredData={structuredData}
      />
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Redirecting to chat...</div>
      </div>
    </>
  );
}
