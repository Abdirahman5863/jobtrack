import { NextRequest, NextResponse } from "next/server"
import { verifyPayment, updateUserSubscription } from "@/lib/subscription"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")
    const trxref = searchParams.get("trxref")

    if (!reference || !trxref) {
      return NextResponse.json({ error: "Missing payment reference" }, { status: 400 })
    }

    // Verify the payment with Paystack
    const paymentData = await verifyPayment(reference)
    
    if (paymentData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Extract user and plan info from metadata
    const metadata = paymentData.data.metadata
    const userId = metadata.custom_fields?.find((f: any) => f.variable_name === "user_id")?.value
    const planId = metadata.custom_fields?.find((f: any) => f.variable_name === "plan_id")?.value

    if (!userId || !planId) {
      return NextResponse.json({ error: "Invalid payment metadata" }, { status: 400 })
    }

    // Update user subscription
    await updateUserSubscription(userId, planId, paymentData.data)

    // Redirect to dashboard with success message
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Error processing payment success:", error)
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=error`
    return NextResponse.redirect(redirectUrl)
  }
}
