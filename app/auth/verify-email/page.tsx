import type { Metadata } from "next"
import VerifyAccountClient from "./verify-account-client"

import "@/css/verify-account.css"

export const instant = false;

export const metadata: Metadata = {
    title: "Verify Your Email | VELLE HIDE",
    robots: {
        index: false,
        follow: false,
    },
}

type VerifyAccountPageProps = {
    searchParams: Promise<{
        token?: string | string[]
        email?: string | string[]
    }>
}

export default async function VerifyAccountPage({
    searchParams,
}: VerifyAccountPageProps) {
    const params = await searchParams

    const token = typeof params.token === "string" ? params.token : null

    return (
        <VerifyAccountClient
            token={token}
        />
    )
}