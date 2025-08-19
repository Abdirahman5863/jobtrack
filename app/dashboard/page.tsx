import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getJobsByUserId, getJobStats, Job } from "@/lib/jobs"
import { JobTracker } from "@/components/job-tracker"
import { syncClerkUserToSupabase } from "@/lib/supabase/clerk-sync"
import { getUserSubscription, getJobCount } from "@/lib/subscription"
import { Subscription } from "@/lib/subscription-types"
export default async function Dashboard() {
  const authResult = await auth()
  const { userId } = authResult
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  await syncClerkUserToSupabase()

  const [dbJobs, stats, subscription, jobCount] = await Promise.all([
    getJobsByUserId(userId), 
    getJobStats(userId),
    getUserSubscription(userId),
    getJobCount(userId)
  ])

  const jobs = (dbJobs || []).map((j: any) => ({
    id: j.id,
    companyName: j.company_name,
    role: j.role,
    status: (j.status || "Applied").toUpperCase(),
    salary: j.salary ?? null,
    dateSubmitted: j.date_submitted ? new Date(j.date_submitted) : new Date(j.created_at),
    jobLink: j.job_link ?? null,
    notes: j.notes ?? null,
    userId: j.user_id,
    createdAt: new Date(j.created_at),
    updatedAt: new Date(j.updated_at),
  }))

  const showSubscriptionBanner = !subscription || subscription.status === "free"
  const isAtLimit = jobCount >= 5 && showSubscriptionBanner

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">JobTrack</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm text-muted-foreground">
                Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {user?.firstName ? `${user.firstName}'s Dashboard` : "Dashboard"}
          </h1>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>

        <JobTracker 
          initialJobs={jobs as any[]} 
          initialStats={stats} 
          subscription={subscription}
          jobCount={jobCount}
          isAtLimit={isAtLimit}
        />
      </div>
    </div>
  )
}
