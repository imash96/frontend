"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "@/ui/button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 sm:px-8">
      <div className="w-full max-w-sm text-center space-y-6 animate-fade-in-up">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold font-heading">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            We encountered an issue while loading the authentication page.
            Please try again.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="secondary"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Try again
          </Button>
          <Button href="/" variant="outline">
            Go home
          </Button>
        </div>
      </div>
    </main>
  );
}
