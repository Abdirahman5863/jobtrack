import { SignUp } from "@clerk/nextjs"
import { Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">ApplyList</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground">Start tracking your job applications today</p>
        </div>

        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                card: "shadow-none border border-border",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: "border-border text-foreground hover:bg-muted",
                formFieldInput: "border-border bg-input",
                footerActionLink: "text-primary hover:text-primary/90",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  )
}
