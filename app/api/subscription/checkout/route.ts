import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createCheckoutSession } from "@/lib/subscription"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 

    const { planId } = await request.json()
    
    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const checkoutSession = await createCheckoutSession(userId, planId)

    return NextResponse.json({ 
      success: true, 
      checkoutUrl: checkoutSession.authorization_url,
      reference: checkoutSession.reference 
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" }, 
      { status: 500 }
    )
  }
}
