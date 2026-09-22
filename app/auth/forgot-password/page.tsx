"use client"

import { useActionState, useState } from "react"
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react"
import { requestPasswordReset } from "@/lib/action/customer"
import Input from "@/ui/input"
import Button from "@/ui/button"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [message, formAction, isPending] = useActionState(requestPasswordReset, null)

    if (message?.success) {
        return (
            <>
                <div className="mb-6 sm:mb-8 text-center animate-fade-in-up">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                        <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                        Check your email
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                        If an account exists with that email address, we&apos;ve sent instructions to reset your password.
                    </p>
                </div>

                <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    <Button href="/auth" variant="secondary" className="w-full">
                        Back to Sign In
                    </Button>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
                    Didn&apos;t receive the email? Check your spam folder or{" "}
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="font-semibold text-primary hover:underline underline-offset-2"
                    >
                        try again
                    </button>
                    .
                </p>
            </>
        )
    }

    return (
        <>
            {/* Heading */}
            <div className="mb-6 sm:mb-8 text-center animate-fade-in-up">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                    <Mail className="h-7 w-7 text-accent" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                    Forgot your password?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            {/* Form */}
            <form action={formAction} className="space-y-4 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
                <Input
                    label="Email address"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                />

                <Button
                    icon={<Mail className="w-4" />}
                    variant="secondary"
                    type="submit"
                    className="w-full h-11"
                    isLoading={isPending}
                >
                    Send Reset Link
                </Button>
            </form>

            {/* Error */}
            {message?.error && (
                <div
                    className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-fade-in-up"
                    role="alert"
                    aria-live="polite"
                >
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                    <p className="text-sm text-destructive">{message.error}</p>
                </div>
            )}

            {/* Back to login */}
            <p className="mt-6 text-center">
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
