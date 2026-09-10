import Button from "@/ui/button";

export default function SignInPrompt() {
  return (
    <section
      aria-labelledby="signin-prompt-title"
      className="flex flex-col sm:flex-row items-center gap-2 bg-warning/30 p-4 rounded-lg border border-border shadow-sm"
    >
      {/* Left: text */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h3
          id="signin-prompt-title"
          className="text-lg font-semibold text-card-foreground"
        >
          Already have an account?
        </h3>
        <p className="mt-1 text-sm text-card-foreground-muted">
          Sign in to speed up checkout, view orders, and manage saved addresses.
        </p>
      </div>

      <Button
        href="/auth"
        variant="outline"
        color="primary"
        className="w-full sm:w-auto max-w-56"
        aria-label="Sign in to your account"
      >
        Sign in
      </Button>
    </section>
  );
}
