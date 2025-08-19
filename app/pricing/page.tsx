import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Crown, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-types"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-300/50 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-xl font-bold text-foreground">JobTrack</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-2xl">Free</CardTitle>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">$0</div>
              <div className="text-muted-foreground">Forever</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {SUBSCRIPTION_PLANS[0].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full mt-6" asChild>
                <Link href="/sign-up">
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-orange-200 bg-orange-50/30">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-orange-600 text-white px-3 py-1">
                <Crown className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-2xl">Pro</CardTitle>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">$5</div>
              <div className="text-muted-foreground">per month</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {SUBSCRIPTION_PLANS[1].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700" asChild>
                <Link href="/sign-up">
                  Upgrade to Pro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">What happens when I reach 5 jobs?</h3>
                <p className="text-sm text-muted-foreground">
                  You'll see an upgrade prompt. You can continue using the free plan, but you won't be able to add more jobs until you upgrade to Pro.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Is my data safe?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely. We use industry-standard encryption and security practices. Your data is backed up regularly and never shared with third parties.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day money-back guarantee. If you're not satisfied, contact us and we'll refund your payment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto border-orange-200 bg-orange-50/30">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Ready to get organized?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of job seekers who've simplified their application tracking with JobTrack.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Start Free Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/demo">
                    View Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
