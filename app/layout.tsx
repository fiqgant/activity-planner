import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Business Activity Plan Generator",
  description: "Generate activity plans for your business with ease",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}