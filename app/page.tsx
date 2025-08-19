"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Target, TrendingUp, ArrowRight, Briefcase } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-300/50 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-xl font-bold text-foreground">ApplyList</span>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-orange-100/50 text-orange-700">
            Simple • Modern • Effective
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
            Stay Organized,
            <span className="text-primary block">Land Your Dream Job</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Track your job applications with ease. No complex features, no overwhelming interfaces. Just simple,
            effective job tracking that actually works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Button size="lg" className="text-lg px-8 py-6 bg-orange-500/80 hover:bg-orange-600/80" asChild>
                <Link href="/sign-up">
                  Start Tracking Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </SignedIn>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent border-orange-300/50 text-orange-600 hover:bg-orange-50/50"
              asChild
            >
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Other job trackers are bloated with features you'll never use. We focus on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Simple Tracking</h3>
                <p className="text-muted-foreground">
                  Add applications in seconds. Track status, salary, and dates without the complexity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Progress Insights</h3>
                <p className="text-muted-foreground">
                  See your application stats at a glance. Know exactly where you stand.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Stay Organized</h3>
                <p className="text-muted-foreground">
                  Never lose track of an application again. Everything in one clean, simple interface.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why choose ApplyList?</h2>
            <p className="text-lg text-muted-foreground">We believe job tracking should be simple, not overwhelming.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">✕</span>
                  </div>
                  <h3 className="text-lg font-semibold text-red-600">Other Job Trackers</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Overwhelming interfaces with too many features</li>
                  <li>• Complex setup processes</li>
                  <li>• Expensive monthly subscriptions</li>
                  <li>• Slow and clunky user experience</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">ApplyList</h3>
                </div>
                <ul className="space-y-2 text-foreground">
                  <li>• Clean, intuitive interface</li>
                  <li>• Start tracking in under 30 seconds</li>
                  <li>• Affordable pricing that makes sense</li>
                  <li>• Fast, modern, and responsive</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-orange-500/80 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to organize your job search?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of job seekers who've simplified their application tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 bg-white text-orange-600 hover:bg-orange-50"
                asChild
              >
                <Link href="/sign-up">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </SignedIn>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white/50 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-orange-300/50 rounded flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-lg font-semibold text-foreground">ApplyList</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 ApplyList. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
