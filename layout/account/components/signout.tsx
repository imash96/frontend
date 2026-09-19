"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useTransition } from "react";
import { signout } from "@/lib/action/customer";

export default function SignoutButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => signout())}
      className="
        mt-1.5 px-2.5 py-1
        inline-flex items-center gap-1.5
        text-xs font-medium
        rounded-md border border-transparent
        text-btn-destructive
        hover:text-btn-destructive-hover
        hover:bg-destructive/10
        hover:border-destructive/20
        transition-all duration-200
        focus:outline-none
        focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-btn-destructive
      "
      aria-label="Sign out of your account"
    >
      Sign out
      {isPending ? (
        <LoaderCircle aria-hidden="true" size={14} className="animate-spin" />
      ) : (
        <LogOut aria-hidden="true" size={14} strokeWidth={1.5} />
      )}
    </button>
  );
}
