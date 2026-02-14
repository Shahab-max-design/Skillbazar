import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkillBazaar - Find Trusted Technicians in Karachi",
  description:
    "Connect with verified electricians, plumbers, AC technicians, and more in Karachi. Book skilled professionals instantly.",
  generator: "v0.app",
  keywords: ["technicians", "electrician", "plumber", "AC repair", "Karachi", "home services"],
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">

      <body className={`font-sans antialiased`}>
        <div className="relative w-full overflow-x-hidden">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
