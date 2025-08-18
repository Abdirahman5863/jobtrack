import { getSupabaseClientWithAuth } from "./supabase/clerk-sync"

export type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn"

export type Job = {
  id: string
  user_id: string
  company_name: string
  role: string
  status: JobStatus
  salary?: string | null
  date_submitted?: string | null
  job_link?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export type CreateJobData = {
  userId: string
  companyName: string
  role: string
  status?: JobStatus
  salary?: string
  dateSubmitted?: Date
  jobLink?: string
  notes?: string
}

export type UpdateJobData = Partial<Omit<CreateJobData, "userId">>

// Get all jobs for a user
export async function getJobsByUserId(userId: string): Promise<Job[]> {
  const supabase = await getSupabaseClientWithAuth()

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching jobs:", error)
    return []
  }

  return data || []
}

// Get a single job by ID and user ID
export async function getJobById(id: string, userId: string): Promise<Job | null> {
  const supabase = await getSupabaseClientWithAuth()

  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching job:", error)
    return null
  }

  return data
}

// Create a new job
export async function createJob(data: CreateJobData): Promise<Job | null> {
  const supabase = await getSupabaseClientWithAuth()

  const jobData = {
    user_id: data.userId,
    company_name: data.companyName,
    role: data.role,
    status: data.status || "Applied",
    salary: data.salary || null,
    date_submitted: data.dateSubmitted?.toISOString().split("T")[0] || null,
    job_link: data.jobLink || null,
    notes: data.notes || null,
  }

  const { data: job, error } = await supabase.from("jobs").insert(jobData).select().single()

  if (error) {
    console.error("Error creating job:", error)
    return null
  }

  return job
}

// Update a job
export async function updateJob(id: string, userId: string, data: UpdateJobData): Promise<Job | null> {
  const supabase = await getSupabaseClientWithAuth()

  const updateData: any = {}
  if (data.companyName) updateData.company_name = data.companyName
  if (data.role) updateData.role = data.role
  if (data.status) updateData.status = data.status
  if (data.salary !== undefined) updateData.salary = data.salary || null
  if (data.dateSubmitted) updateData.date_submitted = data.dateSubmitted.toISOString().split("T")[0]
  if (data.jobLink !== undefined) updateData.job_link = data.jobLink || null
  if (data.notes !== undefined) updateData.notes = data.notes || null

  const { data: job, error } = await supabase
    .from("jobs")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating job:", error)
    return null
  }

  return job
}

// Delete a job
export async function deleteJob(id: string, userId: string): Promise<boolean> {
  const supabase = await getSupabaseClientWithAuth()

  const { error } = await supabase.from("jobs").delete().eq("id", id).eq("user_id", userId)

  if (error) {
    console.error("Error deleting job:", error)
    return false
  }

  return true
}

// Get job statistics for a user
export async function getJobStats(userId: string) {
  const supabase = await getSupabaseClientWithAuth()

  const { data: jobs, error } = await supabase.from("jobs").select("status").eq("user_id", userId)

  if (error) {
    console.error("Error fetching job stats:", error)
    return {
      total: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
    }
  }

  const stats = {
    total: jobs?.length || 0,
    applied: jobs?.filter((job) => job.status === "Applied").length || 0,
    interview: jobs?.filter((job) => job.status === "Interview").length || 0,
    offer: jobs?.filter((job) => job.status === "Offer").length || 0,
    rejected: jobs?.filter((job) => job.status === "Rejected").length || 0,
    withdrawn: jobs?.filter((job) => job.status === "Withdrawn").length || 0,
  }

  return stats
}
