import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "ApplyList - Stay Organized, Land Your Dream Job",
  description: "Simple, modern job application tracker.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    console.error("Missing Clerk Publishable Key")
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" className={`${dmSans.variable} antialiased`}>
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  )
}
