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
      <div className="flex items-center justify-end -mt-3">
        <div className="text-sm leading-6">
          <Link
            href="#"
            className="font-semibold text-secondary hover:text-link"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </>
  );
}
