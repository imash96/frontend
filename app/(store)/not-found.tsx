import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import Button from "@/ui/button";
import Container from "@/ui/container";

export const metadata: Metadata = {
    title: "Page Not Found",
    robots: { index: false, follow: false },
};

export default function StoreNotFound() {
    return (
        <Container size="sm" className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16 text-center">
            <p className="font-heading text-6xl font-bold text-primary/20">404</p>
            <div className="max-w-sm space-y-1.5">
                <h1 className="text-lg font-semibold text-text-primary">
                    We couldn&apos;t find that page
                </h1>
                <p className="text-sm leading-relaxed text-text-secondary">
                    It may have been moved, renamed, or the link may be out of date.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
                <Button href="/categories" variant="primary" icon={<Compass className="h-4 w-4" />}>
                    Browse Categories
                </Button>
                <Button href="/" variant="outline">
                    Homepage
                </Button>
            </div>
            <p className="text-xs text-text-tertiary">
                Looking for something specific?{" "}
                <Link href="/contact-us" className="underline underline-offset-2 hover:text-text-primary">
                    Contact us
                </Link>
                .
            </p>
        </Container>
    );
}