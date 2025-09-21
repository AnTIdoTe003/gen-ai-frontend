import Head from "next/head"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/pricing-section"

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TripCraft AI - Agentic AI Travel Assistant",
    "description": "Intelligent AI travel agent that creates personalized, adaptive itineraries for India travel. Chat with AI to plan your perfect journey.",
    "url": "https://tripcraft.debmalya.in",
    "applicationCategory": "TravelApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "TripCraft AI",
      "url": "https://tripcraft.debmalya.in"
    },
    "featureList": [
      "AI-powered itinerary creation",
      "Real-time travel adaptation",
      "Natural language conversation",
      "Personalized travel recommendations",
      "Dynamic itinerary building",
      "24/7 AI travel support"
    ]
  }

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>TripCraft AI - Your Intelligent AI Travel Agent for India | Personalized Itineraries</title>
        <meta name="title" content="TripCraft AI - Your Intelligent AI Travel Agent for India | Personalized Itineraries" />
        <meta name="description" content="Experience the future of travel planning with TripCraft AI's intelligent agent. Chat with AI to create personalized, adaptive itineraries for India. Get real-time recommendations, dynamic planning, and 24/7 AI support for your perfect journey." />
        <meta name="keywords" content="AI travel agent, intelligent travel planning, India travel, personalized itineraries, AI itinerary creator, travel chatbot, smart travel assistant, adaptive travel planning, AI travel recommendations, India tourism AI" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tripcraft.debmalya.in/" />
        <meta property="og:title" content="TripCraft AI - Your Intelligent AI Travel Agent for India" />
        <meta property="og:description" content="Chat with our intelligent AI travel agent to create personalized, adaptive itineraries for India. Experience the future of travel planning with real-time recommendations and dynamic itinerary building." />
        <meta property="og:image" content="https://tripcraft.debmalya.in/stunning-indian-landscape-with-taj-mahal-at-sunset.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Beautiful Indian landscape with Taj Mahal - AI-powered travel planning destination" />
        <meta property="og:site_name" content="TripCraft AI" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://tripcraft.debmalya.in/" />
        <meta property="twitter:title" content="TripCraft AI - Your Intelligent AI Travel Agent for India" />
        <meta property="twitter:description" content="Chat with our intelligent AI travel agent to create personalized, adaptive itineraries for India. Experience the future of travel planning." />
        <meta property="twitter:image" content="https://tripcraft.debmalya.in/stunning-indian-landscape-with-taj-mahal-at-sunset.jpg" />
        <meta property="twitter:image:alt" content="Beautiful Indian landscape with Taj Mahal - AI-powered travel planning destination" />

        {/* Additional SEO Meta Tags */}
        <meta name="author" content="TripCraft AI" />
        <meta name="publisher" content="TripCraft AI" />
        <meta name="copyright" content="TripCraft AI" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        {/* Geographic and Travel Specific */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="geo.position" content="20.5937;78.9629" />
        <meta name="ICBM" content="20.5937, 78.9629" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://tripcraft.debmalya.in/" />

        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="en" href="https://tripcraft.debmalya.in/" />
        <link rel="alternate" hrefLang="hi" href="https://tripcraft.debmalya.in/hi/" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Additional Structured Data for Travel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "TripCraft AI",
              "description": "AI-powered travel planning service specializing in India travel with intelligent itinerary creation",
              "url": "https://tripcraft.debmalya.in",
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "serviceType": "Travel Planning",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "AI Travel Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "AI Itinerary Creation",
                      "description": "Personalized travel itineraries created by intelligent AI agent"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Real-time Travel Adaptation",
                      "description": "Dynamic itinerary adjustments based on real-time conditions"
                    }
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <main className="min-h-screen">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </main>
    </>
  )
}
