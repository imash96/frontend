"use client"

import { CreditCard, FileText, RotateCcw, ShieldCheck, Truck } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import InteractiveLink from "@/module/common/templates/interactive-link"
import Container from "@/ui/container"

export default function DashLayout({ children }: LayoutProps<"/policy">) {
  const pathname = usePathname()
  return (
    <Container size="lg" className="py-6 md:py-10 lg:py-12">
      <div className="flex flex-col lg:flex-row min-h-screen gap-6">
        {/* Sidebar */}
        <aside className="lg:mx-4 lg:sticky top-20 h-fit space-y-4 border-b lg:border-b-0 lg:pr-0">
          <nav aria-label="policy navigation" className="p-2 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
            {navigationItems.map((item) => {
              const isActive = pathname === item.slug
              return (
                <Link key={item.id} href={`/policy/${item.slug}` as Route} aria-current={isActive ? "page" : undefined}
                  className={`flex items-center m-1 gap-3 border-b-4 lg:border-b-0 lg:border-l-4 px-4 py-2 lg:px-3 lg:py-2.5 rounded-lg transition-all duration-150 ${isActive ? "bg-accent/20 border-accent" : "hover:bg-background-muted lg:border-transparent hover:border-border-hover"} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1`}
                >
                  <div className="flex w-full flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-3">
                    <item.icon
                      size={20}
                      strokeWidth={1.4}
                      className={isActive ? "text-accent" : "text-foreground-muted"}
                      aria-hidden="true"
                    />
                    <div className="flex flex-col min-w-0 text-center lg:text-left">
                      <span className={`text-sm ${isActive ? "font-semibold text-accent" : "font-medium"} truncate`}>
                        {item.label}
                      </span>
                      <span className="hidden lg:block text-xs text-foreground-muted truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:border-l py-2">
          <main className="mx-auto max-w-3xl">
            {children}
          </main>
        </div>
      </div>

      {/* Footer help section */}
      <hr className="mt-8" />
      <div className="py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Got questions?</h3>
          <p className="text-sm text-foreground-muted">
            You can find answers in our customer service section.
          </p>
        </div>
        <InteractiveLink href="/contact-us">Customer Service</InteractiveLink>
      </div>
    </Container>
  )
}

const navigationItems = [
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: ShieldCheck,
    slug: "privacy-policy",
    description: "How we protect your data",
  },
  {
    id: "return",
    label: "Return & Refund",
    icon: RotateCcw,
    slug: "return-and-refund-policy",
    description: "Easy returns & refunds",
  },
  {
    id: "shipping",
    label: "Shipping Policy",
    icon: Truck,
    slug: "shipping-policy",
    description: "Delivery details",
  },
  {
    id: "payment",
    label: "Payment Policy",
    icon: CreditCard,
    slug: "payment-policy",
    description: "Secure payments",
  },
  {
    id: "terms",
    label: "Terms of Sale",
    icon: FileText,
    slug: "terms-of-sale",
    description: "Purchase terms",
  },
]