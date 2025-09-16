import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "JanMITRA - Your City, Your Voice",
  description: "Report civic issues and make your city better. Spot a problem? Snap it, map it, and get it fixed.",
  generator: "v0.app",
  keywords: "civic reporting, city issues, infrastructure, community, local government",
  authors: [{ name: "JanMITRA Team" }],
  openGraph: {
    title: "JanMITRA - Your City, Your Voice",
    description: "Report civic issues and make your city better",
    type: "website",
    images: ["/images/app-icon.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
