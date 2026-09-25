"use client"

import { AlertCircle, ArrowLeft, CheckCircle2, Lock } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { resetPasswordWithToken } from "@/lib/action/customer"
import Button from "@/ui/button"
import Input from "@/ui/input"

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [message, formAction, isPending] = useActionState(resetPasswordWithToken, null)

    if (!token) {
        return (
            <>
                <div className="mb-6 sm:mb-8 text-center animate-fade-in-up">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-7 w-7 text-destructive" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                        Invalid reset link
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                        This password reset link is missing or invalid.
                        Please request a new one.
                    </p>
                </div>

                <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    <Button href="/auth/forgot-password" variant="secondary" className="w-full">
                        Request New Link
                    </Button>
                    <Button href="/auth" variant="outline" className="w-full">
                        Back to Sign In
                    </Button>
                </div>
            </>
        )
    }

    if (message?.success) {
        return (
            <>
                <div className="mb-6 sm:mb-8 text-center animate-fade-in-up">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                        <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                        Password updated
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                        Your password has been successfully reset. You can now sign in with your new password.
                    </p>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    <Button href="/auth" variant="secondary" className="w-full">
                        Sign In
                    </Button>
                </div>
            </>
        )
    }

    return (
        <>
            {/* Heading */}
            <div className="mb-6 sm:mb-8 text-center animate-fade-in-up">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                    <Lock className="h-7 w-7 text-accent" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                    Set a new password
                </h1>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Choose a strong password with at least 8 characters.
                </p>
            </div>

            {/* Form */}
            <form action={formAction} className="space-y-4 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
                <input type="hidden" name="token" value={token} />

                <Input
                    label="New password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    autoFocus
                />
                <Input
                    label="Confirm password"
                    name="confirm_password"
                    type="password"
                    required
                    autoComplete="new-password"
                />

                <Button
                    icon={<Lock className="w-4" />}
                    variant="secondary"
                    type="submit"
                    className="w-full h-11"
                    isLoading={isPending}
                >
                    Reset Password
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

            {/* Back */}
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
