import { ShieldX } from "lucide-react";
import Button from "@/ui/button";

export default function AccountNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center animate-fade-in-up">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <ShieldX className="w-8 h-8 text-muted-foreground" />
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold font-heading">Page not found</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          The account page you&apos;re looking for doesn&apos;t exist. Please
          check the URL or navigate back to your profile.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button href="/account/profile" variant="secondary">
          Go to Profile
        </Button>
        <Button href="/auth" variant="outline">
          Sign In
        </Button>
      </div>
    </div>
  );
}
