"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useTransition } from "react";
import { signout } from "@/lib/action/customer";

export default function SignoutButton() {
  const [isRemoving, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => signout())}
      className="mt-1 p-0.5 inline-flex items-center gap-1 text-xs font-light underline underline-offset-2 text-btn-destructive hover:text-btn-destructive-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-btn-destructive"
      aria-label="Sign out"
    >
      Sign out{" "}
      {isRemoving ? (
        <LoaderCircle aria-hidden="true" size={14} className="animate-spin" />
      ) : (
        <LogOut aria-hidden="true" size={14} strokeWidth={1.5} />
      )}
    </button>
  );
}
