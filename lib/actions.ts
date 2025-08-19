"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseClientWithAuth } from "./supabase/clerk-sync"

export type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn"

function mapUiToDbStatus(input: unknown): JobStatus {
  const v = String(input ?? "APPLIED").toUpperCase()
  switch (v) {
    case "APPLIED":
      return "Applied"
    case "INTERVIEW":
      return "Interview"
    case "OFFER":
      return "Offer"
    case "REJECTED":
      return "Rejected"
    case "WITHDRAWN":
      return "Withdrawn"
    default:
      return "Applied"
  }
}
import { canCreateJob } from "./subscription"

export async function createJobAction(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Check subscription limits
  const { canCreate, reason } = await canCreateJob(userId)
  if (!canCreate) {
    return { error: reason || "Subscription limit reached" }
  }

  try {
    const supabase = await getSupabaseClientWithAuth()

    const jobData = {
      user_id: userId,
      company_name: formData.get("companyName") as string,
      role: formData.get("role") as string,
      status: mapUiToDbStatus(formData.get("status")),
      salary: (formData.get("salary") as string) || null,
      date_submitted: formData.get("dateSubmitted") as string,
      job_link: (formData.get("jobLink") as string) || null,
      notes: (formData.get("notes") as string) || null,
    }

    const { error } = await supabase.from("jobs").insert(jobData)

    if (error) {
      console.error("Error creating job:", error)
      return { error: "Failed to create job application" }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error creating job:", error)
    return { error: "Failed to create job application" }
  }
}
export async function updateJobAction(jobId: string, formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  try {
    const supabase = await getSupabaseClientWithAuth()

    const updateData = {
      company_name: formData.get("companyName") as string,
      role: formData.get("role") as string,
      status: mapUiToDbStatus(formData.get("status")),
      salary: (formData.get("salary") as string) || null,
      date_submitted: formData.get("dateSubmitted") as string,
      job_link: (formData.get("jobLink") as string) || null,
      notes: (formData.get("notes") as string) || null,
    }

    const { error } = await supabase.from("jobs").update(updateData).eq("id", jobId).eq("user_id", userId)

    if (error) {
      console.error("Error updating job:", error)
      return { error: "Failed to update job application" }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating job:", error)
    return { error: "Failed to update job application" }
  }
}
export async function deleteJobAction(jobId: string) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  try {
    const supabase = await getSupabaseClientWithAuth()

    const { error } = await supabase.from("jobs").delete().eq("id", jobId).eq("user_id", userId)

    if (error) {
      console.error("Error deleting job:", error)
      return { error: "Failed to delete job application" }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting job:", error)
    return { error: "Failed to delete job application" }
  }
}
export async function updateJobStatusAction(jobId: string, status: string) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  try {
    const supabase = await getSupabaseClientWithAuth()

    const { error } = await supabase
      .from("jobs")
      .update({ status: mapUiToDbStatus(status) })
      .eq("id", jobId)
      .eq("user_id", userId)

    if (error) {
      console.error("Error updating job status:", error)
      return { error: "Failed to update job status" }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating job status:", error)
    return { error: "Failed to update job status" }
  }
}
