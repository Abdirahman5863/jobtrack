import { currentUser } from "@clerk/nextjs/server"
import { getSupabaseClientWithAuth } from "./supabase/clerk-sync"
import { Subscription, SubscriptionPlan, SUBSCRIPTION_PLANS } from "./subscription-types"

export type { Subscription, SubscriptionPlan, SubscriptionStatus } from "./subscription-types"
export { SUBSCRIPTION_PLANS }

// Get user's subscription status
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await getSupabaseClientWithAuth()

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching subscription:", error)
    return null
  }

  return data
}

// Check if user can create more jobs
export async function canCreateJob(userId: string): Promise<{ canCreate: boolean; reason?: string }> {
  const user = await currentUser()
  if (!user) {
    return { canCreate: false, reason: "Not authenticated" }
  }

  const subscription = await getUserSubscription(userId)
  const jobCount = await getJobCount(userId)

  // If user has pro subscription, they can create unlimited jobs
  if (subscription?.status === "pro") {
    return { canCreate: true }
  }

  // Free users are limited to 5 jobs
  if (jobCount >= 5) {
    return { 
      canCreate: false, 
      reason: "You've reached the free plan limit of 5 jobs. Upgrade to Pro for unlimited job tracking." 
    }
  }

  return { canCreate: true }
}

// Get job count for a user
export async function getJobCount(userId: string): Promise<number> {
  const supabase = await getSupabaseClientWithAuth()

  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (error) {
    console.error("Error counting jobs:", error)
    return 0
  }

  return count || 0
}

// Create Paystack checkout session
export async function createCheckoutSession(userId: string, planId: string) {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
  if (!plan || plan.id === "free") {
    throw new Error("Invalid plan")
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: plan.price * 100, // Paystack expects amount in kobo (smallest currency unit)
      email: (await currentUser())?.emailAddresses[0]?.emailAddress,
      currency: plan.currency,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscription/success`,
      metadata: {
        userId,
        planId,
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: userId,
          },
          {
            display_name: "Plan ID",
            variable_name: "plan_id",
            value: planId,
          },
        ],
      },
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to create checkout session")
  }

  const data = await response.json()
  return data.data
}

// Verify Paystack payment
export async function verifyPayment(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to verify payment")
  }

  return await response.json()
}

// Update user subscription after successful payment
export async function updateUserSubscription(userId: string, planId: string, paymentData: any) {
  const supabase = await getSupabaseClientWithAuth()

  const subscriptionData = {
    user_id: userId,
    plan_id: planId,
    status: "pro",
    payment_reference: paymentData.reference,
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    cancel_at_period_end: false,
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(subscriptionData, { onConflict: "user_id" })
    .select()
    .single()

  if (error) {
    console.error("Error updating subscription:", error)
    throw new Error("Failed to update subscription")
  }

  return data
}
