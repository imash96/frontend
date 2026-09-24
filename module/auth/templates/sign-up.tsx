import Input from "@/ui/input";
import Link from "next/link";

export default function SIGNUP() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Input
          label="First name"
          name="first_name"
          required
          autoComplete="given-name"
          className="w-full"
          autoFocus
        />
        <Input
          label="Last name"
          name="last_name"
          required
          autoComplete="family-name"
          className="w-full"
        />
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
      />
      <Input label="Phone" name="phone" type="tel" autoComplete="tel" />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="new-password"
      />
      <p className="text-xs text-muted-foreground leading-relaxed -mt-1">
        By creating an account, you agree to our{" "}
        <Link href="/policy/terms-of-sale" className="underline underline-offset-2 hover:text-foreground transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/policy/privacy-policy" className="underline underline-offset-2 hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
