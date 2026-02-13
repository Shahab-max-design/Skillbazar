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
  manifest: "/manifest.json",
  themeColor: "#0f3fbf",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SkillBazar",
  },
}

import { PwaInstallPrompt } from "@/components/pwa-install-prompt"
import { SplashScreen } from "@/components/splash-screen"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <SplashScreen />
        {children}
        <PwaInstallPrompt />
        <Analytics />
      </body>
    </html>
  )
}
