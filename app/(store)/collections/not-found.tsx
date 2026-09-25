import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/ui/button";

export const metadata: Metadata = {
    title: "Page Not Found",
    robots: { index: false, follow: false },
};

export default function CollectionsNotFound() {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center" tabIndex={-1}>
            <p className="font-heading text-7xl font-bold text-primary/20">404</p>
            <div className="max-w-sm space-y-2">
                <h1 className="text-xl font-semibold">We couldn&apos;t find that page</h1>
                <p className="text-sm leading-relaxed text-foreground-muted">
                    The page you&apos;re looking for may have been moved or no longer
                    exists. Let&apos;s get you back on track.
                </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/" variant="primary">
                    Back to homepage
                </Button>
                <Button href="/collections" variant="outline" icon={<Compass className="h-4 w-4" />}>
                    Browse collections
                </Button>
            </div>
            <p className="text-xs text-foreground-muted">
                Or{" "}
                <Link href="/contact-us" className="underline underline-offset-2 hover:text-foreground">
                    contact our support team
                </Link>
                .
            </p>
        </main>
    );
}