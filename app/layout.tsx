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
  title: "ApplyList – Stay Organized, Land Your Dream Job",
  description: "ApplyList is a clean, modern job application tracker that helps you stay focused and land your next opportunity.",
  keywords: ["job tracker", "job applications", "career tools", "applylist", "job hunt", "job search"],
  authors: [{ name: "Abdirahman Abdi", url: "https://orecordify.com" }],
  creator: "Abdirahman Abdi",
  themeColor: "#ffffff",
  openGraph: {
    title: "ApplyList – Stay Organized, Land Your Dream Job",
    description: "Track your job applications with ease. ApplyList keeps things simple and clutter-free.",
    url: "https://applylist.orecordify.com",
    siteName: "ApplyList",
    images: [
      {
        url: "https://applylist.orecordify.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ApplyList dashboard preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApplyList – Stay Organized, Land Your Dream Job",
    description: "A minimalist job tracker built for clarity and focus.",
    creator: "@abdirahmanabdi",
    images: ["https://applylist.orecordify.com/og-image.png"],
  },
  metadataBase: new URL("https://applylist.orcordify.com"),
  alternates: {
    canonical: "https://applylist.orecordify.com",
  },
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
      <html lang="en" className={`${dmSans.variable} antialiased`} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="font-sans bg-background text-foreground">{children}</body>
      </html>
    </ClerkProvider>
  )
}
