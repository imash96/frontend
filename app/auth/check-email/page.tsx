"use client"

import { Mail, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import Button from "@/ui/button"

export default function CheckEmailPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    const handleResend = async () => {
        if (!email) return
        setStatus("loading")
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setStatus("success")
        } catch (error) {
            setStatus("error")
        }
    }

    if (!email) {
        return (
            <div className="text-center animate-fade-in-up">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-7 w-7 text-destructive" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                    Invalid Request
                </h1>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Email address is missing from the request.
                </p>
                <div className="mt-8">
                    <Button href="/auth" variant="secondary" className="w-full">
                        Return to Sign In
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="mb-6 sm:mb-8 text-center animate-fade-in-up">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                    <Mail className="h-7 w-7 text-accent" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                    Verify your email
                </h1>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    We&apos;ve sent a verification link to <span className="font-semibold text-foreground">{email}</span>.
                    Please check your inbox and click the link to activate your account.
                </p>
            </div>

            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                {status === "success" ? (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">Verification email resent!</span>
                    </div>
                ) : (
                    <Button 
                        onClick={handleResend} 
                        variant="outline" 
                        className="w-full h-11"
                        isLoading={status === "loading"}
                        icon={<RefreshCw className="w-4 h-4" />}
                    >
                        Resend verification email
                    </Button>
                )}
            </div>

            <p className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                <Link
                    href="/auth"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2 transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                </Link>
            </p>
        </>
    )
}
