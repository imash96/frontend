import { ShieldX } from "lucide-react";
import Button from "@/ui/button";

export default function AuthNotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 sm:px-8">
      <div className="w-full max-w-sm text-center space-y-6 animate-fade-in-up">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <ShieldX className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold font-heading">Page not found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            The authentication page you&apos;re looking for doesn&apos;t exist.
            Please sign in to continue.
          </p>
        </div>

        <Button href="/auth" variant="secondary">
          Go to Sign In
        </Button>
      </div>
    </main>
  );
}
