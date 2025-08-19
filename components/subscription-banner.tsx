"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Loader2 } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-types"

interface SubscriptionBannerProps {
  jobCount: number
  onUpgrade: () => void
  isUpgrading?: boolean
}

export function SubscriptionBanner({ jobCount, onUpgrade, isUpgrading = false }: SubscriptionBannerProps) {
  const [selectedPlan] = useState("pro")
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-900">Upgrade to Pro</CardTitle>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            {jobCount}/5 jobs used
          </Badge>
        </div>
        <CardDescription className="text-amber-700">
          You've reached the free plan limit. Upgrade to Pro for unlimited job tracking and advanced features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{plan?.name} Plan</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${plan?.price}</div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
            </div>
            <ul className="space-y-2">
              {plan?.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button 
            onClick={onUpgrade} 
            disabled={isUpgrading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            size="lg"
          >
            {isUpgrading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro - ${plan?.price}/month
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
