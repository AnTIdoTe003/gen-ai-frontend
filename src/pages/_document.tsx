import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Critical SEO Meta Tags */}
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover, interactive-widget=resizes-visual" />

        {/* Basic Meta Tags */}
        <meta name="generator" content="Roxy AI - Best AI Itinerary Generator for Travel" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme and Mobile */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Performance and Security */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="origin-when-cross-origin" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://gen-ai.bdbose.in" />
        <link rel="preconnect" href="https://tripcraft.debmalya.in" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//gen-ai.bdbose.in" />
        <link rel="dns-prefetch" href="//tripcraft.debmalya.in" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
