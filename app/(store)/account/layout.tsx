import { notFound } from "next/navigation";
import { use } from "react";
import AccountFooter from "@/layout/account/components/account-footer";
import SignoutButton from "@/layout/account/components/signout";
import DashNav from "@/layout/account/templates/dash-nav";
import { retrieveCustomer } from "@/lib/action/customer";
import Container from "@/ui/container";

/* Account section is fully user-specific (reads auth cookies) */
export const instant = false;

export default function Layout({ children }: LayoutProps<"/account">) {
  const customer = use(retrieveCustomer());
  if (!customer) return notFound();

  const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Customer";

  const initials = fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Container size="lg" className="py-6 md:py-10 lg:py-12">
      <div className="flex flex-col lg:flex-row min-h-dvh gap-0 lg:gap-6">
        {/* Sidebar */}
        <aside className="lg:w-64 xl:w-72 lg:shrink-0 lg:sticky top-20 h-fit animate-fade-in-up">
          {/* Customer Info Card */}
          <div className="flex items-center gap-4 p-4 lg:p-5 border-b lg:border lg:rounded-xl lg:border-border lg:bg-surface-elevated lg:shadow-sm">
            <div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-linear-to-br from-accent/20 to-accent/5 border border-accent/30 shrink-0">
              <span className="text-sm lg:text-base font-semibold text-accent font-heading">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm lg:text-base font-semibold truncate">
                {fullName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {customer.email}
              </p>
              <SignoutButton />
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:mt-3 lg:border lg:rounded-xl lg:border-border lg:bg-surface-elevated lg:shadow-sm overflow-hidden">
            <DashNav />
          </div>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 py-4 lg:py-0 min-w-0 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {children}
        </main>
      </div>

      <hr className="my-8 lg:my-12 border-border" />
      <AccountFooter />
    </Container>
  );
}
