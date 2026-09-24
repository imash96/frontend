import { HelpCircle, Mail, RotateCcw } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

const quickLinks = [
  {
    icon: HelpCircle,
    label: "FAQ",
    description: "Find answers to common questions",
    href: "/faqs",
  },
  {
    icon: Mail,
    label: "Contact Us",
    description: "Get in touch with our support team",
    href: "/contact-us",
  },
  {
    icon: RotateCcw,
    label: "Returns & Exchanges",
    description: "Learn about our return policy",
    href: "/policy/refund-policy",
  },
];

export default function AccountFooter() {
  return (
    <div className="py-4">
      <h3 className="text-lg font-semibold mb-4 font-heading">
        Need Help?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href as Route}
            className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-background-elevated hover:bg-background-muted hover:border-border-strong transition-all duration-200"
          >
            <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors shrink-0">
              <link.icon className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{link.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {link.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
