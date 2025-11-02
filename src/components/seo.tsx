import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object | object[];
  noindex?: boolean;
  nofollow?: boolean;
}

const defaultSEO = {
  title: "Roxy AI - Best AI Itinerary Generator for Travel | Online Itinerary Planner",
  description: "Roxy AI is the best AI itinerary generator for travel planning. Create personalized travel itineraries with our online AI itinerary generator. Plan your perfect trip with intelligent AI assistance.",
  keywords: "Roxy AI, best ai for itinerary, online itinerary generator, best ai itinerary generator for travel, AI travel planner, intelligent travel assistant, automated itinerary planner, smart travel planner, AI trip planner, best itinerary planner, travel itinerary generator, AI travel agent, AI powered itinerary, intelligent trip planning, personalized travel planner, AI vacation planner, smart itinerary creator, automated travel planning, AI travel planning tool, best travel planner app, free itinerary generator, create travel itinerary, AI itinerary maker, trip planning AI, travel planning software, AI chat for travel, conversational travel planner, intelligent travel bot, smart vacation planner, automated trip planning, AI travel consultant, personalized trip planner, custom itinerary generator, AI powered trip planner, best online itinerary planner, free travel itinerary generator, AI travel planning assistant, smart travel itinerary, automated travel itinerary, AI trip organizer, intelligent itinerary builder, virtual travel assistant, AI travel guide, smart trip organizer, automated travel guide, AI vacation planner tool, best itinerary maker",
  ogImage: "/stunning-indian-landscape-with-taj-mahal-at-sunset.jpg",
  siteUrl: "https://tripcraft.debmalya.in",
};

export function SEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  canonical,
  ogImage = defaultSEO.ogImage,
  ogType = "website",
  structuredData,
  noindex = false,
  nofollow = false,
}: SEOProps) {
  const fullTitle = title.includes("Roxy AI") ? title : `${title} | Roxy AI`;
  const canonicalUrl = canonical || defaultSEO.siteUrl;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${defaultSEO.siteUrl}${ogImage}`;

  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
    "max-image-preview:large",
    "max-snippet:-1",
    "max-video-preview:-1",
  ].join(", ");

  // Default structured data if none provided
  const defaultStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Roxy AI",
      "alternateName": "Roxy AI Travel Planner",
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
      ],
      "description": description,
      "url": canonicalUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Roxy AI - Best AI Itinerary Generator",
      "url": canonicalUrl,
      "description": description,
      "applicationCategory": "Travel",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "operatingSystem": "Any",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Roxy AI",
      "url": defaultSEO.siteUrl,
      "logo": `${defaultSEO.siteUrl}/logo.png`,
      "description": "Best AI itinerary generator for travel planning",
      "sameAs": [
        "https://twitter.com/roxyai",
        "https://facebook.com/roxyai",
        "https://linkedin.com/company/roxyai"
      ]
    }
  ];

  const finalStructuredData = structuredData || defaultStructuredData;
  const structuredDataArray = Array.isArray(finalStructuredData)
    ? finalStructuredData
    : [finalStructuredData];

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${fullTitle} - AI Itinerary Generator`} />
      <meta property="og:site_name" content="Roxy AI" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={`${fullTitle} - AI Itinerary Generator`} />
      <meta name="twitter:creator" content="@roxyai" />
      <meta name="twitter:site" content="@roxyai" />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Roxy AI" />
      <meta name="publisher" content="Roxy AI" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} Roxy AI. All rights reserved.`} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Geographic Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="geo.position" content="20.5937;78.9629" />
      <meta name="ICBM" content="20.5937, 78.9629" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Structured Data */}
      {structuredDataArray.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Head>
  );
}

