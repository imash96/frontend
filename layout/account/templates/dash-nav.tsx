"use client";

import {
  BookUser,
  Heart,
  MessageSquare,
  Package,
  PencilRuler,
  UserRound,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Account navigation"
      className="p-2 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar"
    >
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.id}
            href={item.href as Route}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center m-1 gap-3 border-b-4 lg:border-b-0 lg:border-l-4 px-4 py-2 lg:px-3 lg:py-2.5 rounded-lg transition-all duration-150 ${isActive ? "bg-accent/20 border-accent" : "hover:bg-background-muted lg:border-transparent hover:border-border-hover"} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1`}
          >
            <div className="flex w-full flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-3">
              <item.icon
                size={20}
                strokeWidth={1.2}
                className={isActive ? "text-accent" : ""}
                aria-hidden="true"
              />
              <div className="flex flex-col min-w-0 text-center lg:text-left">
                <span
                  className={`text-sm ${isActive ? "font-semibold text-accent" : "font-medium"} truncate`}
                >
                  {item.label}
                </span>
                <span className="hidden lg:block text-xs text-foreground-muted truncate">
                  {item.description}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

const navigationItems = [
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
    href: "/account/profile",
    description: "Personal information",
  },
  {
    id: "addresses",
    label: "Addresses",
    icon: BookUser,
    href: "/account/addresses",
    description: "Shipping addresses",
  },
  {
    id: "orders",
    label: "Orders",
    icon: Package,
    href: "/account/orders",
    description: "Order history",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: MessageSquare,
    href: "/account/reviews",
    description: "Your reviews",
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: Heart,
    href: "/account/wishlist",
    description: "Saved items",
  },
  {
    id: "measurement",
    label: "Measure",
    icon: PencilRuler,
    href: "/account/measurements",
    description: "Custom sizing",
  },
];
