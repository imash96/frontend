import Link from "next/link";
import Input from "@/ui/input";

export default function SIGNIN() {
  return (
    <>
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        autoFocus
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />
      <div className="flex items-center justify-end -mt-2">
        <div className="text-sm leading-6">
          <Link
            href="/auth/forgot-password"
            className="font-semibold text-secondary hover:text-link transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </>
  );
}
