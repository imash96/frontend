import { PencilRuler } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Measurements | Velle Hide",
  description: "Save your body measurements for custom-fitted leather goods.",
};

export const instant = false;

export default function Page() {
  return (
    <section className="space-y-4 sm:space-y-6">
      <header className="space-y-2 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <PencilRuler size={20} />
          <h2 className="text-lg lg:text-xl font-medium tracking-wide uppercase">
            Measurements
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-prose">
          Save your body measurements for perfectly fitted custom leather
          garments and accessories.
        </p>
      </header>

      <div
        className="flex flex-col items-center justify-center py-16 sm:py-20 text-center border border-dashed border-border rounded-xl animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <PencilRuler size={28} className="text-accent" />
        </div>
        <p className="text-lg font-semibold font-heading">Coming Soon</p>
        <p className="text-muted-foreground text-sm mt-2 max-w-xs">
          We&apos;re working on a custom measurement feature so you can get
          perfectly fitted leather goods. Stay tuned!
        </p>
      </div>
    </section>
  );
}
