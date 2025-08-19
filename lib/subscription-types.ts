export type SubscriptionStatus = "free" | "pro" | "cancelled" | "past_due"

export interface Subscription {
  id: string
  userId: string
  status: SubscriptionStatus
  planId: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: "month" | "year"
  features: string[]
  jobLimit: number
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "USD",
    interval: "month",
    features: ["Up to 5 job applications", "Basic tracking", "Email support"],
    jobLimit: 5,
  },
  {
    id: "pro",
    name: "Pro",
    price: 5,
    currency: "USD",
    interval: "month",
    features: ["Unlimited job applications", "Advanced analytics", "Priority support", "Export data"],
    jobLimit: -1, // Unlimited
  },
]
