import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, ExternalLink, MoreHorizontal, Edit, Trash2, Briefcase, Building2, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const demoJobs = [
    {
      id: "1",
      companyName: "Google",
      role: "Senior Software Engineer",
      status: "APPLIED",
      salary: "$150,000 - $200,000",
      dateSubmitted: "2024-01-15",
      jobLink: "#",
      notes: "Applied through LinkedIn. Hiring manager is Sarah Johnson.",
    },
    {
      id: "2",
      companyName: "Microsoft",
      role: "Full Stack Developer",
      status: "INTERVIEW",
      salary: "$120,000 - $160,000",
      dateSubmitted: "2024-01-10",
      jobLink: "#",
      notes: "First interview scheduled for next week.",
    },
    {
      id: "3",
      companyName: "Apple",
      role: "iOS Developer",
      status: "OFFER",
      salary: "$140,000 - $180,000",
      dateSubmitted: "2024-01-05",
      jobLink: "#",
      notes: "Received offer! Negotiating salary and benefits.",
    },
    {
      id: "4",
      companyName: "Netflix",
      role: "Backend Engineer",
      status: "REJECTED",
      salary: "$130,000 - $170,000",
      dateSubmitted: "2024-01-01",
      jobLink: "#",
      notes: "Didn't pass the technical interview.",
    },
  ]

  const demoStats = {
    total: 4,
    applied: 1,
    interview: 1,
    offer: 1,
    rejected: 1,
    withdrawn: 0,
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-300/50 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-xl font-bold text-foreground">ApplyList</span>
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                Demo
              </Badge>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Demo Dashboard</h1>
          <p className="text-muted-foreground">See how ApplyList helps you organize your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{demoStats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{demoStats.applied}</div>
              <div className="text-sm text-muted-foreground">Applied</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-amber-600">{demoStats.interview}</div>
              <div className="text-sm text-muted-foreground">Interviews</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{demoStats.offer}</div>
              <div className="text-sm text-muted-foreground">Offers</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Application Button */}
        <div className="flex justify-center mb-8">
          <Button size="lg" className="gap-2" disabled>
            <Plus className="h-5 w-5" />
            Add New Application
          </Button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {demoJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold text-foreground">{job.companyName}</h3>
                      <Badge
                        variant="outline"
                        className={`${statusColors[job.status as keyof typeof statusColors]} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        {statusLabels[job.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{job.role}</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      {job.salary && <span className="font-medium">{job.salary}</span>}
                      <span>Applied {new Date(job.dateSubmitted).toLocaleDateString()}</span>
                    </div>

                    {job.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{job.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {job.jobLink && (
                      <Button variant="ghost" size="sm" disabled>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" disabled>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Notice */}
        <Card className="mt-8 border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">This is a Demo</h3>
              <p className="text-orange-700 mb-4">
                This shows how ApplyList looks and feels. Create your account to start tracking your own job applications!
              </p>
              <Button asChild>
                <Link href="/sign-up">
                  Start Your Free Trial
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
