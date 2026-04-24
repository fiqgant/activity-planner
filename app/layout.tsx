import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Business Activity Plan Generator",
  description: "Generate activity plans for your business with ease",
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
      </body>
    </html>
  )
}