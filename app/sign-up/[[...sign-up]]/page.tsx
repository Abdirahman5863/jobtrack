import { SignUp } from "@clerk/nextjs"
import { Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        
        {/* Back button + Logo */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">ApplyList</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create an account</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Sign up to start tracking your job applications
          </p>
        </div>

        {/* Clerk Signup */}
        <SignUp
          appearance={{
            elements: {
              card: "bg-card border border-border shadow-lg rounded-xl p-6",
              headerTitle: "hidden",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton__google: "bg-white hover:bg-white/60",
              dividerText: "text-muted-foreground",
              dividerLine: "bg-border",
              formFieldLabel: "text-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formFieldInput: "border-border bg-input",
              footer: "hidden",
            },
          }}
          redirectUrl="/dashboard"
        />

        {/* Already have an account link */}
        <p className="text-lg text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline hover:text-foreground">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
