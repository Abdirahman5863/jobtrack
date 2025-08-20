"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, ExternalLink, Briefcase, Building2, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createJobAction, updateJobAction, deleteJobAction, updateJobStatusAction } from "@/lib/actions"
import { SubscriptionBanner } from "./subscription-banner"
import { Subscription } from "@/lib/subscription-types"

export type JobStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN"

export interface Job {
  id: string
  companyName: string
  role: string
  status: JobStatus
  salary: string | null
  dateSubmitted: Date
  jobLink: string | null
  notes: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

interface JobTrackerProps {
  initialJobs: Job[]
  initialStats: {
    total: number
    applied: number
    interview: number
    offer: number
    rejected: number
    withdrawn: number
  }
  subscription?: Subscription | null
  jobCount?: number
  isAtLimit?: boolean
}

const statusColors = {
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  INTERVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  OFFER: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  WITHDRAWN: "bg-gray-50 text-gray-700 border-gray-200",
}

const statusLabels = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
}

export function JobTracker({ initialJobs, initialStats, subscription, jobCount = 0, isAtLimit = false }: JobTrackerProps) {
  const normalizeJob = (job: any): Job => {
    const toDate = (v: any) => {
      const d = new Date(v)
      return isNaN(d.getTime()) ? new Date() : d
    }
    return {
      ...job,
      dateSubmitted: toDate(job?.dateSubmitted),
      createdAt: toDate(job?.createdAt),
      updatedAt: toDate(job?.updatedAt),
    }
  }

  const [jobs, setJobs] = useState((initialJobs || []).map(normalizeJob))
  const [stats, setStats] = useState(initialStats)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState<string | null>(null)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    status: "APPLIED" as JobStatus,
    salary: "",
    dateSubmitted: "",
    jobLink: "",
    notes: "",
  })

  const resetForm = () => {
    setFormData({
      companyName: "",
      role: "",
      status: "APPLIED",
      salary: "",
      dateSubmitted: "",
      jobLink: "",
      notes: "",
    })
  }

  const populateFormWithJob = (job: Job) => {
    setFormData({
      companyName: job.companyName,
      role: job.role,
      status: job.status,
      salary: job.salary || "",
      dateSubmitted: new Date(job.dateSubmitted).toISOString().split("T")[0],
      jobLink: job.jobLink || "",
      notes: job.notes || "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formDataObj = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value)
    })

    startTransition(async () => {
      let result
      if (editingJob) {
        result = await updateJobAction(editingJob.id, formDataObj)
      } else {
        result = await createJobAction(formDataObj)
      }

      if (result.success) {
        setIsDialogOpen(false)
        setEditingJob(null)
        resetForm()
        await refreshData()
      } else if (result.error?.includes("subscription")) {
        // Show subscription banner if limit reached
        window.location.reload()
      }
    })
  }

  const updateJobStatus = async (id: string, newStatus: JobStatus) => {
    startTransition(async () => {
      const result = await updateJobStatusAction(id, newStatus)
      if (result.success) {
        setEditingStatus(null)
        await refreshData()
      }
    })
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    populateFormWithJob(job)
    setIsDialogOpen(true)
  }

  const handleDeleteJob = async (id: string) => {
    startTransition(async () => {
      const result = await deleteJobAction(id)
      if (result.success) {
        await refreshData()
      }
    })
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingJob(null)
      resetForm()
    }
  }

  const refreshData = async () => {
    // In a real app, you'd refetch the data here
    // For now, we'll just reload to get fresh data
    window.location.reload()
  }

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: "pro" }),
      })

      const data = await response.json()
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || "Failed to create checkout session")
      }
    } catch (error) {
      console.error("Error initiating upgrade:", error)
      alert("Failed to initiate upgrade. Please try again.")
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-600">{stats.interview}</div>
            <div className="text-sm text-muted-foreground">Interviews</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.offer}</div>
            <div className="text-sm text-muted-foreground">Offers</div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Banner */}
      {isAtLimit && (
        <div className="mb-8">
          <SubscriptionBanner 
            jobCount={jobCount} 
            onUpgrade={handleUpgrade} 
            isUpgrading={isUpgrading}
          />
        </div>
      )}

      {/* Add Application Button */}
      <div className="flex justify-center mb-8">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm} 
              size="lg" 
              className="gap-2" 
              disabled={isPending || isAtLimit}
            >
              <Plus className="h-5 w-5" />
              Add New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit Job Application" : "Add Job Application"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                  placeholder="e.g., Google"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: JobStatus) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPLIED">Applied</SelectItem>
                      <SelectItem value="INTERVIEW">Interview</SelectItem>
                      <SelectItem value="OFFER">Offer</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                    placeholder="$120,000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateSubmitted">Date Applied</Label>
                <Input
                  id="dateSubmitted"
                  type="date"
                  value={formData.dateSubmitted}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateSubmitted: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="jobLink">Job Link (optional)</Label>
                <Input
                  id="jobLink"
                  type="url"
                  value={formData.jobLink}
                  onChange={(e) => setFormData((prev) => ({ ...prev, jobLink: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingJob ? "Updating..." : "Adding..."}
                    </>
                  ) : editingJob ? (
                    "Update Application"
                  ) : (
                    "Add Application"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
              <p className="text-muted-foreground">Add your first job application to get started!</p>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold text-foreground">{job.companyName}</h3>
                      {editingStatus === job.id ? (
                        <Select
                          value={job.status}
                          onValueChange={(value: JobStatus) => updateJobStatus(job.id, value)}
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="APPLIED">Applied</SelectItem>
                            <SelectItem value="INTERVIEW">Interview</SelectItem>
                            <SelectItem value="OFFER">Offer</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant="outline"
                          className={`${statusColors[job.status]} cursor-pointer hover:opacity-80 transition-opacity`}
                          onClick={() => setEditingStatus(job.id)}
                        >
                          {statusLabels[job.status]}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{job.role}</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      {job.salary && <span className="font-medium">{job.salary}</span>}
                      <span>Applied {new Date(job.dateSubmitted).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.jobLink && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={job.jobLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={isPending ? "opacity-50 pointer-events-none" : ""}
    >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => handleEditJob(job)}>
      <Edit className="h-4 w-4 mr-2" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={() => handleDeleteJob(job.id)}
      className="text-red-600 focus:text-red-600"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  )
}
