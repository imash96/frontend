export default function AuthLoading() {
  return (
    <main className="flex min-h-dvh">
      {/* Left Banner Skeleton (Desktop only) */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)", backgroundSize: "200% 100%" }} />

      {/* Right Panel Skeleton */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center items-center px-5 sm:px-8 md:px-12">
        {/* Logo skeleton */}
        <div className="pt-6 lg:pt-10 xl:pt-20">
          <div className="h-8 w-32 rounded bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)", backgroundSize: "200% 100%" }} />
        </div>

        <div className="flex flex-1 items-center justify-center w-full">
          <div className="w-full max-w-xs sm:max-w-sm p-4 sm:p-6 space-y-6">
            {/* Heading skeleton */}
            <div className="text-center space-y-3">
              <div className="h-7 w-40 mx-auto rounded bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)", backgroundSize: "200% 100%" }} />
              <div className="h-4 w-60 mx-auto rounded bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)", backgroundSize: "200% 100%", animationDelay: "100ms" }} />
            </div>

            {/* Input skeletons */}
            <div className="space-y-4">
              <div className="h-12 w-full rounded-md bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)", backgroundSize: "200% 100%", animationDelay: "200ms" }} />
              <div className="h-12 w-full rounded-md bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)", backgroundSize: "200% 100%", animationDelay: "300ms" }} />
            </div>

            {/* Button skeleton */}
            <div className="h-11 w-full rounded-md bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)", backgroundSize: "200% 100%", animationDelay: "400ms" }} />

            {/* Divider skeleton */}
            <div className="h-px w-full bg-border" />

            {/* Social buttons skeleton */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 rounded-md bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)", backgroundSize: "200% 100%", animationDelay: "500ms" }} />
              <div className="h-10 rounded-md bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)", backgroundSize: "200% 100%", animationDelay: "600ms" }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
