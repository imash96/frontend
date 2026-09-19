"use client";

import { AlertTriangle, RefreshCw, UserRound } from "lucide-react";
import Button from "@/ui/button";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold font-heading">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          We encountered an issue while loading this page. Please try again or
          navigate back to your profile.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono mt-2">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={reset}
          variant="secondary"
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Try again
        </Button>
        <Button
          href="/account/profile"
          variant="outline"
          icon={<UserRound className="w-4 h-4" />}
        >
          Back to Profile
        </Button>
      </div>
    </div>
  );
}
