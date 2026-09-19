"use client"

import { confirmEmailVerification } from "@/lib/action/customer"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type VerificationState =
    | "verifying"
    | "success"
    | "error"

type VerifyAccountClientProps = {
    token: string | null
}

export default function VerifyAccountClient({
    token,
}: VerifyAccountClientProps) {
    const [state, setState] = useState<VerificationState>(
        token ? "verifying" : "error"
    )

    /**
     * React Strict Mode runs effects twice in development.
     * Prevent duplicate verification requests.
     */
    const verificationStarted = useRef(false)

    useEffect(() => {
        if (verificationStarted.current) {
            return
        }

        verificationStarted.current = true

        if (!token) {
            setState("error")
            return
        }

        let active = true

        const verify = async () => {
            try {
                const result = await confirmEmailVerification(token)

                if (!active) {
                    return
                }

                setState(result.success ? "success" : "error")
            } catch {
                if (!active) {
                    return
                }

                setState("error")
            }
        }

        void verify()

        return () => {
            active = false
        }
    }, [token])

    return (
        <main className="relative flex min-h-[calc(100svh-80px)] items-center justify-center overflow-hidden bg-[#f8f5f2] px-4 py-12 sm:px-6">
            {/* Ambient background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute left-[10%] top-[15%] h-64 w-64 rounded-full bg-[#4f3424]/5 blur-3xl" />
                <div className="absolute bottom-[10%] right-[5%] h-72 w-72 rounded-full bg-[#4f3424]/5 blur-3xl" />
            </div>

            <section className="relative w-full max-w-md">
                <div className="rounded-3xl border border-black/5 bg-white/90 p-7 shadow-[0_30px_80px_rgba(40,25,15,0.10)] backdrop-blur-xl sm:p-10">
                    {/* Brand */}
                    <div className="mb-8 text-center">
                        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#4f3424]/60">
                            VELLE HIDE
                        </div>

                        <div className="mx-auto h-px w-10 bg-[#4f3424]/20" />
                    </div>

                    {/* Animated state */}
                    <div
                        key={state}
                        className="animate-[verify-enter_450ms_cubic-bezier(0.22,1,0.36,1)] text-center"
                    >
                        {state === "verifying" && (
                            <VerifyingState />
                        )}

                        {state === "success" && (
                            <SuccessState />
                        )}

                        {state === "error" && (
                            <ErrorState />
                        )}
                    </div>
                </div>

                {/* Small footer */}
                <p className="mt-6 text-center text-xs leading-5 text-[#4f3424]/45">
                    Secure account verification
                </p>
            </section>
        </main>
    )
}

function VerifyingState() {
    return (
        <>
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#4f3424]/8">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#4f3424]/10 animate-pulse">
                    <svg
                        className="h-7 w-7 animate-spin text-[#4f3424]"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                            className="opacity-20"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        />

                        <path
                            d="M21 12a9 9 0 0 1-9 9"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[#241812] sm:text-3xl">
                Verifying your email
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#4f3424]/60">
                Please wait while we securely confirm your email address.
            </p>

            <div className="mx-auto mt-7 flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4f3424]/40 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#4f3424]/40 animate-pulse [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#4f3424]/40 animate-pulse [animation-delay:300ms]" />
            </div>
        </>
    )
}

function SuccessState() {
    return (
        <>
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <svg
                        className="h-7 w-7 text-emerald-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M5 12.5 9.2 17 19 7"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="verify-check"
                        />
                    </svg>
                </div>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[#241812] sm:text-3xl">
                Email verified
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#4f3424]/60">
                Your email address has been successfully verified.
                Your VELLE HIDE account is ready to use.
            </p>

            <div className="mt-8">
                <Link
                    href="/login"
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4f3424] px-6 text-sm font-semibold text-white shadow-lg shadow-[#4f3424]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3e291e] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#4f3424]/30 focus:ring-offset-2 active:translate-y-0"
                >
                    Go to login

                    <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M4 10h11M11 5l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>
        </>
    )
}

function ErrorState() {
    return (
        <>
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <svg
                        className="h-7 w-7 animate-[verify-shake_500ms_ease-out] text-red-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M12 8v5"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                        />
                        <circle
                            cx="12"
                            cy="17"
                            r="1.15"
                            fill="currentColor"
                        />
                        <path
                            d="M10.3 4.6 3.8 16a2 2 0 0 0 1.74 3h12.92a2 2 0 0 0 1.74-3L13.7 4.6a2 2 0 0 0-3.4 0Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[#241812] sm:text-3xl">
                Verification failed
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#4f3424]/60">
                This verification link is invalid or has expired.
                Please log in again to receive a new verification
                email.
            </p>

            <div className="mt-8">
                <Link
                    href="/login"
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#4f3424]/15 bg-white px-6 text-sm font-semibold text-[#4f3424] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4f3424]/25 hover:bg-[#faf8f6] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4f3424]/20 focus:ring-offset-2 active:translate-y-0"
                >
                    Return to login

                    <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M4 10h11M11 5l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>
        </>
    )
}