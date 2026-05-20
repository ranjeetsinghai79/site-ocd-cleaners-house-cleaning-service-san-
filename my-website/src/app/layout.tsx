import type { Metadata } from "next"
import "./globals.css"
import "@core/web/styles/tokens.css"
import "@core/web/styles/utilities.css"
import { SmoothScroll, ScrollProgress, MagneticCursor } from "@core/web"

export const metadata: Metadata = {
  title: "WebCrew — AI-Powered Websites for Local Businesses",
  description:
    "We build fast, professional websites for HVAC, roofing, dental, and other local service businesses. Up in 24 hours. Starting at $49/month.",
  keywords: "local business website, HVAC website, roofing website, AI website builder, small business website",
  openGraph: {
    title: "WebCrew — AI-Powered Websites for Local Businesses",
    description: "Professional websites built for local service businesses. $49/month. Live in 24 hours.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="navy">
      <body style={{ margin: 0, background: "#030712", color: "#fff", fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
        <ScrollProgress />
        <MagneticCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
