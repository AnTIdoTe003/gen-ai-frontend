import type { AppProps } from "next/app"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "../styles/globals.css"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "@/components/ui/toaster";
import { AppWrapper } from "@/components/app-wrapper";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={clientId as string}>
      <div className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
        <div className="font-sans antialiased">
          <AppWrapper>
            <Component {...pageProps} />
            <Analytics />
            <Toaster />
          </AppWrapper>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}
