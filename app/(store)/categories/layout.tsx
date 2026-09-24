import Button from "@/ui/button";

export default function StoreLayout({ children }: LayoutProps<"/categories">) {
    return (
        <>
            {children}

            {/* Bottom CTA */}
            <div className="bg-surface-sunken border-t border-border mt-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center space-y-4">
                    <h2 className="font-heading font-semibold text-xl md:text-2xl text-text-primary tracking-tight">
                        Can&apos;t find what you&apos;re looking for?
                    </h2>
                    <p className="text-sm text-text-secondary max-w-md mx-auto">
                        Browse our full collection or reach out to our styling team for personalized recommendations.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <Button href="/contact-us">Contact Us</Button>
                    </div>
                </div>
            </div>
        </>
    );
}