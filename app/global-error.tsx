"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en" className={inter.className}>
            <body style={{ margin: 0 }}>
                <main
                    style={{
                        display: "flex",
                        minHeight: "100dvh",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1.5rem",
                        padding: "1.25rem",
                        textAlign: "center",
                        background: "#F9F6F3",
                        color: "#241812",
                    }}
                >
                    <AlertTriangle size={40} color="#b3261e" aria-hidden="true" />
                    <div style={{ maxWidth: 380 }}>
                        <h1 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>
                            Velle Hide is temporarily unavailable
                        </h1>
                        <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#5c5044" }}>
                            A critical error stopped the page from loading. Try again in a
                            moment.
                        </p>
                        {error.digest && (
                            <p style={{ fontFamily: "monospace", fontSize: "0.75rem", marginTop: 8 }}>
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={reset}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "0.625rem 1.25rem",
                            borderRadius: 8,
                            border: "none",
                            background: "#452817",
                            color: "#fff",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        <RefreshCw size={16} aria-hidden="true" />
                        Try again
                    </button>
                </main>
            </body>
        </html>
    );
}