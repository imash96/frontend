"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { completeOAuthCallback } from "@/lib/action/customer"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams()
    const code = searchParams.get("code")
    const params = searchParams.get("state")
    const router = useRouter()

    const [state, setState] = useState<"processing" | "success" | "error">("processing")
    const [errorMsg, setErrorMsg] = useState("")

    const processingStarted = useRef(false)

    useEffect(() => {
        if (processingStarted.current) return
        processingStarted.current = true

        if (!code) {
            setState("error")
            setErrorMsg("Missing authentication code from Google.")
            return
        }

        const processAuth = async () => {
            try {
                const result = await completeOAuthCallback("google", code, params)
                if (result.success) {
                    setState("success")
                    setTimeout(() => {
                        router.push("/account/profile")
                    }, 1000)
                } else {
                    setState("error")
                    setErrorMsg(result.error || "Failed to authenticate.")
                }
            } catch (error) {
                setState("error")
                setErrorMsg("An unexpected error occurred.")
            }
        }

        processAuth()
    }, [code, params, router])

    return (
        <main className="flex min-h-dvh items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
                {state === "processing" && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <h1 className="mt-4 text-lg font-semibold font-heading">
                            Authenticating...
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Please wait while we log you in securely.
                        </p>
                    </div>
                )}

                {state === "success" && (
                    <div className="flex flex-col items-center animate-fade-in-up">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h1 className="mt-4 text-lg font-semibold font-heading">
                            Success!
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Redirecting to your account...
                        </p>
                    </div>
                )}

                {state === "error" && (
                    <div className="flex flex-col items-center animate-fade-in-up">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <XCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <h1 className="mt-4 text-lg font-semibold font-heading">
                            Authentication Failed
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {errorMsg}
                        </p>
                        <button
                            onClick={() => router.push("/auth")}
                            className="mt-6 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        >
                            Return to Sign In
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}
