import type React from "react"
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
  title: "JobTrack - Stay Organized, Land Your Dream Job",
  description:
    "Simple, modern job application tracker. Track applications, manage your job search, and land your dream job with ease.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY

  const hasValidClerkKeys =
    publishableKey &&
    secretKey &&
    publishableKey.startsWith("pk_") &&
    publishableKey.length > 20 &&
    secretKey.startsWith("sk_") &&
    secretKey.length > 20

  if (!hasValidClerkKeys) {
    return (
      <html lang="en" className={`${dmSans.variable} antialiased`}>
        <body className="font-sans">
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">Clerk Configuration Issue</h1>
              <p className="text-muted-foreground mb-6">Your Clerk environment variables are missing or invalid:</p>
              <div className="bg-secondary p-4 rounded-lg text-left text-sm font-mono mb-6">
                <div>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...</div>
                <div>CLERK_SECRET_KEY=sk_test_...</div>
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {!publishableKey ? (
                  <div className="text-red-600 mb-2">❌ Missing: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</div>
                ) : !publishableKey.startsWith("pk_") || publishableKey.length <= 20 ? (
                  <div className="text-red-600 mb-2">
                    ❌ Invalid: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (should start with pk_)
                  </div>
                ) : (
                  <div className="text-green-600 mb-2">✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY found</div>
                )}

                {!secretKey ? (
                  <div className="text-red-600 mb-2">❌ Missing: CLERK_SECRET_KEY</div>
                ) : !secretKey.startsWith("sk_") || secretKey.length <= 20 ? (
                  <div className="text-red-600 mb-2">❌ Invalid: CLERK_SECRET_KEY (should start with sk_)</div>
                ) : (
                  <div className="text-green-600 mb-2">✅ CLERK_SECRET_KEY found</div>
                )}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Make sure your keys are complete and not truncated. Each key should be on its
                  own line in your environment variables.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Get fresh keys from{" "}
                <a
                  href="https://dashboard.clerk.com/last-active?path=api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Clerk Dashboard → API Keys
                </a>
              </p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider>
      <html lang="en" className={`${dmSans.variable} antialiased`}>
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  )
}
